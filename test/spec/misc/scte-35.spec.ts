import * as utils from '../../helpers/utils';
import * as HLS from '../../../src/index';

describe('misc/scte-35', () => {
    test('#EXT-X-CUE-IN_01', () => {
        const { MediaPlaylist, Segment } = HLS.types;

        const segments = [...Array.from({ length: 3 })].map(
            (_, i) => new Segment({ uri: `https://example.com/${i}.ts`, duration: 10 }),
        );
        segments[0].discontinuity = true;
        segments[0].markers.push({ type: 'OUT', duration: 30 });

        const playlist = new MediaPlaylist({
            targetDuration: 10,
            segments,
        });

        // For live media playlist, unclosed CUE-OUT is allowed.
        const expected = `
            #EXTM3U
            #EXT-X-TARGETDURATION:10
            #EXT-X-DISCONTINUITY
            #EXT-X-CUE-OUT:DURATION=30
            #EXTINF:10,
            https://example.com/0.ts
            #EXTINF:10,
            https://example.com/1.ts
            #EXTINF:10,
            https://example.com/2.ts
        `;

        expect(HLS.stringify(playlist)).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    test('#EXT-X-CUE-IN_02', () => {
        const { MediaPlaylist, Segment } = HLS.types;

        const segments = [...Array.from({ length: 3 })].map(
            (_, i) => new Segment({ uri: `https://example.com/${i}.ts`, duration: 10 }),
        );
        segments[0].discontinuity = true;
        segments[0].markers.push({ type: 'OUT', duration: 30 });

        const playlist = new MediaPlaylist({
            playlistType: 'VOD',
            targetDuration: 10,
            segments,
        });

        // For VOD media playlist, unclosed CUE-OUT is not allowed.
        // CUE-IN will be added.
        const expected = `
            #EXTM3U
            #EXT-X-TARGETDURATION:10
            #EXT-X-PLAYLIST-TYPE:VOD
            #EXT-X-DISCONTINUITY
            #EXT-X-CUE-OUT:DURATION=30
            #EXTINF:10,
            https://example.com/0.ts
            #EXTINF:10,
            https://example.com/1.ts
            #EXTINF:10,
            https://example.com/2.ts
            #EXT-X-CUE-IN
        `;

        expect(HLS.stringify(playlist)).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    test('#EXT-X-CUE-IN_03', () => {
        const { MediaPlaylist, Segment } = HLS.types;

        const segments = [...Array.from({ length: 6 })].map(
            (_, i) => new Segment({ uri: `https://example.com/${i}.ts`, duration: 10 }),
        );
        segments[0].markers.push({ type: 'OUT', duration: 20 });
        segments[2].markers.push({ type: 'IN' });
        segments[4].markers.push({ type: 'OUT', duration: 20 });

        const playlist = new MediaPlaylist({
            playlistType: 'EVENT',
            targetDuration: 10,
            segments,
        });

        // For live media playlist, unclosed CUE-OUT is allowed.
        const expected = `
            #EXTM3U
            #EXT-X-TARGETDURATION:10
            #EXT-X-PLAYLIST-TYPE:EVENT
            #EXT-X-CUE-OUT:DURATION=20
            #EXTINF:10,
            https://example.com/0.ts
            #EXTINF:10,
            https://example.com/1.ts
            #EXT-X-CUE-IN
            #EXTINF:10,
            https://example.com/2.ts
            #EXTINF:10,
            https://example.com/3.ts
            #EXT-X-CUE-OUT:DURATION=20
            #EXTINF:10,
            https://example.com/4.ts
            #EXTINF:10,
            https://example.com/5.ts
        `;

        expect(HLS.stringify(playlist)).toBe(utils.stripCommentsAndEmptyLines(expected));
    });

    test('#EXT-X-CUE-IN_04', () => {
        const { MediaPlaylist, Segment } = HLS.types;

        const segments = [...Array.from({ length: 6 })].map(
            (_, i) => new Segment({ uri: `https://example.com/${i}.ts`, duration: 10 }),
        );
        segments[0].markers.push({ type: 'OUT', duration: 20 });
        segments[2].markers.push({ type: 'IN' });
        segments[4].markers.push({ type: 'OUT', duration: 20 });

        const playlist = new MediaPlaylist({
            playlistType: 'VOD',
            targetDuration: 10,
            segments,
        });

        // For VOD media playlist, unclosed CUE-OUT is not allowed.
        // CUE-IN will be added.
        const expected = `
            #EXTM3U
            #EXT-X-TARGETDURATION:10
            #EXT-X-PLAYLIST-TYPE:VOD
            #EXT-X-CUE-OUT:DURATION=20
            #EXTINF:10,
            https://example.com/0.ts
            #EXTINF:10,
            https://example.com/1.ts
            #EXT-X-CUE-IN
            #EXTINF:10,
            https://example.com/2.ts
            #EXTINF:10,
            https://example.com/3.ts
            #EXT-X-CUE-OUT:DURATION=20
            #EXTINF:10,
            https://example.com/4.ts
            #EXTINF:10,
            https://example.com/5.ts
            #EXT-X-CUE-IN
        `;

        expect(HLS.stringify(playlist)).toBe(utils.stripCommentsAndEmptyLines(expected));
    });
});
