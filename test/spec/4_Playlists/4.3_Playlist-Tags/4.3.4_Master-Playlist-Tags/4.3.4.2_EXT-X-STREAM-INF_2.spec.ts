import * as HLS from '../../../../../src';
import * as utils from '../../../../helpers/utils';

describe('4_Playlists/4.3_Playlist-Tags/4.3.4_Master-Playlist-Tags', () => {
    test('#EXT-X-STREAM-INF_07-03', () => {
        const sourceText = `
          #EXTM3U
          #EXT-X-STREAM-INF:BANDWIDTH=1280000,CLOSED-CAPTIONS=NONE
          /video/main.m3u8
          #EXT-X-STREAM-INF:BANDWIDTH=2040000,CLOSED-CAPTIONS=NONE
          /video/high.m3u8
        `;
        HLS.setOptions({ allowClosedCaptionsNone: true });
        const obj = HLS.parse(sourceText);
        const text = HLS.stringify(obj);
        expect(text).toBe(utils.stripCommentsAndEmptyLines(sourceText));
    });
});
