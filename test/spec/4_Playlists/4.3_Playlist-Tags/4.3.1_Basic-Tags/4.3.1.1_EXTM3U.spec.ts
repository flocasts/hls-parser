import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.1_Basic-Tags', () => {
    // It MUST be the first line of every Media Playlist and
    // every Master Playlist.
    test('#EXTM3U-01', () => {
        // Media Playlist
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.parseFail(`
          #EXT-X-TARGETDURATION:10
          #EXTM3U
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        // Master Playlist
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          http://example.com/low.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2560000
          http://example.com/mid.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=7680000
          http://example.com/hi.m3u8
        `);
        utils.parseFail(`
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          http://example.com/low.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2560000
          http://example.com/mid.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=7680000
          http://example.com/hi.m3u8
        `);
    });
});
