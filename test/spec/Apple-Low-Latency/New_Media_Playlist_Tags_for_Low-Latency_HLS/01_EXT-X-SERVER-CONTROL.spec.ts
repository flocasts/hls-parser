import * as utils from '../../../helpers/utils';
import * as HLS from '../../../../src/';
import { MediaPlaylist } from '../../../../src/types';

describe('Apple-Low-Latency/New_Media_Playlist_Tags_for_Low-Latency_HLS', () => {
    // CAN-BLOCK-RELOAD=YES: ...
    // It is mandatory for Low-Latency HLS.
    test('#EXT-X-SERVER-CONTROL_01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-SKIP-UNTIL=12.0
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
    });

    // CAN-SKIP-UNTIL=<seconds>: (optional)
    test('#EXT-X-SERVER-CONTROL_02', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
    });

    // CAN-SKIP-UNTIL=<seconds>: ...
    // The Skip Boundary must be at least six times the EXT-X-TARGETDURATION.
    test('#EXT-X-SERVER-CONTROL_03', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=11.9
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
    });

    // HOLD-BACK=<seconds>: (optional)
    test('#EXT-X-SERVER-CONTROL_04', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,HOLD-BACK=6.0
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
    });

    // HOLD-BACK=<seconds>: ...
    // Its value is a floating-point number of seconds and must be at least
    // three times the EXT-X-TARGETDURATION.
    test('#EXT-X-SERVER-CONTROL_05', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,HOLD-BACK=6.0
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,HOLD-BACK=5.9
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
        `);
    });

    // PART-HOLD-BACK=<seconds>: ...
    // It is mandatory if the Playlist contains EXT-X-PART tags.
    test('#EXT-X-SERVER-CONTROL_06', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
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
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
    });

    // PART-HOLD-BACK=<seconds>: ...
    // This attribute's value is a floating-point number of seconds and must be
    // at least PART-TARGET.
    test('#EXT-X-SERVER-CONTROL_07', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.2
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
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.19
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
    });

    test('#EXT-X-SERVER-CONTROL_08', () => {
        const { lowLatencyCompatibility } = HLS.parse(`
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

        expect(lowLatencyCompatibility).toBeTruthy();
        expect(lowLatencyCompatibility.canBlockReload).toBeTrue();
        expect(lowLatencyCompatibility.canSkipUntil).toBe(12);
        expect(lowLatencyCompatibility.holdBack).toBe(6);
        expect(lowLatencyCompatibility.partHoldBack).toBe(0.2);
    });
});
