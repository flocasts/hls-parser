import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';
import { MasterPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.4_Master-Playlist-Tags', () => {
    // TYPE attribute is REQUIRED.
    test('#EXT-X-MEDIA_01', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="audio"
          /video/main.m3u8
          #EXT-X-MEDIA:GROUP-ID="audio",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="audio"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
    });

    // TYPE attribute: valid strings are AUDIO, VIDEO,
    // SUBTITLES and CLOSED-CAPTIONS.
    test('#EXT-X-MEDIA_02', () => {
        let playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `) as MasterPlaylist;
        expect(playlist.variants[0].audio[0].type).toBe('AUDIO');

        playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,VIDEO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/video/en.m3u8"
        `) as MasterPlaylist;
        expect(playlist.variants[0].video[0].type).toBe('VIDEO');

        playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SUBTITLES="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/subtitles/en.m3u8"
        `) as MasterPlaylist;
        expect(playlist.variants[0].subtitles[0].type).toBe('SUBTITLES');

        playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `) as MasterPlaylist;
        expect(playlist.variants[0].closedCaptions[0].type).toBe('CLOSED-CAPTIONS');
    });

    // If the TYPE is CLOSED-CAPTIONS, the URI
    //  attribute MUST NOT be present.
    test('#EXT-X-MEDIA_03', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1",URI="/audio/en.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `);
    });

    // GROUP-ID attribute is REQUIRED.
    test('#EXT-X-MEDIA_04', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,NAME="en",DEFAULT=YES"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES"
        `);
    });

    // NAME attribute is REQUIRED.
    test('#EXT-X-MEDIA_05', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",DEFAULT=YES"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES"
        `);
    });

    // The FORCED attribute MUST NOT be present unless the
    // TYPE is SUBTITLES.
    test('#EXT-X-MEDIA_06', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,FORCED=YES
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SUBTITLES="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/subtitles/en.m3u8",FORCED=YES
        `);
    });

    // INSTREAM-ID attribute is REQUIRED if the TYPE attribute is CLOSED-CAPTIONS
    test('#EXT-X-MEDIA_07', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `);
    });

    // All EXT-X-MEDIA tags in the same Group MUST have different NAME attributes.
    test('#EXT-X-MEDIA_08', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="ja",URI="/audio/ja.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="ja",URI="/audio/ja.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="ja",URI="/audio/ja.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="fr",URI="/audio/fr.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="ja",URI="/audio/ja.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test2",NAME="ja",URI="/audio/ja.m3u8"
        `);
    });

    // A Group MUST NOT have more than one member with a DEFAULT attribute of YES.
    test('#EXT-X-MEDIA_09', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="ja",URI="/audio/ja.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="fr",DEFAULT=YES,URI="/audio/fr.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="ja",URI="/audio/ja.m3u8"
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="fr",URI="/audio/fr.m3u8"
        `);
    });
});
