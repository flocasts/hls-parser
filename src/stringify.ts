import {
    ByteRange,
    DateRange,
    Key,
    MasterPlaylist,
    MediaPlaylist,
    MediaPlaylistType,
    PartialSegment,
    Rendition,
    RenditionType,
    Segment,
    SpliceInfo,
    TransmitSpliceValue,
} from './types';
import * as utils from './utils';
import SessionData from './types/SessionData';
import Variant from './types/Variant';
import MediaInitializationSection from './types/MediaInitializationSection';

const ALLOW_REDUNDANCY: Set<string> = new Set([
    '#EXTINF',
    '#EXT-X-BYTERANGE',
    '#EXT-X-DISCONTINUITY',
    '#EXT-X-STREAM-INF',
    '#EXT-X-CUE-OUT-CONT',
    '#EXT-X-CUE-OUT',
    '#EXT-X-CUE-IN',
    '#EXT-X-TRANSMIT-CUE-OUT',
    '#EXT-X-KEY',
    '#EXT-X-MAP',
]);

const SKIP_IF_REDUNDANT: Set<string> = new Set(['#EXT-X-MEDIA']);

class LineArray {
    private lines: Array<string> = [];
    private uniqueSet: Set<string> = new Set();
    public baseUri: string;

    constructor(baseUri) {
        this.baseUri = baseUri;
    }

    [Symbol.iterator]() {
        return this.lines[Symbol.iterator]();
    }

    push(elem: string): void {
        // Always push URI's
        if (!elem.startsWith('#')) {
            this.lines.push(elem);
            return;
        }

        const tag: string | undefined = elem.split(':')[0];

        // Push lines that are allowed to be redundant
        if (ALLOW_REDUNDANCY.has(tag)) {
            this.lines.push(elem);
            return;
        }

        // Check if the line is redundant
        if (this.uniqueSet.has(elem)) {
            // Check if we're supposed to skip this redundant line
            if (SKIP_IF_REDUNDANT.has(tag)) {
                return;
            }

            // If we don't skip it, throw/log an error
            utils.INVALIDPLAYLIST(`Redundant item (${elem})`);
        }

        // Either unique or error ignored: add it to the list and unique set
        this.lines.push(elem);
        this.uniqueSet.add(elem);
    }
}

function buildDecimalFloatingNumber(num: number, fixed?: number): string {
    let roundFactor = 1000;
    if (fixed) {
        roundFactor = 10 ** fixed;
    }
    const rounded = Math.round(num * roundFactor) / roundFactor;
    return fixed ? rounded.toFixed(fixed) : rounded.toString();
}

function getNumberOfDecimalPlaces(num: number): number {
    const str = num.toString(10);
    const index = str.indexOf('.');
    if (index === -1) {
        return 0;
    }
    return str.length - index - 1;
}

function buildMasterPlaylist(lines: LineArray, playlist: MasterPlaylist): void {
    for (const sessionData of playlist.sessionDataList) {
        lines.push(buildSessionData(sessionData));
    }
    for (const sessionKey of playlist.sessionKeyList) {
        lines.push(buildKey(sessionKey, true));
    }
    for (const variant of playlist.variants) {
        buildVariant(lines, variant);
    }
}

function buildSessionData(sessionData: SessionData): string {
    const attrs = [`DATA-ID="${sessionData.id}"`];
    if (sessionData.language) {
        attrs.push(`LANGUAGE="${sessionData.language}"`);
    }
    if (sessionData.value) {
        attrs.push(`VALUE="${sessionData.value}"`);
    } else if (sessionData.uri) {
        attrs.push(`URI="${sessionData.uri}"`);
    }
    return `#EXT-X-SESSION-DATA:${attrs.join(',')}`;
}

function buildKey(key: Key, isSessionKey?: boolean): string {
    const name = isSessionKey ? '#EXT-X-SESSION-KEY' : '#EXT-X-KEY';
    const attrs = [`METHOD=${key.method}`];
    if (key.uri) {
        attrs.push(`URI="${key.uri}"`);
    }
    if (key.iv) {
        if (key.iv.length !== 16) {
            utils.INVALIDPLAYLIST('IV must be a 128-bit unsigned integer');
        }
        attrs.push(`IV=${utils.byteSequenceToHex(key.iv)}`);
    }
    if (key.format) {
        attrs.push(`KEYFORMAT="${key.format}"`);
    }
    if (key.formatVersion) {
        attrs.push(`KEYFORMATVERSIONS="${key.formatVersion}"`);
    }
    return `${name}:${attrs.join(',')}`;
}

