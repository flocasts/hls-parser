import * as utils from '../../helpers/utils';
import * as HLS from '../../../src/';
import { MediaPlaylist } from '../../../src/types';

describe('HLSJS-LHLS', () => {
    test('#EXT-X-PREFETCH-DISCONTINUITY_01', () => {
        const text = `
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
          #EXT-X-MEDIA-SEQUENCE: 0
          #EXT-X-DISCONTINUITY-SEQUENCE: 0
          #EXT-X-PROGRAM-DATE-TIME:2018-09-05T20:59:06.531Z
          #EXTINF:2.000
          https://foo.com/bar/0.ts
          #EXT-X-PROGRAM-DATE-TIME:2018-09-05T20:59:08.531Z
          #EXTINF:2.000
          https://foo.com/bar/1.ts
      
          #EXT-X-PREFETCH-DISCONTINUITY
          #EXT-X-PREFETCH:https://foo.com/bar/5.ts
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
        `;
        utils.bothPass(text);
        const { prefetchSegments } = HLS.parse(text) as MediaPlaylist;
        expect(prefetchSegments).toBeArrayOfSize(2);
        expect(prefetchSegments[0].discontinuity).toBeTrue();
        expect(prefetchSegments[1].discontinuity).toBeFalsy();
    });

    test('#EXT-X-PREFETCH-DISCONTINUITY_02', () => {
        const text = `
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
          #EXT-X-MEDIA-SEQUENCE: 1
          #EXT-X-DISCONTINUITY-SEQUENCE: 0
          #EXT-X-PROGRAM-DATE-TIME:2018-09-05T20:59:08.531Z
          #EXTINF:2.000
          https://foo.com/bar/1.ts
          #EXT-X-DISCONTINUITY
          #EXT-X-PROGRAM-DATE-TIME:2018-09-05T21:59:10.531Z
          #EXTINF:2.000
          https://foo.com/bar/5.ts
      
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
          #EXT-X-PREFETCH-DISCONTINUITY
          #EXT-X-PREFETCH:https://foo.com/bar/9.ts
        `;
        utils.bothPass(text);
        const { prefetchSegments } = HLS.parse(text) as MediaPlaylist;
        expect(prefetchSegments).toBeArrayOfSize(2);
        expect(prefetchSegments[0].discontinuity).toBeFalsy();
        expect(prefetchSegments[1].discontinuity).toBeTrue();
    });
});
