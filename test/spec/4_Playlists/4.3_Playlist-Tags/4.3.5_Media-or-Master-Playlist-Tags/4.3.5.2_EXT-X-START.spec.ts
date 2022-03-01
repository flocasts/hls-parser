import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.5_Media-or-Master-Playlist-Tags', () => {
    // The tags in this section can appear in either Master Playlists or
    // Media Playlists.
    test('#EXT-X-START_01', () => {
        const mediaPlaylist = HLS.parse(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10,PRECISE=YES
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        expect(mediaPlaylist.start.offset).toBe(-10);
        expect(mediaPlaylist.start.precise).toBeTruthy();

        const masterPlaylist = HLS.parse(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10,PRECISE=YES
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
        `);
        expect(masterPlaylist.start.offset).toBe(-10);
        expect(masterPlaylist.start.precise).toBeTruthy();
    });

    // These tags MUST NOT appear more than once in a Playlist.  If a tag
    // appears more than once, clients MUST reject the playlist.
    test('#EXT-X-START_02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
          #EXT-X-START:TIME-OFFSET=-20
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
          #EXT-X-START:TIME-OFFSET=-20
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
        `);
    });

    // TIME-OFFSET attribute is REQUIRED.
    test('#EXT-X-START_03', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-START:PRECISE=YES
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10,PRECISE=YES
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-START:PRECISE=YES
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-START:TIME-OFFSET=-10,PRECISE=YES
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=640000
          /video/low.m3u8
        `);
    });
});
