import { NotFoundException } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';

describe('PortfolioController publication contract', () => {
  const shareService = {
    getSharedPage: jest.fn(),
  };
  const pageService = {
    findById: jest.fn(),
  };
  const pageHistoryService = {
    createPortfolioPublicationSnapshot: jest.fn(),
    findById: jest.fn(),
  };
  const pageAccessService = {
    validateCanEdit: jest.fn(),
  };

  const controller = new PortfolioController(
    shareService as any,
    pageService as any,
    pageHistoryService as any,
    pageAccessService as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('publishes the exact live editor JSON after validating edit access', async () => {
    const page = {
      id: 'page-1',
      deletedAt: null,
    };
    const user = { id: 'user-1' };
    const content = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'exact' }] }],
    };
    const publication = {
      id: 'publication-1',
      pageId: 'page-1',
      createdAt: new Date('2026-08-21T18:00:00.000Z'),
    };

    pageService.findById.mockResolvedValue(page);
    pageAccessService.validateCanEdit.mockResolvedValue(undefined);
    pageHistoryService.createPortfolioPublicationSnapshot.mockResolvedValue(
      publication,
    );

    const result = await controller.createPublication(
      { pageId: ' page-1 ', content: content as any },
      user as any,
    );

    expect(pageService.findById).toHaveBeenCalledWith('page-1', true);
    expect(pageAccessService.validateCanEdit).toHaveBeenCalledWith(page, user);
    expect(
      pageHistoryService.createPortfolioPublicationSnapshot,
    ).toHaveBeenCalledWith(page, content, 'user-1');
    expect(result.publication.id).toBe('publication-1');
  });

  it('never exposes a publication snapshot that belongs to another page', async () => {
    shareService.getSharedPage.mockResolvedValue({
      page: {
        id: 'page-1',
        slugId: 'page-one',
        title: 'Page one',
      },
      share: {
        id: 'share-1',
        key: 'share-key',
      },
    });
    pageHistoryService.findById.mockResolvedValue({
      id: 'publication-1',
      pageId: 'page-2',
      content: { type: 'doc' },
    });

    await expect(
      controller.getPublicPublication(
        { pageId: 'page-1', publicationId: 'publication-1' },
        { id: 'workspace-1' } as any,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
