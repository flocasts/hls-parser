import * as utils from '../../../helpers/utils';
import * as HLS from '../../../../src/';
import { MediaPlaylist } from '../../../../src/types';

describe('Apple-Low-Latency/New_Media_Playlist_Tags_for_Low-Latency_HLS', () => {
    // URI=<uri>: (mandatory)
    test('#EXT-X-RENDITION-REPORT_01', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-RENDITION-REPORT:URI="mid.m3u8",LAST-MSN=1999
          #EXT-X-RENDITION-REPORT:URI="high.m3u8",LAST-MSN=1999
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-RENDITION-REPORT:LAST-MSN=1999
          #EXT-X-RENDITION-REPORT:LAST-MSN=1999
        `);
    });

    // URI=<uri>: (mandatory) ... It must be relative to the URI of the Media Playlist
    // containing the EXT-X-RENDITION-REPORT tag.
    test('#EXT-X-RENDITION-REPORT_02', () => {
        utils.bothPass(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-RENDITION-REPORT:URI="mid.m3u8",LAST-MSN=1999
          #EXT-X-RENDITION-REPORT:URI="high.m3u8",LAST-MSN=1999
        `);
        utils.parseFail(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-RENDITION-REPORT:URI="https://example.com/mid.m3u8",LAST-MSN=1999
          #EXT-X-RENDITION-REPORT:URI="https://example.com/high.m3u8",LAST-MSN=1999
        `);
    });

    // A server may omit adding an attribute to an EXT-X-RENDITION-REPORT
    // tag — even a mandatory attribute — if its value is the same as that
    // of the Rendition Report of the Media Playlist to which the EXT-X-RENDITION-REPORT
    // tag is being added. This step reduces the size of the Rendition Report.
    test('#EXT-X-RENDITION-REPORT_03', () => {
        const { renditionReports } = HLS.parse(`
          #EXTM3U
          #EXT-X-TARGETDURATION:2
          #EXT-X-MEDIA-SEQUENCE:1990
          #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,CAN-SKIP-UNTIL=12.0,HOLD-BACK=6.0,PART-HOLD-BACK=0.2
          #EXT-X-PART-INF:PART-TARGET=0.2
          #EXTINF:2,
          fs240.mp4
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@0
          #EXT-X-PART:DURATION=0.2,URI="fs241.mp4",BYTERANGE=20000@20000
          #EXT-X-PRELOAD-HINT:TYPE=PART,URI="fs241.mp4",BYTERANGE-START=40000,BYTERANGE-LENGTH=20000
          #EXT-X-RENDITION-REPORT:URI="main-0.m3u8"
          #EXT-X-RENDITION-REPORT:URI="main-1.m3u8"
        `) as MediaPlaylist;

        expect(renditionReports).toBeArrayOfSize(2);

        for (const [index, report] of renditionReports.entries()) {
            expect(report.uri).toBe(`main-${index}.m3u8`);
            expect(report.lastMSN).toBe(1991);
            expect(report.lastPart).toBe(2);
        }
    });
});
