import * as utils from '../../../helpers/utils';
import * as HLS from '../../../../src/';
import { MediaPlaylist } from '../../../../src/types';

describe('Apple-Low-Latency/New_Media_Playlist_Tags_for_Low-Latency_HLS', () => {
    // SKIPPED-SEGMENTS=<N>: (mandatory)
    test('#EXT-X-SKIP_01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:9
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-SKIP:SKIPPED-SEGMENTS=20
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
          #EXTINF:2,
          fs242.mp4
          #EXTINF:2,
          fs243.mp4
          #EXTINF:2,
          fs244.mp4
          #EXTINF:2,
          fs245.mp4
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:9
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-SKIP:NUM=20
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
          #EXTINF:2,
          fs242.mp4
          #EXTINF:2,
          fs243.mp4
          #EXTINF:2,
          fs244.mp4
          #EXTINF:2,
          fs245.mp4
        `);
    });

    // SKIPPED-SEGMENTS=<N>: (mandatory) Indicates how many
    // Media Segments were replaced by the EXT-X-SKIP tag,
    // along with their associated tags.
    test('#EXT-X-SKIP_02', () => {
        const { skip, segments } = HLS.parse(`
          #EXTM3U
          #EXT-X-VERSION:9
          #EXT-X-TARGETDURATION:2
          #EXT-X-MEDIA-SEQUENCE:9000
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-SKIP:SKIPPED-SEGMENTS=20
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
          #EXTINF:2,
          fs242.mp4
          #EXTINF:2,
          fs243.mp4
          #EXTINF:2,
          fs244.mp4
          #EXTINF:2,
          fs245.mp4
        `) as MediaPlaylist;

        expect(skip).toBe(20);
        expect(segments[0].mediaSequenceNumber).toBe(9020);
    });

    // A Playlist containing an EXT-X-SKIP tag must have
    // an EXT-X-VERSION tag with a value of nine or higher.
    test('#EXT-X-SKIP_03', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-VERSION:9
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-SKIP:SKIPPED-SEGMENTS=20
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
          #EXTINF:2,
          fs242.mp4
          #EXTINF:2,
          fs243.mp4
          #EXTINF:2,
          fs244.mp4
          #EXTINF:2,
          fs245.mp4
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-VERSION:8
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXT-X-SKIP:SKIPPED-SEGMENTS=20
          #EXTINF:2,
          fs240.mp4
          #EXTINF:2,
          fs241.mp4
          #EXTINF:2,
          fs242.mp4
          #EXTINF:2,
          fs243.mp4
          #EXTINF:2,
          fs244.mp4
          #EXTINF:2,
          fs245.mp4
        `);
    });
});
