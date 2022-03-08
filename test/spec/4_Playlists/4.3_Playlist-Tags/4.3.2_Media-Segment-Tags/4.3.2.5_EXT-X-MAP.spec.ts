import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.2_Media-Segment-Tags', () => {
    // It applies to every Media Segment that appears after it in the
    // Playlist until the next EXT-X-MAP tag or until the end of the
    // playlist.
    test('#EXT-X-MAP_01', () => {
        let playlist;
        // Until the end of the Playlist
        playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXTINF:10,
          http://example.com/1
          #EXT-X-MAP:URI="http://example.com/map-1"
          #EXTINF:10,
          http://example.com/2
          #EXTINF:10,
          http://example.com/3
        `);
        expect(playlist.segments[0].map).toBeFalsy();
        expect(playlist.segments[1].map).toBeTruthy();
        expect(playlist.segments[2].map).toBeTruthy();
        // Until the next EXT-X-MAP tag
        playlist = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:URI="http://example.com/map-1"
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
          #EXT-X-MAP:URI="http://example.com/map-2"
          #EXTINF:10,
          http://example.com/3
        `);
        expect(playlist.segments[0].map.uri).toBe('http://example.com/map-1');
        expect(playlist.segments[1].map.uri).toBe('http://example.com/map-1');
        expect(playlist.segments[2].map.uri).toBe('http://example.com/map-2');
        HLS.stringify(playlist);
    });

    // URI: This attribute is REQUIRED.
    test('#EXT-X-MAP_02', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:BYTERANGE="256@128"
          #EXTINF:10,
          http://example.com/1
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:URI="http://example.com/map-1",BYTERANGE="256@128"
          #EXTINF:10,
          http://example.com/1
        `);
    });

    // Use of the EXT-X-MAP tag in a Media Playlist that contains the
    // EXT-X-I-FRAMES-ONLY tag REQUIRES a compatibility version number of 5
    // or greater.
    // URI: This attribute is REQUIRED.
    test('#EXT-X-MAP_03', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:4
          #EXT-X-TARGETDURATION:10
          #EXT-X-I-FRAMES-ONLY
          #EXT-X-MAP:URI="http://example.com/map-1",BYTERANGE="256@128"
          #EXTINF:10,
          http://example.com/1
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:5
          #EXT-X-TARGETDURATION:10
          #EXT-X-I-FRAMES-ONLY
          #EXT-X-MAP:URI="http://example.com/map-1",BYTERANGE="256@128"
          #EXTINF:10,
          http://example.com/1
        `);
    });

    // Use of the EXT-X-MAP tag in a Media Playlist that DOES
    // NOT contain the EXT-X-I-FRAMES-ONLY tag REQUIRES a compatibility
    // version number of 6 or greater.
    test('#EXT-X-MAP_04', () => {
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:5
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:URI="http://example.com/map-1",BYTERANGE="256@128"
          #EXTINF:10,
          http://example.com/1
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:URI="http://example.com/map-1",BYTERANGE="256@128"
          #EXTINF:10,
          http://example.com/1
        `);
    });

    // The tag place should be preserved
    test('#EXT-X-MAP_05', () => {
        const sourceText = `
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:URI="http://example.com/map-1"
          #EXTINF:10,
          http://example.com/1
          #EXTINF:10,
          http://example.com/2
          #EXT-X-MAP:URI="http://example.com/map-2"
          #EXTINF:10,
          http://example.com/3
          #EXTINF:10,
          http://example.com/4
        `;
        const obj = HLS.parse(sourceText);
        const text = HLS.stringify(obj);
        expect(text).toBe(utils.stripCommentsAndEmptyLines(sourceText));
    });

    // The same tag can appear multiple times
    test('#EXT-X-MAP_06', () => {
        const sourceText = `
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:10
          #EXT-X-MAP:URI="http://example.com/map-1"
          #EXTINF:10,
          http://example.com/1
          #EXT-X-MAP:URI="http://example.com/map-2"
          #EXTINF:10,
          http://example.com/2
          #EXT-X-MAP:URI="http://example.com/map-1"
          #EXTINF:10,
          http://example.com/3
          #EXT-X-MAP:URI="http://example.com/map-2"
          #EXTINF:10,
          http://example.com/4
        `;
        const obj = HLS.parse(sourceText);
        const text = HLS.stringify(obj);
        expect(text).toBe(utils.stripCommentsAndEmptyLines(sourceText));
    });
});
