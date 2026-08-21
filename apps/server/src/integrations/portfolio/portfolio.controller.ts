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

/**
 * Portfolio-specific bridge for ahmedramzy.com.
 *
 * Draft editing uses the live Ramzy Studio page document. Publishing creates an
 * explicit immutable PageHistory snapshot and the public portfolio reads that
 * exact snapshot by publicationId. This keeps ordinary Docmost autosave/history
 * timing independent from portfolio release semantics.
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
   * Changes operation will point at.
   *
   * The editor supplies its current native JSON so this operation does not
   * depend on Hocuspocus' debounced persistence or background history cadence.
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
