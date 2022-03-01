import fixtures from '../helpers/fixtures';
import * as HLS from '../../src/index';
import {MasterPlaylist, MediaPlaylist} from "../../src/types";
import toEqualDateRange from "../jest-matchers/toEqualDateRange";
import {Segment, Variant, Rendition, SessionData, Key, RenditionType, MediaInitializationSection} from "../../src/types";

expect.extend({ toEqualDateRange });

HLS.setOptions({ strictMode: true });

const { Playlist } = HLS.types;

type MediaOrMasterPlaylist = MediaPlaylist | MasterPlaylist;

describe('parser', () => {
    for (const { name, m3u8, object } of fixtures) {
        test(name, () => {
            const result = HLS.parse(m3u8);
            expect(result.source).toBe(m3u8);
            deepEqual(result, object);
        });
    }
});

function buildMessage(propName, actual, expected) {
    if (actual && typeof actual === 'object') {
        actual = JSON.parse(actual);
    }
    if (expected && typeof expected === 'object') {
        expected = JSON.parse(expected);
    }
    return `
${propName} does not match.
expected:
${expected}
actual:
${actual}
`;
}

function deepEqual(actual: MediaOrMasterPlaylist, expected: MediaOrMasterPlaylist) {
    if (!expected) {
        return;
    }
    expect(actual).toBeInstanceOf(Playlist);
    expect(actual.isMasterPlaylist).toBe(expected.isMasterPlaylist);
    expect(actual.uri).toBe(expected.uri);
    // expect(actual.version).toBe(expected.version);

    if (actual.version !== expected.version) {
        expect.fail(buildMessage('Playlist.version', actual.version, expected.version));
    }
    if (actual.independentSegments !== expected.independentSegments) {
        expect.fail(buildMessage('Playlist.independentSegments', actual.independentSegments, expected.independentSegments));
    }
    if (actual.start?.offset !== expected.start?.offset) {
        expect.fail(buildMessage('Playlist.start.offset', actual.start.offset, expected.start.offset));
    }
    if (expected.isMasterPlaylist) {
        // Sanity checking and narrowing TypeScript
        if (!(expected instanceof MasterPlaylist)) {
            throw new Error('Expected is not a MasterPlaylist instance');
        }
        if (!(actual instanceof MasterPlaylist)) {
            throw new Error('Actual is not a MasterPlaylist instance');
        }
        // MasterPlaylist
        if (expected.variants) {
            if (!actual.variants || actual.variants.length !== expected.variants.length) {
                expect.fail(buildMessage('Playlist.variants', actual.variants, expected.variants));
            }
            for (const [index, actualVariant] of actual.variants.entries()) {
                deepEqualVariant(actualVariant, expected.variants[index]);
            }
        }
        if (actual.currentVariant !== expected.currentVariant) {
            expect.fail(buildMessage('MasterPlaylist.currentVariant', actual.currentVariant, expected.currentVariant));
        }

        if (expected.sessionDataList) {
            if (!actual.sessionDataList || actual.sessionDataList.length !== expected.sessionDataList.length) {
                expect.fail(buildMessage('MasterPlaylist.sessionDataList', actual.sessionDataList, expected.sessionDataList));
            }
            for (const [index, actualSessionData] of actual.sessionDataList.entries()) {
                deepEqualSessionData(actualSessionData, expected.sessionDataList[index]);
            }
        }
        if (expected.sessionKeyList) {
            if (!actual.sessionKeyList || actual.sessionKeyList.length !== expected.sessionKeyList.length) {
                expect.fail(buildMessage('MasterPlaylist.sessionKeyList', actual.sessionKeyList, expected.sessionKeyList));
            }
            for (const [index, actualSessionKey] of actual.sessionKeyList.entries()) {
                deepEqualKey(actualSessionKey, expected.sessionKeyList[index]);
            }
        }
    } else {
        // Sanity checking and narrowing TypeScript
        if (!(expected instanceof MediaPlaylist)) {
            throw new Error('Expected is not a MediaPlaylist instance');
        }
        if (!(actual instanceof MediaPlaylist)) {
            throw new Error('Actual is not a MediaPlaylist instance');
        }

        // MediaPlaylist
        if (actual.targetDuration !== expected.targetDuration) {
            expect.fail(buildMessage('MediaPlaylist.targetDuration', actual.targetDuration, expected.targetDuration));
        }
        if (actual.mediaSequenceBase !== expected.mediaSequenceBase) {
            expect.fail(buildMessage('MediaPlaylist.mediaSequenceBase', actual.mediaSequenceBase, expected.mediaSequenceBase));
        }
        if (actual.discontinuitySequenceBase !== expected.discontinuitySequenceBase) {
            expect.fail(
                buildMessage(
                    'MediaPlaylist.discontinuitySequenceBase',
                    actual.discontinuitySequenceBase,
                    expected.discontinuitySequenceBase,
                ),
            );
        }
        if (actual.endlist !== expected.endlist) {
            expect.fail(buildMessage('MediaPlaylist.endlist', actual.endlist, expected.endlist));
        }
        if (actual.playlistType !== expected.playlistType) {
            expect.fail(buildMessage('MediaPlaylist.playlistType', actual.playlistType, expected.playlistType));
        }
        if (actual.isIFrame !== expected.isIFrame) {
            expect.fail(buildMessage('MediaPlaylist.isIFrame', actual.isIFrame, expected.isIFrame));
        }
        if (expected.segments) {
            if (!actual.segments || actual.segments.length !== expected.segments.length) {
                expect.fail(buildMessage('MediaPlaylist.segments', actual.segments, expected.segments));
            }
            for (const [index, actualSegment] of actual.segments.entries()) {
                deepEqualSegment(actualSegment, expected.segments[index]);
            }
        }
        if (actual.hash !== expected.hash) {
            expect.fail(buildMessage('MediaPlaylist.hash', actual.hash, expected.hash));
        }
    }
}

