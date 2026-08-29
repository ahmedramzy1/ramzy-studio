import { TiptapTransformer } from '@hocuspocus/transformer';
import { tiptapExtensions } from './collaboration.util';

describe('portfolio collaboration schema', () => {
  it('round-trips every portfolio-only structured block through Yjs', () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'mediaPlaylist',
          attrs: {
            kind: 'audio',
            title: 'Interviews',
            items: [
              {
                key: 'track-1',
                src: '/api/files/audio-1/interview.m4a',
                title: 'Interview 1',
                durationSeconds: 42,
              },
            ],
            activeKey: 'track-1',
            autoplay: false,
            loop: true,
          },
        },
        {
          type: 'photoGrid',
          attrs: {
            images: [
              {
                key: 'photo-1',
                src: '/api/files/photo-1/image.jpg',
                title: 'Behind the scenes',
              },
            ],
            title: 'Gallery',
            description: '',
            location: '',
            date: '',
            credit: '',
            activeKey: 'photo-1',
          },
        },
        {
          type: 'photoAlbum',
          attrs: {
            images: [],
            title: 'Album',
            description: 'Project documentation',
            location: 'Riyadh',
            date: '2026',
            credit: 'Ahmed Ramzy',
            activeKey: null,
          },
        },
      ],
    };

    const ydoc = TiptapTransformer.toYdoc(
      content,
      'default',
      tiptapExtensions,
    );
    const result = TiptapTransformer.fromYdoc(ydoc, 'default');

    expect(result.content?.map((node) => node.type)).toEqual([
      'mediaPlaylist',
      'photoGrid',
      'photoAlbum',
    ]);
    expect(result.content?.[0].attrs).toMatchObject(content.content[0].attrs);
    expect(result.content?.[1].attrs).toMatchObject(content.content[1].attrs);
    // Yjs omits null attributes; TipTap reapplies the node's null default when
    // the document is loaded back into the editor.
    expect(result.content?.[2].attrs).toMatchObject({
      images: [],
      title: 'Album',
      description: 'Project documentation',
      location: 'Riyadh',
      date: '2026',
      credit: 'Ahmed Ramzy',
    });
  });
});
