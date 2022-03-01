import fixtures from '../../helpers/fixtures';
import * as HLS from '../../../src/index';
import { MasterPlaylist, MediaPlaylist, Playlist } from '../../../src/types';

describe('misc/parse-transformers', () => {
    test('MediaPlaylist Transformers', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.1-Simple-Media-Playlist');

        const baseline = HLS.parse(m3u8) as MediaPlaylist;
        expect(baseline.version).toBe(3);
        expect(baseline.isMasterPlaylist).toBe(false);
        expect(baseline.targetDuration).toBe(10);

        const result = HLS.parse(m3u8, {
            playlistTransformers: [
                (playlist: MediaPlaylist) => {
                    playlist.targetDuration = 12;
                    playlist.version = 4.01; // overwritten by next transformer
                    return playlist;
                },
                (playlist: Playlist) => {
                    playlist.version = 3.14159;
                    return playlist;
                },
            ],
        }) as MediaPlaylist;
        expect(result.targetDuration).toBe(12);
        expect(result.version).toBe(3.14159);
    });

    test('MasterPlaylist Transformers', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.4-Master-Playlist');

        const baseline = HLS.parse(m3u8) as MasterPlaylist;
        expect(baseline.isMasterPlaylist).toBe(true);
        expect(baseline.currentVariant).toBe(undefined);
        expect(baseline.variants.length).toBe(4);
        const lowVariant = baseline.variants.find((variant) => variant.uri === 'http://example.com/low.m3u8');
        expect(lowVariant.bandwidth).toBe(1280000);
        expect(lowVariant.averageBandwidth).toBe(1000000);

        const result = HLS.parse(m3u8, {
            playlistTransformers: [
                (playlist: MasterPlaylist) => {
                    const lowVariant = playlist.variants.find(
                        (variant) => variant.uri === 'http://example.com/low.m3u8',
                    );
                    playlist.currentVariant = lowVariant;
                    return playlist;
                },
                (playlist: MasterPlaylist) => {
                    playlist.currentVariant.bandwidth = 365;
                    return playlist;
                },
            ],
        }) as MasterPlaylist;

        expect(result.currentVariant.bandwidth).toBe(365);
        expect(result.currentVariant.uri).toBe('http://example.com/low.m3u8');
    });

    test('Segment Transformers', () => {
        const { m3u8 } = fixtures.find((fixture) => fixture.name === '8.1-Simple-Media-Playlist');

        const baseline = HLS.parse(m3u8) as MediaPlaylist;
        expect(baseline.segments.length).toBe(3);

        const result = HLS.parse(m3u8, {
            segmentTransformers: [
                (segment) => {
                    if (segment.uri === 'http://media.example.com/second.ts') {
                        return null; // remove it
                    }
                    return segment;
                },
                (segment) => {
                    if (segment?.duration < 9) {
                        segment.duration = 88;
                    }
                    return segment;
                },
            ],
        }) as MediaPlaylist;

        expect(result.segments.length).toBe(2);
        expect(result.segments[1].uri).toBe('http://media.example.com/third.ts');
        expect(result.segments[1].duration).toBe(88);
    });
});