function deepEqualVariant(actual: Variant, expected: Variant) {
    if (!expected) {
        return;
    }
    if (expected.uri) {
        if (!actual.uri || actual.uri !== expected.uri) {
            expect.fail(buildMessage('Variant.uri', actual.uri, expected.uri));
        }
    }
    if (actual.isIFrameOnly !== expected.isIFrameOnly) {
        expect.fail(buildMessage('Variant.isIFrameOnly', actual.isIFrameOnly, expected.isIFrameOnly));
    }
    if (actual.bandwidth !== expected.bandwidth) {
        expect.fail(buildMessage('Variant.bandwidth', actual.bandwidth, expected.bandwidth));
    }
    if (actual.averageBandwidth !== expected.averageBandwidth) {
        expect.fail(buildMessage('Variant.averageBandwidth', actual.averageBandwidth, expected.averageBandwidth));
    }
    if (actual.codecs !== expected.codecs) {
        expect.fail(buildMessage('Variant.codecs', actual.codecs, expected.codecs));
    }
    if (expected.resolution) {
        if (
            !actual.resolution ||
            actual.resolution.width !== expected.resolution.width ||
            actual.resolution.height !== expected.resolution.height
        ) {
            expect.fail(buildMessage('Variant.resolution', actual.resolution, expected.resolution));
        }
    }
    if (actual.frameRate !== expected.frameRate) {
        expect.fail(buildMessage('Variant.frameRate', actual.frameRate, expected.frameRate));
    }
    if (actual.hdcpLevel !== expected.hdcpLevel) {
        expect.fail(buildMessage('Variant.hdcpLevel', actual.hdcpLevel, expected.hdcpLevel));
    }
    if (expected.audio) {
        if (!actual.audio || actual.audio.length !== expected.audio.length) {
            expect.fail(buildMessage('Variant.audio', actual.audio, expected.audio));
        }
        for (const [index, actualRendition] of actual.audio.entries()) {
            deepEqualRendition(actualRendition, expected.audio[index]);
        }
    }
    if (expected.video) {
        if (!actual.video || actual.video.length !== expected.video.length) {
            expect.fail(buildMessage('Variant.video', actual.video, expected.video));
        }
        for (const [index, actualRendition] of actual.video.entries()) {
            deepEqualRendition(actualRendition, expected.video[index]);
        }
    }
    if (expected.subtitles) {
        if (!actual.subtitles || actual.subtitles.length !== expected.subtitles.length) {
            expect.fail(buildMessage('Variant.subtitles', actual.subtitles, expected.subtitles));
        }
        for (const [index, actualRendition] of actual.subtitles.entries()) {
            deepEqualRendition(actualRendition, expected.subtitles[index]);
        }
    }
    if (expected.closedCaptions) {
        if (!actual.closedCaptions || actual.closedCaptions.length !== expected.closedCaptions.length) {
            expect.fail(buildMessage('Variant.closedCaptions', actual.closedCaptions, expected.closedCaptions));
        }
        for (const [index, actualRendition] of actual.closedCaptions.entries()) {
            deepEqualRendition(actualRendition, expected.closedCaptions[index]);
        }
    }
    if (expected.currentRenditions) {
        const expectedCurrentRenditions = expected.currentRenditions;
        const actualCurrentRenditions = actual.currentRenditions;
        for (const key of Object.keys(expectedCurrentRenditions)) {
            if (actualCurrentRenditions[key] !== expectedCurrentRenditions[key]) {
                expect.fail(
                    buildMessage(
                        'Variant.currentRenditions',
                        actualCurrentRenditions[key],
                        expectedCurrentRenditions[key],
                    ),
                );
            }
        }
    }
}

