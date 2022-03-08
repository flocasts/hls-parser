import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.3_Media-Playlist-Tags', () => {
    // Use of the EXT-X-I-FRAMES-ONLY REQUIRES a compatibility version
    // number of 4 or greater.
    test('#EXT-X-I-FRAMES-ONLY_01', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-VERSION:3
          #EXT-X-I-FRAMES-ONLY
          #EXTINF:9,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-VERSION:4
          #EXT-X-I-FRAMES-ONLY
          #EXTINF:9,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
    });
});