function buildVariant(lines: LineArray, variant: Variant): void {
    const name = `#${variant.variantType}`;
    const attrs = [`BANDWIDTH=${variant.bandwidth}`];
    if (variant.averageBandwidth) {
        attrs.push(`AVERAGE-BANDWIDTH=${variant.averageBandwidth}`);
    }
    if (variant.isIFrameVariant || variant.isImageVariant) {
        attrs.push(`URI="${variant.uri}"`);
    }
    if (variant.codecs) {
        attrs.push(`CODECS="${variant.codecs}"`);
    }
    if (variant.resolution) {
        attrs.push(`RESOLUTION=${variant.resolution.width}x${variant.resolution.height}`);
    }
    if (variant.frameRate) {
        attrs.push(`FRAME-RATE=${buildDecimalFloatingNumber(variant.frameRate, 3)}`);
    }
    if (variant.hdcpLevel) {
        attrs.push(`HDCP-LEVEL=${variant.hdcpLevel}`);
    }
    if (variant.audio.length > 0) {
        attrs.push(`AUDIO="${variant.audio[0].groupId}"`);
        for (const rendition of variant.audio) {
            lines.push(buildRendition(rendition));
        }
    }
    if (variant.video.length > 0) {
        attrs.push(`VIDEO="${variant.video[0].groupId}"`);
        for (const rendition of variant.video) {
            lines.push(buildRendition(rendition));
        }
    }
    if (variant.subtitles.length > 0) {
        attrs.push(`SUBTITLES="${variant.subtitles[0].groupId}"`);
        for (const rendition of variant.subtitles) {
            lines.push(buildRendition(rendition));
        }
    }
    if (utils.getOptions().allowClosedCaptionsNone && variant.closedCaptions.length === 0) {
        attrs.push(`CLOSED-CAPTIONS=NONE`);
    } else if (variant.closedCaptions.length > 0) {
        attrs.push(`CLOSED-CAPTIONS="${variant.closedCaptions[0].groupId}"`);
        for (const rendition of variant.closedCaptions) {
            lines.push(buildRendition(rendition));
        }
    }
    if (variant.score) {
        attrs.push(`SCORE=${variant.score}`);
    }
    if (variant.allowedCpc) {
        const list = [];
        for (const { format, cpcList } of variant.allowedCpc) {
            list.push(`${format}:${cpcList.join('/')}`);
        }
        attrs.push(`ALLOWED-CPC="${list.join(',')}"`);
    }
    if (variant.videoRange) {
        attrs.push(`VIDEO-RANGE=${variant.videoRange}`);
    }
    if (variant.stableVariantId) {
        attrs.push(`STABLE-VARIANT-ID="${variant.stableVariantId}"`);
    }
    lines.push(`${name}:${attrs.join(',')}`);
    if (variant.isStandardVariant) {
        lines.push(`${variant.uri}`);
    }
}

function buildRendition(rendition: Rendition<RenditionType>): string {
    const attrs = [`TYPE=${rendition.type}`, `GROUP-ID="${rendition.groupId}"`, `NAME="${rendition.name}"`];
    if (rendition.isDefault !== undefined) {
        attrs.push(`DEFAULT=${rendition.isDefault ? 'YES' : 'NO'}`);
    }
    if (rendition.autoselect !== undefined) {
        attrs.push(`AUTOSELECT=${rendition.autoselect ? 'YES' : 'NO'}`);
    }
    if (rendition.forced !== undefined) {
        attrs.push(`FORCED=${rendition.forced ? 'YES' : 'NO'}`);
    }
    if (rendition.language) {
        attrs.push(`LANGUAGE="${rendition.language}"`);
    }
    if (rendition.assocLanguage) {
        attrs.push(`ASSOC-LANGUAGE="${rendition.assocLanguage}"`);
    }
    if (rendition.instreamId) {
        attrs.push(`INSTREAM-ID="${rendition.instreamId}"`);
    }
    if (rendition.characteristics) {
        attrs.push(`CHARACTERISTICS="${rendition.characteristics}"`);
    }
    if (rendition.channels) {
        attrs.push(`CHANNELS="${rendition.channels}"`);
    }
    if (rendition.uri) {
        attrs.push(`URI="${rendition.uri}"`);
    }
    return `#EXT-X-MEDIA:${attrs.join(',')}`;
}

