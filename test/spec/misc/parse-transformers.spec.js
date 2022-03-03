const test = require("ava");
const fixtures = require('../../helpers/fixtures');
const HLS = require("../../../dist");

test("MediaPlaylist Transformers", t => {
    const { m3u8 } = fixtures.find(fixture => fixture.name === '8.1-Simple-Media-Playlist');

    const baseline = HLS.parse(m3u8);
    t.is(baseline.version, 3);
    t.is(baseline.isMasterPlaylist, false);
    t.is(baseline.targetDuration, 10);

    const result = HLS.parse(m3u8, { playlistTransformers: [
            (playlist) => {
                playlist.targetDuration = 12;
                playlist.version = 4.01; // overwritten by next transformer
                return playlist;
            }, (playlist) => {
                playlist.version = 3.14159;
                return playlist
            }]
    });
    t.is(result.targetDuration, 12);
    t.is(result.version, 3.14159);
});

test("MasterPlaylist Transformers", t => {
    const { m3u8 } = fixtures.find(fixture => fixture.name === '8.4-Master-Playlist');

    const baseline = HLS.parse(m3u8);
    t.is(baseline.isMasterPlaylist, true);
    t.is(baseline.currentVariant, undefined);
    t.is(baseline.variants.length, 4);
    let lowVariant = baseline.variants.find(variant => variant.uri === 'http://example.com/low.m3u8');
    t.is(lowVariant.bandwidth, 1280000);
    t.is(lowVariant.averageBandwidth, 1000000);

    const result = HLS.parse(m3u8, { playlistTransformers: [
            (playlist) => {
                const lowVariant = playlist.variants.find(variant => variant.uri === 'http://example.com/low.m3u8');
                playlist.currentVariant = lowVariant;
                return playlist;
            }, (playlist) => {
                playlist.currentVariant.bandwidth = 365;
                return playlist
            }]
    });

    t.is(result.currentVariant.bandwidth, 365);
    t.is(result.currentVariant.uri, 'http://example.com/low.m3u8');
});

test("Segment Transformers", t => {
    const { m3u8 } = fixtures.find(fixture => fixture.name === '8.1-Simple-Media-Playlist');

    const baseline = HLS.parse(m3u8);
    t.is(baseline.segments.length, 3);

    const result = HLS.parse(m3u8, { segmentTransformers: [
            (segment) => {
                if (segment.uri === 'http://media.example.com/second.ts') {
                    return null; // remove it
                }
                return segment;
            }, (segment) => {
                if (segment?.duration < 9) {
                    segment.duration = 88;
                }
                return segment
            }]
    });

    t.is(result.segments.length, 2);
    t.is(result.segments[1].uri, 'http://media.example.com/third.ts');
    t.is(result.segments[1].duration, 88);
});
