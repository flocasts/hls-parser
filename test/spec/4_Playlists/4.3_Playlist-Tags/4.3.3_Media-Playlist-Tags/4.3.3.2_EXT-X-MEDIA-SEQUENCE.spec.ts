import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';
import { MediaPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.3_Media-Playlist-Tags', () => {
    // If the Media Playlist file does not contain an EXT-X-MEDIA-SEQUENCE
    // tag then the Media Sequence Number of the first Media Segment in the
    // Media Playlist SHALL be considered to be 0.
    test('#EXT-X-MEDIA-SEQUENCE_01', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(playlist.mediaSequenceBase).toBe(0);
    });

    // The EXT-X-MEDIA-SEQUENCE tag MUST appear before the first Media
    // Segment in the Playlist.
    test('#EXT-X-MEDIA-SEQUENCE_02', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-MEDIA-SEQUENCE:20
          #EXTINF:9,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:9,
          http://example.com/1
          #EXT-X-MEDIA-SEQUENCE:20
          #EXTINF:10,
          http://example.com/2
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:9,
          #EXT-X-MEDIA-SEQUENCE:20
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
    });
});
