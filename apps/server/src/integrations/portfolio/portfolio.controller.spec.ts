import { NotFoundException } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { getSchema } from '@tiptap/core';
import { tiptapExtensions } from '../../collaboration/collaboration.util';

describe('PortfolioController contract', () => {
  const shareService = {
    getSharedPage: jest.fn(),
    createShare: jest.fn(),
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
  const portfolioSessionService = {
    exchange: jest.fn(),
  };

  const controller = new PortfolioController(
    shareService as any,
    pageService as any,
    pageHistoryService as any,
    pageAccessService as any,
    portfolioSessionService as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exchanges the website admin bearer token for a page-scoped authoring session', async () => {
    portfolioSessionService.exchange.mockResolvedValue({
      session: { accessToken: 'studio-access' },
      document: { id: 'page-1' },
    });

    await controller.exchangeSession(
      { pageId: 'page-1' },
      'Bearer supabase-admin-token',
    );

    expect(portfolioSessionService.exchange).toHaveBeenCalledWith(
      'page-1',
      'supabase-admin-token',
    );
  });

  it('publishes the exact live editor JSON after validating edit access', async () => {
    const page = {
      id: 'page-1',
      workspaceId: 'workspace-1',
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
    shareService.createShare.mockResolvedValue(undefined);
    pageHistoryService.createPortfolioPublicationSnapshot.mockResolvedValue(
      publication,
    );

    const result = await controller.createPublication(
      { pageId: ' page-1 ', content: content as any },
      user as any,
    );

    expect(pageService.findById).toHaveBeenCalledWith('page-1', true);
    expect(pageAccessService.validateCanEdit).toHaveBeenCalledWith(page, user);
    expect(shareService.createShare).toHaveBeenCalledWith({
      authUserId: 'user-1',
      workspaceId: 'workspace-1',
      page,
      createShareDto: {
        pageId: 'page-1',
        includeSubPages: false,
        searchIndexing: false,
      },
    });
    expect(
      pageHistoryService.createPortfolioPublicationSnapshot,
    ).toHaveBeenCalledWith(page, content, 'user-1');
    expect(result.publication.id).toBe('publication-1');
  });

  it('accepts every canonical AURA node in the server Yjs replacement schema', () => {
    const schema = getSchema(tiptapExtensions);

    expect(() =>
      schema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'tabs',
            content: [
              {
                type: 'tabPanel',
                attrs: { label: 'Research' },
                content: [{ type: 'paragraph' }],
              },
            ],
          },
          {
            type: 'mediaPlaylist',
            attrs: {
              kind: 'video',
              title: 'AURA field films',
              items: [],
              activeKey: '',
              autoplay: false,
              loop: false,
            },
          },
        ],
      }),
    ).not.toThrow();
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
