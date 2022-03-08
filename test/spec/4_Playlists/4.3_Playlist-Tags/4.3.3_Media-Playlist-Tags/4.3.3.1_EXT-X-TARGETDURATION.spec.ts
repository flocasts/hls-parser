import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.3_Media-Playlist-Tags', () => {
    // The EXTINF duration of each Media Segment in the Playlist
    // file, when rounded to the nearest integer, MUST be less than or equal
    // to the target duration
    test('#EXT-X-TARGETDURATION_01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:10
          #EXTINF:9.9,
          http://example.com/1
          #EXTINF:10.4,
          http://example.com/2
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:10
          #EXTINF:9.9,
          http://example.com/1
          #EXTINF:10.5,
          http://example.com/2
        `);
    });

    // The EXT-X-TARGETDURATION tag is REQUIRED.
    test('#EXT-X-TARGETDURATION_02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXTINF:9,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXTINF:9,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `);
    });
});
