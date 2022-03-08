import * as utils from '../../helpers/utils';
import * as HLS from '../../../src/';
import { MediaPlaylist } from '../../../src/types';

describe('HLSJS-LHLS', () => {
    test('#EXT-X-PREFETCH_01', () => {
        utils.bothPass(`
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
      
          #EXT-X-PREFETCH:https://foo.com/bar/2.ts
          #EXT-X-PREFETCH:https://foo.com/bar/3.ts
        `);
    });

    test('#EXT-X-PREFETCH_02', () => {
        const parsed = HLS.parse(`
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
      
          #EXT-X-PREFETCH:https://foo.com/bar/2.ts
          #EXT-X-PREFETCH:https://foo.com/bar/3.ts
        `) as MediaPlaylist;
        const { prefetchSegments } = parsed;

        expect(prefetchSegments).toBeArrayOfSize(2);
        expect(prefetchSegments[0].uri).toBe('https://foo.com/bar/2.ts');
        expect(prefetchSegments[1].uri).toBe('https://foo.com/bar/3.ts');

        const stringified = HLS.stringify(parsed);

        expect(stringified).toInclude('#EXT-X-PREFETCH:https://foo.com/bar/2.ts');
        expect(stringified).toInclude('#EXT-X-PREFETCH:https://foo.com/bar/3.ts');
    });

    // If delivering a low-latency stream, the server must deliver at least one
    // prefetch segment, but no more than two.
    test('#EXT-X-PREFETCH_03', () => {
        const parsed = HLS.parse(`
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
      
          #EXT-X-PREFETCH:https://foo.com/bar/2.ts
          #EXT-X-PREFETCH:https://foo.com/bar/3.ts
          #EXT-X-PREFETCH:https://foo.com/bar/4.ts
        `) as MediaPlaylist;
        const { prefetchSegments } = parsed;
        expect(prefetchSegments).toBeArrayOfSize(3);

        expect(() => {
            HLS.stringify(parsed);
        }).toThrow();
    });

    // These segments must appear after all complete segments.
    test('#EXT-X-PREFETCH_04', () => {
        expect(() => {
            HLS.parse(`
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
      
            #EXT-X-PREFETCH:https://foo.com/bar/2.ts
            #EXT-X-PREFETCH:https://foo.com/bar/3.ts
      
            #EXTINF:2.000
            https://foo.com/bar/4.ts
          `);
        }).toThrow();
    });

    // A prefetch segment's Discontinuity Sequence Number is the value of the
    // EXT-X-DISCONTINUITY-SEQUENCE tag (or zero if none) plus the number of
    // EXT-X-DISCONTINUITY and EXT-X-PREFETCH-DISCONTINUITY tags in the Playlist
    // preceding the URI line of the segment.
    test('#EXT-X-PREFETCH_05', () => {
        const parsed = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
          #EXT-X-MEDIA-SEQUENCE: 0
          #EXT-X-DISCONTINUITY-SEQUENCE: 100
          #EXT-X-PROGRAM-DATE-TIME:2018-09-05T20:59:06.531Z
          #EXTINF:2.000
          https://foo.com/bar/0.ts
          #EXT-X-PROGRAM-DATE-TIME:2018-09-05T20:59:08.531Z
          #EXTINF:2.000
          https://foo.com/bar/1.ts
          #EXT-X-DISCONTINUITY
          #EXTINF:2.000
          https://foo.com/bar/1.ts
      
          #EXT-X-PREFETCH-DISCONTINUITY
          #EXT-X-PREFETCH:https://foo.com/bar/5.ts
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
        `) as MediaPlaylist;
        const { prefetchSegments } = parsed;
        expect(prefetchSegments[1].discontinuitySequence).toBe(102);
    });

    // If a prefetch segment is the first segment in a manifest, its Media Sequence
    // Number is either 0, or declared in the Playlist.
    // The Media Sequence Number of every other prefetch segment is equal to the
    // Media Sequence Number of the complete segment or prefetch segment that
    // precedes it plus one.
    test('#EXT-X-PREFETCH_06', () => {
        let parsed;
        parsed = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
      
          #EXT-X-PREFETCH:https://foo.com/bar/5.ts
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
        `);
        expect(parsed.prefetchSegments[0].mediaSequenceNumber).toBe(0);
        expect(parsed.prefetchSegments[1].mediaSequenceNumber).toBe(1);

        parsed = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
          #EXT-X-MEDIA-SEQUENCE: 100
      
          #EXT-X-PREFETCH:https://foo.com/bar/5.ts
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
        `);
        expect(parsed.prefetchSegments[0].mediaSequenceNumber).toBe(100);
        expect(parsed.prefetchSegments[1].mediaSequenceNumber).toBe(101);
    });

    // A prefetch segment must not be advertised with an EXTINF tag. The duration of
    // a prefetch segment must be equal to or less than what is specified by the
    // EXT-X-TARGETDURATION tag.
    test('#EXT-X-PREFETCH_07', () => {
        expect(() => {
            HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
    
          #EXTINF:2.000
          #EXT-X-PREFETCH:https://foo.com/bar/5.ts
          #EXTINF:2.000
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
        `);
        }).toThrow();
    });

    // A prefetch segment must not be advertised with an EXT-X-DISCONTINUITY tag.
    // To insert a discontinuity just for prefetch segments, the server must insert
    // the EXT-X-PREFETCH-DISCONTINUITY tag before the newest EXT-X-PREFETCH tag of
    // the new discontinuous range.
    test('#EXT-X-PREFETCH_08', () => {
        expect(() => {
            HLS.parse(`
              #EXTM3U
              #EXT-X-VERSION:3
              #EXT-X-TARGETDURATION:2
        
              #EXT-X-DISCONTINUITY
              #EXT-X-PREFETCH:https://foo.com/bar/5.ts
              #EXT-X-PREFETCH:https://foo.com/bar/6.ts
            `);
        }).toThrow();
    });

    // Prefetch segments must not be advertised with an EXT-X-MAP tag.
    test('#EXT-X-PREFETCH_09', () => {
        expect(() => {
            HLS.parse(`
              #EXTM3U
              #EXT-X-VERSION:3
              #EXT-X-TARGETDURATION:2
        
              #EXT-X-MAP:URI="http://example.com/map-1"
              #EXT-X-PREFETCH:https://foo.com/bar/5.ts
              #EXT-X-PREFETCH:https://foo.com/bar/6.ts
            `);
        }).toThrow();
    });

    // Prefetch segments may be advertised with an EXT-X-KEY tag. The key itself
    // must be complete; the server must not expect the client to progressively stream keys.
    test('#EXT-X-PREFETCH_10', () => {
        const parsed = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:3
          #EXT-X-TARGETDURATION:2
      
          #EXT-X-KEY:METHOD=AES-128,URI="http://example.com"
          #EXT-X-PREFETCH:https://foo.com/bar/5.ts
          #EXT-X-PREFETCH:https://foo.com/bar/6.ts
        `) as MediaPlaylist;
        const { prefetchSegments } = parsed;
        expect(prefetchSegments[0].key).toBeTruthy();
        expect(prefetchSegments[0].key.uri).toBe('http://example.com');
        expect(prefetchSegments[1].key).toBeTruthy();
        expect(prefetchSegments[1].key.uri).toBe('http://example.com');
    });
});
