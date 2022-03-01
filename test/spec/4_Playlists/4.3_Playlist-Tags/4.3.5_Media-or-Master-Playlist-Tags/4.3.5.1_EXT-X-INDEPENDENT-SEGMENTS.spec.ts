import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.5_Media-or-Master-Playlist-Tags', () => {
    // The tags in this section can appear in either Master Playlists or
    // Media Playlists.
    test('#EXT-X-INDEPENDENT-SEGMENTS_01', () => {
        const mediaPlaylist = HLS.parse(`
          #EXTM3U
          #EXT-X-INDEPENDENT-SEGMENTS
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        expect(mediaPlaylist.independentSegments).toBeTruthy();

        const masterPlaylist = HLS.parse(`
          #EXTM3U
          #EXT-X-INDEPENDENT-SEGMENTS
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
        `);
        expect(masterPlaylist.independentSegments).toBeTruthy();
    });

    // These tags MUST NOT appear more than once in a Playlist.  If a tag
    // appears more than once, clients MUST reject the playlist.
    test('#EXT-X-INDEPENDENT-SEGMENTS_02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-INDEPENDENT-SEGMENTS
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
          #EXT-X-INDEPENDENT-SEGMENTS
        `);

        utils.bothPass(`
          #EXTM3U
          #EXT-X-INDEPENDENT-SEGMENTS
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);

        utils.parseFail(`
          #EXTM3U
          #EXT-X-INDEPENDENT-SEGMENTS
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
          #EXT-X-INDEPENDENT-SEGMENTS
        `);

        utils.bothPass(`
          #EXTM3U
          #EXT-X-INDEPENDENT-SEGMENTS
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
        `);
    });
});
