import * as HLS from '../../../../../src';
import { MediaPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.2_Media-Segment-Tags', () => {
    // The EXT-X-DISCONTINUITY tag indicates a discontinuity between the
    // Media Segment that follows it and the one that preceded it.
    test('#EXT-X-DISCONTINUITY_01', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXT-X-DISCONTINUITY
          #EXTINF:10,
          http://example.com/2
          #EXTINF:10,
          http://example.com/3
        `) as MediaPlaylist;
        expect(playlist.segments[0].discontinuity).toBeFalsy();
        expect(playlist.segments[1].discontinuity).toBeTrue();
        expect(playlist.segments[2].discontinuity).toBeFalsy();
    });
});
