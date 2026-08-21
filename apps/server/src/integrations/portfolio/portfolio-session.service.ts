import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepo } from '@docmost/db/repos/user/user.repo';
import { getPageTitle, isUserDisabled } from '../../common/helpers';
import { TokenService } from '../../core/auth/services/token.service';
import { PageAccessService } from '../../core/page/page-access/page-access.service';
import { PageService } from '../../core/page/services/page.service';
import { EnvironmentService } from '../environment/environment.service';

const PORTFOLIO_SESSION_TTL_MS = 15 * 60 * 1000;

type SupabaseAuthUser = {
  id?: string;
  email?: string;
};

/**
 * Exchanges ahmedramzy.com's existing Supabase admin identity for a short-lived
 * Ramzy Studio editing session. The browser never receives or stores a service
 * integration secret and never needs a second Docmost login.
 */
@Injectable()
export class PortfolioSessionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly environmentService: EnvironmentService,
    private readonly pageService: PageService,
    private readonly pageAccessService: PageAccessService,
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
  ) {}

  async exchange(pageIdInput: string, supabaseAccessToken: string) {
    const pageId = pageIdInput?.trim();
    const accessToken = supabaseAccessToken?.trim();

    if (!pageId) {
      throw new NotFoundException('Ramzy Studio page not found');
    }

    if (!accessToken) {
      throw new UnauthorizedException('Admin authentication is required');
    }

    const page = await this.pageService.findById(pageId, true);

    if (!page || page.deletedAt) {
      throw new NotFoundException('Ramzy Studio page not found');
    }

    const adminIdentity = await this.verifySupabaseAdmin(accessToken);
    const email = adminIdentity.email?.trim();

    if (!email) {
      throw new UnauthorizedException('Admin account has no verified email');
    }

    const user = await this.userRepo.findByEmail(email, page.workspaceId);

    if (!user || isUserDisabled(user)) {
      throw new ForbiddenException(
        'This admin account is not linked to a Ramzy Studio editor account',
      );
    }

    await this.pageAccessService.validateCanEdit(page, user);

    const [studioAccessToken, collaborationToken] = await Promise.all([
      this.tokenService.generatePortfolioAccessToken(user),
      this.tokenService.generatePortfolioCollabToken(user, page.workspaceId),
    ]);

    const expiresAt = new Date(Date.now() + PORTFOLIO_SESSION_TTL_MS);

    return {
      session: {
        accessToken: studioAccessToken,
        collaborationToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl ?? null,
        },
        apiUrl: `${this.environmentService.getAppUrl()}/api`,
        collaborationUrl: this.getCollaborationUrl(),
        expiresAt: expiresAt.toISOString(),
      },
      document: {
        id: page.id,
        title: getPageTitle(page.title),
        content: page.content ?? null,
        updatedAt: page.updatedAt,
      },
    };
  }

  private async verifySupabaseAdmin(
    accessToken: string,
  ): Promise<SupabaseAuthUser> {
    const supabaseUrl = (
      this.configService.get<string>('PORTFOLIO_SUPABASE_URL') ||
      this.configService.get<string>('SUPABASE_URL') ||
      ''
    ).replace(/\/+$/, '');

    const apiKey =
      this.configService.get<string>('PORTFOLIO_SUPABASE_PUBLISHABLE_KEY') ||
      this.configService.get<string>('PORTFOLIO_SUPABASE_ANON_KEY') ||
      this.configService.get<string>('SUPABASE_PUBLISHABLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY') ||
      '';

    if (!supabaseUrl || !apiKey) {
      throw new ServiceUnavailableException(
        'Portfolio admin identity verification is not configured',
      );
    }

    let response: Response;

    try {
      response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Portfolio admin identity provider is unavailable',
      );
    }

    if (!response.ok) {
      throw new UnauthorizedException('Admin session is invalid or expired');
    }

    const user = (await response.json().catch(() => null)) as
      | SupabaseAuthUser
      | null;

    if (!user?.id) {
      throw new UnauthorizedException('Admin session is invalid or expired');
    }

    return user;
  }

  private getCollaborationUrl(): string {
    const baseUrl =
      this.environmentService.getCollabUrl() ||
      this.environmentService.getAppUrl();

    const url = new URL('/collab', baseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return url.toString();
  }
}
