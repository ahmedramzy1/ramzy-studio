import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectKysely } from 'nestjs-kysely';
import { sql } from 'kysely';
import { KyselyDB } from '@docmost/db/types/kysely.types';
import { SpaceRepo } from '@docmost/db/repos/space/space.repo';
import { UserRepo } from '@docmost/db/repos/user/user.repo';
import { Page, User } from '@docmost/db/types/entity.types';
import { getPageTitle, isUserDisabled } from '../../common/helpers';
import { createYdocFromJson } from '../../common/helpers/prosemirror/utils';
import { jsonToText } from '../../collaboration/collaboration.util';
import { TokenService } from '../../core/auth/services/token.service';
import { PageAccessService } from '../../core/page/page-access/page-access.service';
import { PageService } from '../../core/page/services/page.service';
import SpaceAbilityFactory from '../../core/casl/abilities/space-ability.factory';
import {
  SpaceCaslAction,
  SpaceCaslSubject,
} from '../../core/casl/interfaces/space-ability.type';
import { EnvironmentService } from '../environment/environment.service';

const PORTFOLIO_SESSION_TTL_MS = 15 * 60 * 1000;
const DEFAULT_PORTFOLIO_SPACE_SLUG = 'general';

const EMPTY_PORTFOLIO_DOCUMENT = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

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
    private readonly spaceRepo: SpaceRepo,
    private readonly spaceAbility: SpaceAbilityFactory,
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
    @InjectKysely() private readonly db: KyselyDB,
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

    return this.buildSessionResponse(page, user);
  }

  /**
   * Create the canonical Ramzy Studio document for a portfolio project and
   * immediately return an editing session for it. Draft documents remain
   * private; public sharing is created only when the portfolio is published.
   */
  async bootstrapPage(
    projectIdInput: string,
    titleInput: string,
    supabaseAccessToken: string,
  ) {
    const projectId = projectIdInput?.trim();
    const title = titleInput?.trim() || 'Untitled Project';
    const accessToken = supabaseAccessToken?.trim();

    if (!projectId) {
      throw new NotFoundException('Portfolio project not found');
    }

    if (!accessToken) {
      throw new UnauthorizedException('Admin authentication is required');
    }

    const adminIdentity = await this.verifySupabaseAdmin(accessToken);
    const email = adminIdentity.email?.trim();

    if (!email) {
      throw new UnauthorizedException('Admin account has no verified email');
    }

    const user = await this.resolvePortfolioUser(email);
    const space = await this.resolvePortfolioSpace(user);

    const ability = await this.spaceAbility.createForUser(user, space.id);
    if (ability.cannot(SpaceCaslAction.Create, SpaceCaslSubject.Page)) {
      throw new ForbiddenException(
        'This Ramzy Studio account cannot create portfolio documents in the configured space',
      );
    }

    const createdPage = await this.pageService.create(
      user.id,
      user.workspaceId,
      {
        title,
        spaceId: space.id,
        content: EMPTY_PORTFOLIO_DOCUMENT,
        format: 'json',
      },
    );

    const page = await this.pageService.findById(createdPage.id, true);

    return {
      projectId,
      ...(await this.buildSessionResponse(page, user)),
    };
  }

  /**
   * Persist a draft authored by the embedded portfolio editor without requiring
   * a WebSocket collaboration handshake. The same canonical ProseMirror JSON,
   * text index and Yjs snapshot are written that Docmost pages use normally, so
   * opening the document later in standalone Ramzy Studio remains lossless.
   */
  async saveDraft(
    pageIdInput: string,
    content: Page['content'],
    user: User,
  ) {
    const pageId = pageIdInput?.trim();

    if (!pageId) {
      throw new BadRequestException('pageId is required');
    }

    if (!content || typeof content !== 'object') {
      throw new BadRequestException('content must be a Ramzy Studio document');
    }

    const page = await this.pageService.findById(pageId, true);

    if (!page || page.deletedAt) {
      throw new NotFoundException('Ramzy Studio page not found');
    }

    await this.pageAccessService.validateCanEdit(page, user);

    const contributors = new Set<string>(page.contributorIds ?? []);
    contributors.add(user.id);
    const updatedAt = new Date();

    await this.db
      .updateTable('pages')
      .set({
        content,
        textContent: jsonToText(content),
        ydoc: createYdocFromJson(content),
        lastUpdatedById: user.id,
        contributorIds: Array.from(contributors),
        updatedAt,
      })
      .where('id', '=', page.id)
      .executeTakeFirst();

    return {
      document: {
        id: page.id,
        title: getPageTitle(page.title),
        content,
        updatedAt,
      },
    };
  }

  private async resolvePortfolioUser(email: string): Promise<User> {
    const configuredWorkspaceId = this.configService
      .get<string>('PORTFOLIO_WORKSPACE_ID')
      ?.trim();

    let query = this.db
      .selectFrom('users')
      .select(['id', 'workspaceId'])
      .where(sql`LOWER(email)`, '=', sql`LOWER(${email})`)
      .where('deletedAt', 'is', null)
      .where('deactivatedAt', 'is', null);

    if (configuredWorkspaceId) {
      query = query.where('workspaceId', '=', configuredWorkspaceId);
    }

    const candidates = await query.execute();

    if (candidates.length === 0) {
      throw new ForbiddenException(
        'This admin account is not linked to a Ramzy Studio editor account',
      );
    }

    if (candidates.length > 1) {
      throw new ServiceUnavailableException(
        'Multiple Ramzy Studio workspaces match this admin. Configure PORTFOLIO_WORKSPACE_ID.',
      );
    }

    const candidate = candidates[0];
    const user = await this.userRepo.findById(
      candidate.id,
      candidate.workspaceId,
    );

    if (!user || isUserDisabled(user)) {
      throw new ForbiddenException(
        'This admin account is not linked to an active Ramzy Studio editor account',
      );
    }

    return user;
  }

  private async resolvePortfolioSpace(user: User) {
    const configuredSpaceId = this.configService
      .get<string>('PORTFOLIO_SPACE_ID')
      ?.trim();

    const configuredSpaceSlug =
      this.configService.get<string>('PORTFOLIO_SPACE_SLUG')?.trim() ||
      DEFAULT_PORTFOLIO_SPACE_SLUG;

    const space = configuredSpaceId
      ? await this.spaceRepo.findById(configuredSpaceId, user.workspaceId)
      : await this.spaceRepo.findBySlug(configuredSpaceSlug, user.workspaceId);

    if (!space || space.deletedAt) {
      throw new ServiceUnavailableException(
        configuredSpaceId
          ? 'The configured portfolio space does not exist in Ramzy Studio'
          : `Ramzy Studio portfolio space “${configuredSpaceSlug}” was not found`,
      );
    }

    return space;
  }

  private async buildSessionResponse(page: Page, user: User) {
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
