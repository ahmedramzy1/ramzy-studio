import {
  getShareAttachmentIds,
  rewriteShareAttachmentUrls,
} from './share.util';

const VIDEO_ID = '11111111-1111-4111-8111-111111111111';
const POSTER_ID = '22222222-2222-4222-8222-222222222222';
const CAPTION_ID = '33333333-3333-4333-8333-333333333333';
const AUDIO_ID = '44444444-4444-4444-8444-444444444444';
const ARTWORK_ID = '55555555-5555-4555-8555-555555555555';

const content = {
  type: 'doc',
  content: [
    {
      type: 'video',
      attrs: {
        src: `/api/files/${VIDEO_ID}/demo.mp4`,
        attachmentId: VIDEO_ID,
        poster: `/api/files/${POSTER_ID}/poster.png`,
        posterAttachmentId: POSTER_ID,
        captions: [
          {
            src: `/api/files/${CAPTION_ID}/captions.vtt`,
            attachmentId: CAPTION_ID,
          },
        ],
      },
    },
    {
      type: 'mediaPlaylist',
      attrs: {
        items: [
          {
            src: `/api/files/${AUDIO_ID}/track.mp3`,
            attachmentId: AUDIO_ID,
            artwork: `/api/files/${ARTWORK_ID}/artwork.png`,
            artworkAttachmentId: ARTWORK_ID,
          },
        ],
      },
    },
  ],
};

describe('share attachment utilities', () => {
  it('finds attachment ids nested in structured media attributes', () => {
    expect(getShareAttachmentIds(content)).toEqual([
      VIDEO_ID,
      POSTER_ID,
      CAPTION_ID,
      AUDIO_ID,
      ARTWORK_ID,
    ]);
  });

  it('rewrites primary, poster, caption, and artwork URLs without mutating content', () => {
    const tokenMap = new Map([
      [VIDEO_ID, 'video-token'],
      [POSTER_ID, 'poster-token'],
      [CAPTION_ID, 'caption-token'],
      [AUDIO_ID, 'audio-token'],
      [ARTWORK_ID, 'artwork-token'],
    ]);

    const result = rewriteShareAttachmentUrls(
      content,
      tokenMap,
    ) as typeof content;
    const video = result.content[0].attrs;
    const playlistItem = result.content[1].attrs.items[0];

    expect(video.src).toBe(
      `/api/files/public/${VIDEO_ID}/demo.mp4?jwt=video-token`,
    );
    expect(video.poster).toBe(
      `/api/files/public/${POSTER_ID}/poster.png?jwt=poster-token`,
    );
    expect(video.captions[0].src).toBe(
      `/api/files/public/${CAPTION_ID}/captions.vtt?jwt=caption-token`,
    );
    expect(playlistItem.src).toBe(
      `/api/files/public/${AUDIO_ID}/track.mp3?jwt=audio-token`,
    );
    expect(playlistItem.artwork).toBe(
      `/api/files/public/${ARTWORK_ID}/artwork.png?jwt=artwork-token`,
    );
    expect(content.content[0].attrs.src).toBe(
      `/api/files/${VIDEO_ID}/demo.mp4`,
    );
  });
});
