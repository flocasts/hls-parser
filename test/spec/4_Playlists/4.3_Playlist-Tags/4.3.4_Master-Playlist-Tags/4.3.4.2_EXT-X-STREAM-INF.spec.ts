import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';
import { MasterPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.4_Master-Playlist-Tags', () => {
    // The URI line is REQUIRED
    test('#EXT-X-STREAM-INF_01', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
        `);
    });

    // Every EXT-X-STREAM-INF tag MUST include the BANDWIDTH attribute.
    test('#EXT-X-STREAM-INF_02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=1280000
          /video/main.m3u8
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000
          /video/main.m3u8
        `);
    });

    // RESOLUTION The value is a decimal-resolution:
    //  two decimal-integers separated by the "x"
    //  character.  The first integer is a horizontal pixel dimension
    //  (width); the second is a vertical pixel dimension (height).
    test('#EXT-X-STREAM-INF_03', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,RESOLUTION=123x456
          /video/main.m3u8
        `) as MasterPlaylist;
        expect(playlist.variants[0].resolution).toEqual({ width: 123, height: 456 });
    });

    // AUDIO attribute MUST match the value of the
    // GROUP-ID attribute of an EXT-X-MEDIA tag elsewhere in the Master
    // Playlist whose TYPE attribute is AUDIO.
    test('#EXT-X-STREAM-INF_04', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test1",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,AUDIO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
    });

    // VIDEO MUST match the value of the
    // GROUP-ID attribute of an EXT-X-MEDIA tag elsewhere in the Master
    // Playlist whose TYPE attribute is VIDEO.
    test('#EXT-X-STREAM-INF_05', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,VIDEO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="test1",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,VIDEO="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
    });

    // SUBTITLES MUST match the value of the
    // GROUP-ID attribute of an EXT-X-MEDIA tag elsewhere in the Master
    // Playlist whose TYPE attribute is SUBTITLES.
    test('#EXT-X-STREAM-INF_06', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SUBTITLES="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="test1",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SUBTITLES="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
    });

    // CLOSED-CAPTIONS: it MUST match the value of the
    // GROUP-ID attribute of an EXT-X-MEDIA tag elsewhere in the Playlist
    // whose TYPE attribute is CLOSED-CAPTIONS
    test('#EXT-X-STREAM-INF_07', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test1",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `);
    });

    // CLOSED-CAPTIONS: The value can be either a quoted-string or an enumerated-string with the value NONE.
    test('#EXT-X-STREAM-INF_07-01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS=NONE
          /video/main.m3u8
        `);
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS=NONE
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `) as MasterPlaylist;
        expect(playlist.variants[0].closedCaptions.length).toBe(0);
    });

    // CLOSED-CAPTIONS: If the value is the enumerated-string value NONE,
    // all EXT-X-STREAM-INF tags MUST have this attribute with a value of NONE,
    // indicating that there are no closed captions in any Variant Stream in the Master Playlist.
    test('#EXT-X-STREAM-INF_07-02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS=NONE
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2040000,CLOSED-CAPTIONS="test"
          /video/high.m3u8
          #EXT-X-MEDIA:TYPE=CLOSED-CAPTIONS,GROUP-ID="test",NAME="en",DEFAULT=YES,INSTREAM-ID="CC1"
        `);
    });

    /*
    test('#EXT-X-STREAM-INF_07-03', () => {
        const sourceText = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS=NONE
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2040000,CLOSED-CAPTIONS=NONE
          /video/high.m3u8`;
        HLS.setOptions({ allowClosedCaptionsNone: true });
        const obj = HLS.parse(sourceText);
        const text = HLS.stringify(obj);
        expect(text).toBe(utils.stripCommentsAndEmptyLines(sourceText));
    });
    */

    // The URI attribute of the EXT-X-MEDIA tag is REQUIRED if the media
    // type is SUBTITLES
    test('#EXT-X-STREAM-INF_08', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SUBTITLES="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="test",NAME="en",DEFAULT=YES
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SUBTITLES="test"
          /video/main.m3u8
          #EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="test",NAME="en",DEFAULT=YES,URI="/audio/en.m3u8"
        `);
    });

    // SCORE: The value is a positive decimal-floating-point number.
    test('#EXT-X-STREAM-INF_09', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SCORE=-0.5
          /video/main.m3u8
        `);
        const expected = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,SCORE=0.5
          /video/main.m3u8
        `;
        const actual = utils.bothPass(expected);
        expect(actual).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    // The SCORE attribute is OPTIONAL, but if any Variant Stream
    // contains the SCORE attribute, then all Variant Streams in the
    // Master Playlist SHOULD have a SCORE attribute.
    test('#EXT-X-STREAM-INF_10', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CODECS="avc1.640029,mp4a.40.2",SCORE=0.5
          low/main/audio-video.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2560000,CODECS="avc1.640029,mp4a.40.2"
          mid/main/audio-video.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=7680000,CODECS="avc1.640029,mp4a.40.2"
          hi/main/audio-video.m3u8
        `);
        const expected = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CODECS="avc1.640029,mp4a.40.2",SCORE=0.5
          low/main/audio-video.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2560000,CODECS="avc1.640029,mp4a.40.2",SCORE=0.3
          mid/main/audio-video.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=7680000,CODECS="avc1.640029,mp4a.40.2",SCORE=0.1
          hi/main/audio-video.m3u8
        `;
        const actual = utils.bothPass(expected);
        expect(actual).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    // ALLOWED-CPC: Its value is a quoted-string containing
    // a comma-separated list of entries.  Each entry consists
    // of a KEYFORMAT attribute value followed by a colon character (:)
    // followed by a sequence of Content Protection Configuration (CPC)
    // Labels separated by slash (/) characters.  Each CPC Label is a
    // string containing characters from the set [A..Z], [0..9], and '-'.
    test('#EXT-X-STREAM-INF_11', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,ALLOWED-CPC="abc"
          /video/main.m3u8
        `);
        const expected = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,ALLOWED-CPC="com.example.drm1:SMART-TV/PC,com.example.drm2:HW"
          /video/main.m3u8
        `;
        const actual = utils.bothPass(expected);
        expect(actual).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    // VIDEO-RANGE: The value is an enumerated-string; valid strings are SDR, HLG and PQ.
    test('#EXT-X-STREAM-INF_12', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,VIDEO-RANGE=abc
          /video/main.m3u8
        `);
        const expected = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,VIDEO-RANGE=HLG
          /video/main.m3u8
        `;
        const actual = utils.bothPass(expected);
        expect(actual).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    // STABLE-VARIANT-ID: The value is a quoted-string which is
    // a stable identifier for the URI within the Master Playlist.
    test('#EXT-X-STREAM-INF_13', () => {
        const expected = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,STABLE-VARIANT-ID="abc"
          /video/main.m3u8
        `;
        const actual = utils.bothPass(expected);
        expect(actual).toBe(utils.stripCommentsAndEmptyLines(expected));
    });
});
