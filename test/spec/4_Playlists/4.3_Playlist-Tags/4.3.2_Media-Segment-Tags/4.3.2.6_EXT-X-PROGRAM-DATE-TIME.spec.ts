import * as HLS from '../../../../../src';
import { MediaPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.2_Media-Segment-Tags', () => {
    // It applies only to the next Media Segment.
    test('#EXT-X-PROGRAM-DATE-TIME_01', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-PROGRAM-DATE-TIME:2010-02-19T14:54:23.031+08:00
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(playlist.segments[0].programDateTime).toBeTruthy();
        expect(playlist.segments[1].programDateTime).toBeFalsy();
    });
});
