import { PageHistoryRepo } from '@docmost/db/repos/page/page-history.repo';
import { Page, PageHistory } from '@docmost/db/types/entity.types';
import { PageHistoryService } from './page-history.service';

describe('PageHistoryService portfolio publications', () => {
  const insertPageHistory = jest.fn();
  const findById = jest.fn();
  const findPageHistoryByPageId = jest.fn();

  const repo = {
    insertPageHistory,
    findById,
    findPageHistoryByPageId,
  } as unknown as PageHistoryRepo;

  const service = new PageHistoryService(repo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a publication from the exact editor document supplied at publish time', async () => {
    const persistedContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'old' }] }],
    };
    const editorContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'new' }] }],
    };

    const page = {
      id: 'page-1',
      slugId: 'project-page',
      title: 'Project page',
      content: persistedContent,
      icon: null,
      coverPhoto: null,
      contributorIds: ['author-1'],
      spaceId: 'space-1',
      workspaceId: 'workspace-1',
    } as unknown as Page;

    const created = {
      id: 'publication-1',
      pageId: page.id,
      content: editorContent,
    } as unknown as PageHistory;

    insertPageHistory.mockResolvedValue(created);

    const result = await service.createPortfolioPublicationSnapshot(
      page,
      editorContent as Page['content'],
      'publisher-1',
    );

    expect(result).toBe(created);
    expect(insertPageHistory).toHaveBeenCalledTimes(1);
    expect(insertPageHistory).toHaveBeenCalledWith({
      pageId: 'page-1',
      slugId: 'project-page',
      title: 'Project page',
      content: editorContent,
      icon: null,
      coverPhoto: null,
      lastUpdatedById: 'publisher-1',
      contributorIds: ['author-1'],
      spaceId: 'space-1',
      workspaceId: 'workspace-1',
    });
  });
});
