import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.1_Basic-Tags', () => {
    // A Playlist file MUST NOT contain more than one EXT-X-VERSION tag.
    test('#EXT-X-VERSION_01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:10
          #EXTINF:9.9,
          http://example.com/1
          #EXTINF:10.0,
          http://example.com/2
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:10
          #EXTINF:9.9,
          http://example.com/1
          #EXTINF:10.0,
          http://example.com/2
          #EXT-X-VERSION:4
        `);
    });
});
