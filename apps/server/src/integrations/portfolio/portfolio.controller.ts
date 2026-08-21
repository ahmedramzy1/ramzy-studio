import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Workspace } from '@docmost/db/types/entity.types';
import { AuthWorkspace } from '../../common/decorators/auth-workspace.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { getPageTitle } from '../../common/helpers';
import { jsonToHtml } from '../../collaboration/collaboration.util';
import { ShareInfoDto } from '../../core/share/dto/share.dto';
import { ShareService } from '../../core/share/share.service';

/**
 * Public, read-only bridge for ahmedramzy.com during the portfolio-editor
 * migration.
 *
 * The canonical case-study payload is the native Ramzy Studio document JSON.
 * `html` remains temporarily for backwards compatibility with the earlier
 * bridge experiment and will be removed once the shared readonly renderer is
 * consumed directly by the portfolio website.
 *
 * ShareService remains the access authority: a page must already be publicly
 * shared in Ramzy Studio before this public endpoint can return it.
 */
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly shareService: ShareService) {}

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
}
