import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.2_Media-Segment-Tags', () => {
    // A Media Segment tag MUST NOT appear in a Master Playlist.  Clients
    // MUST reject Playlists that contain both Media Segment Tags and Master
    // Playlist tags.
    test('Media-Segment-Tags', () => {
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
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          http://example.com/low.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2560000
          http://example.com/mid.m3u8
          #EXT-X-DISCONTINUITY
          #EXT-X-STREAM-INF:BANDWIDTH=7680000
          http://example.com/hi.m3u8
        `);
    });
});
