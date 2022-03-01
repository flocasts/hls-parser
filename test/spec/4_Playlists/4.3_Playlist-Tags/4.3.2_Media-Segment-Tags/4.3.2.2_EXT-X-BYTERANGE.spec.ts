import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';
import { MediaPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.2_Media-Segment-Tags', () => {
    // It applies only to the next URI line that follows it in the Playlist.
    test('#EXT-X-BYTERANGE_01', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100@200
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(playlist.segments[0].byterange.offset).toBe(200);
        expect(playlist.segments[0].byterange.length).toBe(100);
        expect(playlist.segments[1].byterange).toBeFalsy();
    });

    // If o is not present, the sub-range begins at the next byte following
    // the sub-range of the previous Media Segment.
    test('#EXT-X-BYTERANGE_02', () => {
        const playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100@200
          #EXTINF:9.9,
          http://example.com/1
          #EXT-X-BYTERANGE:100
          #EXTINF:9.9,
          http://example.com/1
          #EXT-X-BYTERANGE:100
          #EXTINF:9.9,
          http://example.com/1
        `) as MediaPlaylist;
        expect(playlist.segments[0].byterange.offset).toBe(200);
        expect(playlist.segments[1].byterange.offset).toBe(300);
        expect(playlist.segments[2].byterange.offset).toBe(400);
    });

    // If o is not present, a previous Media Segment MUST appear in the
    // Playlist file and MUST be a sub-range of the same media resource, or
    // the Media Segment is undefined and the Playlist MUST be rejected.
    test('#EXT-X-BYTERANGE_03', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100
          #EXTINF:9.9,
          http://example.com/1
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100@200
          #EXTINF:9.9,
          http://example.com/1
          #EXT-X-BYTERANGE:100
          #EXTINF:9.9,
          http://example.com/1
          #EXT-X-BYTERANGE:100
          #EXTINF:9.9,
          http://example.com/2
        `);
        utils.parsePass(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100@200
          #EXTINF:9.9,
          http://example.com/1
          #EXT-X-BYTERANGE:100
          #EXTINF:9.9,
          http://example.com/1
          #EXT-X-BYTERANGE:100@200
          #EXTINF:9.9,
          http://example.com/2
        `);
    });

    // Use of the EXT-X-BYTERANGE tag REQUIRES a compatibility version
    // number of 4 or greater.
    test('#EXT-X-BYTERANGE_04', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100@200
          #EXTINF:9.9,
          http://example.com/1
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-BYTERANGE:100@200
          #EXTINF:9.9,
          http://example.com/1
        `);
    });

    // EXT-X-BYTERANGE should come at end of segment.
    test('#EXT-X-BYTERANGE_05', () => {
        const expected = utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXTINF:9.9,comment
          #EXT-X-BYTERANGE:100@200
          http://example.com/1
          #EXT-X-DISCONTINUITY
          #EXTINF:9.9,comment
          #EXT-X-BYTERANGE:100@200
          http://example.com/2
        `);

        const actual = utils.stripCommentsAndEmptyLines(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXTINF:9.9,comment
          #EXT-X-BYTERANGE:100@200
          http://example.com/1
          #EXT-X-DISCONTINUITY
          #EXTINF:9.9,comment
          #EXT-X-BYTERANGE:100@200
          http://example.com/2
        `);

        expect(expected).toBe(actual);
    });
});
