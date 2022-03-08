import * as utils from '../../../helpers/utils';
import * as HLS from '../../../../src/';
import { MediaPlaylist } from '../../../../src/types';

describe('Apple-Low-Latency/New_Media_Playlist_Tags_for_Low-Latency_HLS', () => {
    // TYPE=<hint-type>: (mandatory)
    test('#EXT-X-PRELOAD-HINT_01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:URI="fs241.mp4",BYTERANGE-LENGTH=20000
        `);
    });

    // If hint-type is PART, the resource is an upcoming Partial Segment.
    test('#EXT-X-PRELOAD-HINT_02', () => {
        const { segments } = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `) as MediaPlaylist;

        expect(segments).toBeArrayOfSize(2);
        const { parts } = segments[1];
        expect(parts).toBeArrayOfSize(3);
        let offset = 0;
        const length = 20000;
        for (const [index, part] of parts.entries()) {
            expect(part.uri).toBe('fs241.mp4');
            expect(part.byterange).toEqual({ offset, length });
            offset += length;
            if (index === 2) {
                expect(part.hint).toBeTrue();
            } else {
                expect(part.hint).toBeFalse();
            }
        }
    });

    // If hint-type is MAP, the resource is an upcoming Media Initialization Section.
    test('#EXT-X-PRELOAD-HINT_03', () => {
        const { segments } = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-MAP:URI="map-0"
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
          #EXT-X-PRELOAD-HINT:TYPE=MAP,URI="map-1"
        `) as MediaPlaylist;

        expect(segments).toBeArrayOfSize(2);
        for (const [index, { map }] of segments.entries()) {
            expect(map.uri).toBe(`map-${index}`);
        }
    });

    // URI=<uri>: (mandatory)
    test('#EXT-X-PRELOAD-HINT_04', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4"
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART
        `);
    });

    // BYTERANGE-START=<n>: ... Its absence implies a value of 0.
    test('#EXT-X-PRELOAD-HINT_05', () => {
        const { segments } = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
        `) as MediaPlaylist;

        const { parts } = segments[1];
        expect(parts[0].byterange.offset).toBe(0);
    });

    // If the Playlist contains EXT-X-PART tags and does not contain an EXT-X-ENDLIST tag,
    // the Playlist must contain an EXT-X-PRELOAD-HINT tag with a TYPE=PART attribute
    // to hint the URI of the next EXT-X-PART tag that is expected to be added to the
    // Playlist (and its byte range, if applicable).
    test('#EXT-X-PRELOAD-HINT_06', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-ENDLIST
        `);
    });

    // Servers should not add more than one EXT-X-PRELOAD-HINT
    // tag with the same TYPE attribute to a Playlist.
    test('#EXT-X-PRELOAD-HINT_07', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=20000,BYTERANGE-LENGTH=20000
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-MAP:URI="map-0"
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
          #EXT-X-PRELOAD-HINT:TYPE=MAP,URI="map-1"
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:6
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-MAP:URI="map-0"
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-LENGTH=20000
          #EXT-X-PRELOAD-HINT:TYPE=MAP,URI="map-1"
          #EXT-X-PRELOAD-HINT:TYPE=MAP,URI="map-2"
        `);
    });
});
