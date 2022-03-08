import * as utils from '../../../../helpers/utils';
import { MediaPlaylist } from '../../../../../src/types';

describe('4_Playlists/4.3_Playlist-Tags/4.3.3_Media-Playlist-Tags', () => {
    test('#EXT-X-CUE-OUT_01', () => {
        let obj = utils.parsePass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-VERSION:3
          #EXTINF:9,
          http://example.com/1
          #EXT-X-CUE-OUT:30
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(obj.segments[1].markers[0].duration).toBe(30);

        obj = utils.parsePass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:10
          #EXT-X-VERSION:3
          #EXTINF:9,
          http://example.com/1
          #EXT-X-CUE-OUT:DURATION=30
          #EXTINF:10,
          http://example.com/2
        `) as MediaPlaylist;
        expect(obj.segments[1].markers[0].duration).toBe(30);
    });
});