function buildMediaPlaylist(lines: LineArray, playlist: MediaPlaylist): void {
    let lastKey = '';
    let lastMap = '';
    let unclosedCueIn = false;

    if (playlist.targetDuration) {
        lines.push(`#EXT-X-TARGETDURATION:${playlist.targetDuration}`);
    }
    if (playlist.lowLatencyCompatibility) {
        const { canBlockReload, canSkipUntil, holdBack, partHoldBack } = playlist.lowLatencyCompatibility;
        const params = [];
        params.push(`CAN-BLOCK-RELOAD=${canBlockReload ? 'YES' : 'NO'}`);
        if (canSkipUntil !== undefined) {
            params.push(`CAN-SKIP-UNTIL=${canSkipUntil}`);
        }
        if (holdBack !== undefined) {
            params.push(`HOLD-BACK=${holdBack}`);
        }
        if (partHoldBack !== undefined) {
            params.push(`PART-HOLD-BACK=${partHoldBack}`);
        }
        lines.push(`#EXT-X-SERVER-CONTROL:${params.join(',')}`);
    }
    if (playlist.partTargetDuration) {
        lines.push(`#EXT-X-PART-INF:PART-TARGET=${playlist.partTargetDuration}`);
    }
    if (playlist.mediaSequenceBase) {
        lines.push(`#EXT-X-MEDIA-SEQUENCE:${playlist.mediaSequenceBase}`);
    }
    if (playlist.discontinuitySequenceBase) {
        lines.push(`#EXT-X-DISCONTINUITY-SEQUENCE:${playlist.discontinuitySequenceBase}`);
    }
    if (playlist.playlistType) {
        lines.push(`#EXT-X-PLAYLIST-TYPE:${playlist.playlistType}`);
    }
    if (playlist.isIFramePlaylist) {
        lines.push(`#${MediaPlaylistType.IFrame}`);
    }
    if (playlist.isImagePlaylist) {
        lines.push(`#${MediaPlaylistType.Image}`);
    }
    if (playlist.skip > 0) {
        lines.push(`#EXT-X-SKIP:SKIPPED-SEGMENTS=${playlist.skip}`);
    }
    for (const segment of playlist.segments) {
        let markerType = '';
        [lastKey, lastMap, markerType] = buildSegment(lines, segment, lastKey, lastMap, playlist.version);
        if (markerType === 'OUT') {
            unclosedCueIn = true;
        } else if (markerType === 'IN' && unclosedCueIn) {
            unclosedCueIn = false;
        }
    }
    if (playlist.playlistType === 'VOD' && unclosedCueIn) {
        lines.push('#EXT-X-CUE-IN');
    }
    if (playlist.prefetchSegments.length > 2) {
        utils.INVALIDPLAYLIST('The server must deliver no more than two prefetch segments');
    }
    for (const segment of playlist.prefetchSegments) {
        if (segment.discontinuity) {
            lines.push(`#EXT-X-PREFETCH-DISCONTINUITY`);
        }
        lines.push(`#EXT-X-PREFETCH:${segment.uri}`);
    }
    if (playlist.endlist) {
        lines.push(`#EXT-X-ENDLIST`);
    }
    for (const report of playlist.renditionReports) {
        const params = [];
        params.push(`URI="${report.uri}"`, `LAST-MSN=${report.lastMSN}`);
        if (report.lastPart !== undefined) {
            params.push(`LAST-PART=${report.lastPart}`);
        }
        lines.push(`#EXT-X-RENDITION-REPORT:${params.join(',')}`);
    }
}

function buildSegment(
    lines: LineArray,
    segment: Segment,
    lastKey: string,
    lastMap: string,
    version = 1,
): [string, string] | [string, string, string] {
    let hint = false;
    let markerType = '';

    if (segment.discontinuity) {
        lines.push(`#EXT-X-DISCONTINUITY`);
    }
    if (segment.key) {
        const line = buildKey(segment.key);
        if (line !== lastKey) {
            lines.push(line);
            lastKey = line;
        }
    }
    if (segment.map) {
        const line = buildMap(segment.map);
        if (line !== lastMap) {
            lines.push(line);
            lastMap = line;
        }
    }
    if (segment.programDateTime) {
        lines.push(`#EXT-X-PROGRAM-DATE-TIME:${utils.formatDate(segment.programDateTime)}`);
    }
    if (segment.dateRange) {
        lines.push(buildDateRange(segment.dateRange));
    }
    if (segment.markers.length > 0) {
        markerType = buildMarkers(lines, segment.markers);
    }
    if (segment.parts.length > 0) {
        hint = buildParts(lines, segment.parts);
    }
    if (hint) {
        return [lastKey, lastMap];
    }
    const duration =
        version < 3
            ? Math.round(segment.duration)
            : buildDecimalFloatingNumber(segment.duration, getNumberOfDecimalPlaces(segment.duration));
    lines.push(`#EXTINF:${duration},${unescape(encodeURIComponent(segment.title || ''))}`);
    if (segment.byterange) {
        lines.push(`#EXT-X-BYTERANGE:${buildByteRange(segment.byterange)}`);
    }
    lines.push(segment.uri);
    return [lastKey, lastMap, markerType];
}

function buildMap(map: MediaInitializationSection): string {
    const attrs = [`URI="${map.uri}"`];
    if (map.byterange) {
        attrs.push(`BYTERANGE="${buildByteRange(map.byterange)}"`);
    }
    return `#EXT-X-MAP:${attrs.join(',')}`;
}

