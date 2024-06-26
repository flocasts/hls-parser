import * as utils from '../../../helpers/utils';
import * as HLS from '../../../../src/';
import { MediaPlaylist } from '../../../../src/types';

describe('Apple-Low-Latency/New_Media_Playlist_Tags_for_Low-Latency_HLS', () => {
    // EXT-X-PART-INF provides information about HLS Partial Segments in the Playlist. It is
    // required if a Playlist contains one or more EXT-X-PART tags.
    test('#EXT-X-PART-INF_01', () => {
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
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
    });

    // PART-TARGET=<s>: (mandatory)
    test('#EXT-X-PART-INF_02', () => {
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
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
          #EXT-X-PART-INF
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
    });

    // PART-TARGET=<s>: (mandatory) Indicates the part target duration in floating-point seconds
    // and is the maximum duration of any Partial Segment.
    test('#EXT-X-PART-INF_03', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-PART:DURATION=0.17,URI="fs240.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs240.mp4",BYTERANGE=20000@20000
          #EXT-X-PART:DURATION=0.17,URI="fs240.mp4",BYTERANGE=20000@40000
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
          #EXT-X-PART-INF:PART-TARGET=0.17
          #EXT-X-PART:DURATION=0.17,URI="fs240.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs240.mp4",BYTERANGE=20000@20000
          #EXT-X-PART:DURATION=0.17,URI="fs240.mp4",BYTERANGE=20000@40000
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `);
    });

    // All Partial Segments except the last part of a segment
    // must have a duration of at least 85% of PART-TARGET.
    test('#EXT-X-PART-INF_04', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=23000@20000
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=18000@43000
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=20000@61000
          #EXT-X-PART:DURATION=0.05,URI="fs241.mp4",BYTERANGE=10000@81000
          #EXTINF:2,
          fs241.mp4
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=0.6
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=23000@20000
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=18000@43000
          #EXT-X-PART:DURATION=0.16,URI="fs241.mp4",BYTERANGE=20000@61000
          #EXT-X-PART:DURATION=0.05,URI="fs241.mp4",BYTERANGE=10000@81000
          #EXTINF:2,
          fs241.mp4
        `);
    });

    test('#EXT-X-PART-INF_05', () => {
        const { partTargetDuration } = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.17,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
        `) as MediaPlaylist;

        expect(partTargetDuration).toBe(0.2);
    });
});