function deepEqualSessionData(actual: SessionData, expected: SessionData) {
    if (!expected) {
        return;
    }
    if (actual.id !== expected.id) {
        expect.fail(buildMessage('SessionData.id', actual.id, expected.id));
    }
    if (actual.value !== expected.value) {
        expect.fail(buildMessage('SessionData.value', actual.value, expected.value));
    }
    if (expected.uri) {
        if (!actual.uri || actual.uri !== expected.uri) {
            expect.fail(buildMessage('SessionData.uri', actual.uri, expected.uri));
        }
    }
    if (actual.language !== expected.language) {
        expect.fail(buildMessage('SessionData.language', actual.language, expected.language));
    }
}

function deepEqualKey(actual: Key, expected: Key) {
    if (!expected) {
        return;
    }
    if (actual.method !== expected.method) {
        expect.fail(buildMessage('Key.method', actual.method, expected.method));
    }
    if (expected.uri) {
        if (!actual.uri || actual.uri !== expected.uri) {
            expect.fail(buildMessage('Key.uri', actual.uri, expected.uri));
        }
    }
    if (expected.iv) {
        if (!actual.iv || actual.iv.length !== expected.iv.length) {
            expect.fail(buildMessage('Key.iv', actual.iv, expected.iv));
        }
        for (let i = 0; i < actual.iv.length; i++) {
            if (actual.iv[i] !== expected.iv[i]) {
                expect.fail(buildMessage('Key.iv', actual.iv, expected.iv));
            }
        }
    }
    if (actual.format !== expected.format) {
        expect.fail(buildMessage('Key.format', actual.format, expected.format));
    }
    if (actual.formatVersion !== expected.formatVersion) {
        expect.fail(buildMessage('Key.formatVersion', actual.formatVersion, expected.formatVersion));
    }
}