function buildByteRange({ offset, length }: ByteRange): string {
    return `${length}@${offset}`;
}

function buildDateRange(dateRange: DateRange): string {
    const attrs = [`ID="${dateRange.id}"`];
    if (dateRange.start) {
        attrs.push(`START-DATE="${utils.formatDate(dateRange.start)}"`);
    }
    if (dateRange.end) {
        attrs.push(`END-DATE="${utils.formatDate(dateRange.end)}"`);
    }
    if (dateRange.duration) {
        attrs.push(`DURATION=${dateRange.duration}`);
    }
    if (dateRange.plannedDuration) {
        attrs.push(`PLANNED-DURATION=${dateRange.plannedDuration}`);
    }
    if (dateRange.classId) {
        attrs.push(`CLASS="${dateRange.classId}"`);
    }
    if (dateRange.endOnNext) {
        attrs.push(`END-ON-NEXT=YES`);
    }
    for (const key of Object.keys(dateRange.attributes)) {
        if (key.startsWith('X-')) {
            if (typeof dateRange.attributes[key] === 'number') {
                attrs.push(`${key}=${dateRange.attributes[key]}`);
            } else {
                attrs.push(`${key}="${dateRange.attributes[key]}"`);
            }
        } else if (key.startsWith('SCTE35-')) {
            attrs.push(`${key}=${utils.byteSequenceToHex(dateRange.attributes[key])}`);
        }
    }
    return `#EXT-X-DATERANGE:${attrs.join(',')}`;
}

function buildMarkers(lines: LineArray, markers: Array<SpliceInfo>): string {
    let type = '';
    for (const marker of markers) {
        if (marker.type === 'OUT' && !marker.adProviderSpecificTag) {
            type = 'OUT';
            lines.push(`#EXT-X-CUE-OUT:DURATION=${marker.duration}`);
        } else if (marker.type === 'OUT' && marker.adProviderSpecificTag) {
            if (marker.adProviderSpecificTag === 'transmit') {
                const { AdFormat, MaxDuration, KeepCreativeAudio, InsertionType } = marker.value as TransmitSpliceValue;
                type = 'OUT';
                lines.push(
                    `#EXT-X-TRANSMIT-CUE-OUT:AdFormat=${AdFormat},MaxDuration=${MaxDuration},KeepCreativeAudio=${KeepCreativeAudio},InsertionType=${InsertionType}`,
                );
            }
        } else if (marker.type === 'IN') {
            type = 'IN';
            lines.push('#EXT-X-CUE-IN');
        } else if (marker.type === 'RAW') {
            const value = marker.value ? `:${marker.value}` : '';
            lines.push(`#${marker.tagName}${value}`);
        }
    }
    return type;
}

function buildParts(lines: LineArray, parts: Array<PartialSegment>): boolean {
    let hint = false;
    for (const part of parts) {
        if (part.hint) {
            const params = [];
            params.push('TYPE=PART', `URI="${part.uri}"`);
            if (part.byterange) {
                const { offset, length } = part.byterange;
                params.push(`BYTERANGE-START=${offset}`);
                if (length) {
                    params.push(`BYTERANGE-LENGTH=${length}`);
                }
            }
            lines.push(`#EXT-X-PRELOAD-HINT:${params.join(',')}`);
            hint = true;
        } else {
            const params = [];
            params.push(`DURATION=${part.duration}`, `URI="${part.uri}"`);
            if (part.byterange) {
                params.push(`BYTERANGE=${buildByteRange(part.byterange)}`);
            }
            if (part.independent) {
                params.push('INDEPENDENT=YES');
            }
            if (part.gap) {
                params.push('GAP=YES');
            }
            lines.push(`#EXT-X-PART:${params.join(',')}`);
        }
    }
    return hint;
}

export function stringify(playlist: MediaPlaylist | MasterPlaylist): string {
    utils.PARAMCHECK(playlist);
    utils.ASSERT('Not a playlist', playlist.type === 'playlist');
    const lines = new LineArray(playlist.uri);
    lines.push('#EXTM3U');
    if (playlist.version) {
        lines.push(`#EXT-X-VERSION:${playlist.version}`);
    }
    if (playlist.independentSegments) {
        lines.push('#EXT-X-INDEPENDENT-SEGMENTS');
    }
    if (playlist.start) {
        lines.push(
            `#EXT-X-START:TIME-OFFSET=${buildDecimalFloatingNumber(playlist.start.offset)}${
                playlist.start.precise ? ',PRECISE=YES' : ''
            }`,
        );
    }
    if (playlist instanceof MasterPlaylist) {
        buildMasterPlaylist(lines, playlist);
    } else {
        buildMediaPlaylist(lines, playlist);
    }
    // console.log('<<<');
    // console.log(lines.join('\n'));
    // console.log('>>>');
    return Array.from(lines).join('\n');
}
