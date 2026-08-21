import { Injectable } from '@nestjs/common';
import { PageHistoryRepo } from '@docmost/db/repos/page/page-history.repo';
import { Page, PageHistory } from '@docmost/db/types/entity.types';
import { PaginationOptions } from '@docmost/db/pagination/pagination-options';
import { CursorPaginationResult } from '@docmost/db/pagination/cursor-pagination';

@Injectable()
export class PageHistoryService {
  constructor(private pageHistoryRepo: PageHistoryRepo) {}

  async findById(historyId: string): Promise<PageHistory> {
    return await this.pageHistoryRepo.findById(historyId, {
      includeContent: true,
    });
  }

  /**
   * Persist an exact immutable document snapshot for a portfolio publication.
   *
   * This is intentionally synchronous and separate from Docmost's background
   * history cadence: a portfolio publish must refer to the exact document JSON
   * supplied by the editor at the moment Publish Changes is confirmed.
   */
  async createPortfolioPublicationSnapshot(
    page: Page,
    content: Page['content'],
    publishedById: string,
  ): Promise<PageHistory> {
    return this.pageHistoryRepo.insertPageHistory({
      pageId: page.id,
      slugId: page.slugId,
      title: page.title,
      content,
      icon: page.icon,
      coverPhoto: page.coverPhoto,
      lastUpdatedById: publishedById,
      contributorIds: page.contributorIds,
      spaceId: page.spaceId,
      workspaceId: page.workspaceId,
    });
  }

  async findHistoryByPageId(
    pageId: string,
    paginationOptions: PaginationOptions,
  ): Promise<CursorPaginationResult<PageHistory>> {
    return this.pageHistoryRepo.findPageHistoryByPageId(
      pageId,
      paginationOptions,
    );
  }
}