function deepEqualSegment(actual: Segment, expected: Segment) {
    if (!expected) {
        return;
    }
    if (expected.uri) {
        if (!actual.uri || actual.uri !== expected.uri) {
            expect.fail(buildMessage('Segment.uri', actual.uri, expected.uri));
        }
    }
    if (expected.data) {
        if (!actual.data || actual.data.length !== expected.data.length) {
            expect.fail(buildMessage('Segment.data', actual.data, expected.data));
        }
        for (let i = 0; i < actual.data.length; i++) {
            if (actual.data[i] !== expected.data[i]) {
                expect.fail(buildMessage('Segment.data', actual.data, expected.data));
            }
        }
    }
    if (actual.duration !== expected.duration) {
        expect.fail(buildMessage('Segment.duration', actual.duration, expected.duration));
    }
    if (actual.title !== expected.title) {
        expect.fail(buildMessage('Segment.title', actual.title, expected.title));
    }
    if (expected.byterange) {
        if (
            !actual.byterange ||
            actual.byterange.length !== expected.byterange.length ||
            actual.byterange.offset !== expected.byterange.offset
        ) {
            expect.fail(buildMessage('Segment.byterange', actual.byterange, expected.byterange));
        }
    }
    if (actual.discontinuity !== expected.discontinuity) {
        expect.fail(buildMessage('Segment.discontinuity', actual.discontinuity, expected.discontinuity));
    }
    if (actual.mediaSequenceNumber !== expected.mediaSequenceNumber) {
        expect.fail(buildMessage('Segment.mediaSequenceNumber', actual.mediaSequenceNumber, expected.mediaSequenceNumber));
    }
    if (actual.discontinuitySequence !== expected.discontinuitySequence) {
        expect.fail(
            buildMessage('Segment.discontinuitySequence', actual.discontinuitySequence, expected.discontinuitySequence),
        );
    }
    deepEqualKey(actual.key, expected.key);
    deepEqualMap(actual.map, expected.map);
    if (expected.programDateTime) {
        if (!actual.programDateTime || actual.programDateTime.getTime() !== expected.programDateTime.getTime()) {
            expect.fail(buildMessage('Segment.programDateTime', actual.programDateTime, expected.programDateTime));
        }
    }
    expect(actual.dateRange).toEqualDateRange(expected.dateRange);
}

function deepEqualRendition<T extends RenditionType>(actual: Rendition<T>, expected: Rendition<T>) {
    if (!expected) {
        return;
    }
    if (actual.type !== expected.type) {
        expect.fail(buildMessage('Rendition.type', actual.type, expected.type));
    }
    if (expected.uri) {
        if (!actual.uri || actual.uri !== expected.uri) {
            expect.fail(buildMessage('Rendition.uri', actual.uri, expected.uri));
        }
    }
    if (actual.groupId !== expected.groupId) {
        expect.fail(buildMessage('Rendition.groupId', actual.groupId, expected.groupId));
    }
    if (actual.language !== expected.language) {
        expect.fail(buildMessage('Rendition.language', actual.language, expected.language));
    }
    if (actual.assocLanguage !== expected.assocLanguage) {
        expect.fail(buildMessage('Rendition.assocLanguage', actual.assocLanguage, expected.assocLanguage));
    }
    if (actual.name !== expected.name) {
        expect.fail(buildMessage('Rendition.name', actual.name, expected.name));
    }
    if (actual.isDefault !== expected.isDefault) {
        expect.fail(buildMessage('Rendition.isDefault', actual.isDefault, expected.isDefault));
    }
    if (actual.autoselect !== expected.autoselect) {
        expect.fail(buildMessage('Rendition.autoselect', actual.autoselect, expected.autoselect));
    }
    if (actual.forced !== expected.forced) {
        expect.fail(buildMessage('Rendition.forced', actual.forced, expected.forced));
    }
    if (actual.instreamId !== expected.instreamId) {
        expect.fail(buildMessage('Rendition.instreamId', actual.instreamId, expected.instreamId));
    }
    if (actual.characteristics !== expected.characteristics) {
        expect.fail(buildMessage('Rendition.characteristics', actual.characteristics, expected.characteristics));
    }
    if (actual.channels !== expected.channels) {
        expect.fail(buildMessage('Rendition.channels', actual.channels, expected.channels));
    }
}

function deepEqualMap(actual: MediaInitializationSection, expected: MediaInitializationSection) {
    if (!expected) {
        return;
    }
    if (expected.uri) {
        if (!actual.uri || actual.uri.href !== expected.uri.href) {
            expect.fail(buildMessage('MediaInitializationSection.uri', actual.uri, expected.uri));
        }
    }
    if (expected.byterange) {
        if (
            !actual.byterange ||
            actual.byterange.length !== expected.byterange.length ||
            actual.byterange.offset !== expected.byterange.offset
        ) {
            expect.fail(buildMessage('MediaInitializationSection.byterange', actual.byterange, expected.byterange));
        }
    }
}
