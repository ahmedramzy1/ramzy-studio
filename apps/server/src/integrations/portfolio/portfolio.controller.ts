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
 * Public, read-only bridge for ahmedramzy.com.
 *
 * The portfolio never receives private Docmost pages. ShareService remains the
 * authority: a page must already be publicly shared in Ramzy Studio before it
 * can be returned here, and public attachment URLs are resolved by Docmost.
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
      },
      share: {
        id: share.id,
        key: share.key,
      },
      html: page.content ? jsonToHtml(page.content) : '',
    };
  }
}
