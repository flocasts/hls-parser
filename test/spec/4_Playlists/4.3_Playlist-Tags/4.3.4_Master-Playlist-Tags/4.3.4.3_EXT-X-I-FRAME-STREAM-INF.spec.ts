import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.4_Master-Playlist-Tags', () => {
    // Every EXT-X-I-FRAME-STREAM-INF tag MUST include a BANDWIDTH attribute
    // and a URI attribute.
    test('#EXT-X-I-FRAME-STREAM-INF_01', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=1280000
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=1280000,URI=/video/main.m3u8
        `);
    });
});
