import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Page, User, Workspace } from '@docmost/db/types/entity.types';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { AuthWorkspace } from '../../common/decorators/auth-workspace.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { getPageTitle } from '../../common/helpers';
import { jsonToHtml } from '../../collaboration/collaboration.util';
import { PageAccessService } from '../../core/page/page-access/page-access.service';
import { PageHistoryService } from '../../core/page/services/page-history.service';
import { PageService } from '../../core/page/services/page.service';
import { ShareInfoDto } from '../../core/share/dto/share.dto';
import { ShareService } from '../../core/share/share.service';
import { PortfolioSessionService } from './portfolio-session.service';

type CreatePortfolioPublicationDto = {
  pageId?: string;
  content?: Page['content'];
};

type PublicPortfolioPublicationDto = {
  pageId?: string;
  publicationId?: string;
};

type PortfolioSessionExchangeDto = {
  pageId?: string;
};

type PortfolioPageBootstrapDto = {
  projectId?: string;
  title?: string;
};

type PortfolioDraftSaveDto = {
  pageId?: string;
  content?: Page['content'];
};

/**
 * Portfolio-specific bridge for ahmedramzy.com.
 *
 * Draft editing uses the native Ramzy Studio document JSON. The embedded
 * portfolio editor persists drafts through an authenticated API rather than
 * requiring a live collaboration socket; standalone Ramzy Studio keeps its
 * normal collaborative editing path. Publishing creates an explicit immutable
 * PageHistory snapshot and the public portfolio reads that exact snapshot.
 */
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly shareService: ShareService,
    private readonly pageService: PageService,
    private readonly pageHistoryService: PageHistoryService,
    private readonly pageAccessService: PageAccessService,
    private readonly portfolioSessionService: PortfolioSessionService,
  ) {}

  /**
   * Exchange ahmedramzy.com's existing Supabase admin session for a short-lived
   * Ramzy Studio authoring session. This endpoint deliberately bypasses Docmost
   * cookie auth because Supabase is the identity being verified here.
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/session/exchange')
  async exchangeSession(
    @Body() dto: PortfolioSessionExchangeDto,
    @Headers('authorization') authorization?: string,
  ) {
    const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] ?? '';
    return this.portfolioSessionService.exchange(dto.pageId ?? '', bearer);
  }

  /**
   * First-open bootstrap for portfolio projects that do not yet own a Ramzy
   * Studio document. The website's Supabase admin identity is verified and a
   * private Studio page is created in the configured portfolio space. Public
   * sharing is deliberately deferred until Publish Changes.
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/page/bootstrap')
  async bootstrapPage(
    @Body() dto: PortfolioPageBootstrapDto,
    @Headers('authorization') authorization?: string,
  ) {
    const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] ?? '';
    return this.portfolioSessionService.bootstrapPage(
      dto.projectId ?? '',
      dto.title ?? '',
      bearer,
    );
  }

  /**
   * Autosave one embedded BUILD draft. The short-lived Ramzy Studio access
   * token authenticates this request and normal page edit permissions still
   * apply. No public share/publication is created here.
   */
  @HttpCode(HttpStatus.OK)
  @Post('/draft/save')
  async saveDraft(
    @Body() dto: PortfolioDraftSaveDto,
    @AuthUser() user: User,
  ) {
    return this.portfolioSessionService.saveDraft(
      dto.pageId ?? '',
      dto.content,
      user,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/page')
  async getPublicPage(
    @Body() dto: ShareInfoDto,
    @AuthWorkspace() workspace: Workspace,
  ) {
    if (!dto.pageId && !dto.shareId) {
      throw new BadRequestException('pageId or shareId is required');
    }

    const { page, share } = await this.shareService.getSharedPage(
      dto,
      workspace.id,
    );

    return {
      page: {
        id: page.id,
        slugId: page.slugId,
        title: getPageTitle(page.title),
        updatedAt: page.updatedAt,
        content: page.content ?? null,
      },
      share: {
        id: share.id,
        key: share.key,
      },
      // Deprecated compatibility field. Do not build new rendering against it.
      html: page.content ? jsonToHtml(page.content) : '',
    };
  }

  /**
   * Create the exact immutable document revision that a portfolio Publish
   * Changes operation will point at. The page becomes publicly shareable only
   * at this moment; drafts remain private while BUILD is in progress.
   *
   * The editor supplies its current native JSON so this operation does not
   * depend on background autosave timing.
   */
  @HttpCode(HttpStatus.OK)
  @Post('/publications/create')
  async createPublication(
    @Body() dto: CreatePortfolioPublicationDto,
    @AuthUser() user: User,
  ) {
    const pageId = dto.pageId?.trim();

    if (!pageId) {
      throw new BadRequestException('pageId is required');
    }

    if (!dto.content || typeof dto.content !== 'object') {
      throw new BadRequestException('content must be a Ramzy Studio document');
    }

    const page = await this.pageService.findById(pageId, true);

    if (!page || page.deletedAt) {
      throw new NotFoundException('Page not found');
    }

    await this.pageAccessService.validateCanEdit(page, user);

    await this.shareService.createShare({
      authUserId: user.id,
      workspaceId: page.workspaceId,
      page,
      createShareDto: {
        pageId: page.id,
        includeSubPages: false,
        searchIndexing: false,
      },
    });

    const publication =
      await this.pageHistoryService.createPortfolioPublicationSnapshot(
        page,
        dto.content,
        user.id,
      );

    return {
      publication: {
        id: publication.id,
        pageId: publication.pageId,
        createdAt: publication.createdAt,
      },
    };
  }

  /**
   * Return one immutable published document revision. The page must still be
   * publicly shared and the requested publication must belong to that page.
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/publications/public')
  async getPublicPublication(
    @Body() dto: PublicPortfolioPublicationDto,
    @AuthWorkspace() workspace: Workspace,
  ) {
    const pageId = dto.pageId?.trim();
    const publicationId = dto.publicationId?.trim();

    if (!pageId || !publicationId) {
      throw new BadRequestException('pageId and publicationId are required');
    }

    const { page, share } = await this.shareService.getSharedPage(
      { pageId },
      workspace.id,
    );

    const publication = await this.pageHistoryService.findById(publicationId);

    if (!publication || publication.pageId !== page.id) {
      throw new NotFoundException('Portfolio publication not found');
    }

    return {
      page: {
        id: page.id,
        slugId: page.slugId,
        title: getPageTitle(publication.title ?? page.title),
      },
      publication: {
        id: publication.id,
        pageId: publication.pageId,
        createdAt: publication.createdAt,
        content: publication.content ?? null,
      },
      share: {
        id: share.id,
        key: share.key,
      },
    };
  }
}
