import * as utils from './utils';
import {
    ByteRange,
    DateRange,
    Key,
    LowLatencyCompatibility,
    MasterPlaylist,
    MediaInitializationSection,
    MediaPlaylist,
    MediaPlaylistType,
    PartialSegment,
    Playlist,
    PlaylistStart,
    PrefetchSegment,
    Rendition,
    RenditionReport,
    RenditionType,
    Resolution,
    Segment,
    SessionData,
    SpliceInfo,
    TransmitSpliceValue,
    Variant,
    VariantType,
} from './types';
import PlaylistTransformer from './transformers/PlaylistTransformer';
import SegmentTransformer from './transformers/SegmentTransformer';

export interface UserParseParams {
    segmentTransformers?: Array<SegmentTransformer>;
    playlistTransformers?: Array<PlaylistTransformer>;
}

export interface ParseParams extends UserParseParams {
    version?: number;
    isMasterPlaylist?: boolean;
    hasMap: boolean;
    targetDuration: number;
    compatibleVersion: number;
    isClosedCaptionsNone: boolean;
    hash: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Tag {
    name: TagName;
    category: TagCategory;
    value: unknown;
    attributes: Attributes;
}
export type TagName =
    // Basic
    | 'EXTM3U'
    | 'EXT-X-VERSION'
    // Segment
    | 'EXTINF'
    | 'EXT-X-BYTERANGE'
    | 'EXT-X-DISCONTINUITY'
    | 'EXT-X-PREFETCH-DISCONTINUITY'
    | 'EXT-X-KEY'
    | 'EXT-X-MAP'
    | 'EXT-X-PROGRAM-DATE-TIME'
    | 'EXT-X-DATERANGE'
    | 'EXT-X-CUE-OUT'
    | 'EXT-X-CUE-IN'
    | 'EXT-X-TRANSMIT-CUE-OUT'
    | 'EXT-X-CUE-OUT-CONT'
    | 'EXT-X-CUE'
    | 'EXT-OATCLS-SCTE35'
    | 'EXT-X-ASSET'
    | 'EXT-X-SCTE35'
    | 'EXT-X-PART'
    | 'EXT-X-PRELOAD-HINT'
    // MediaPlaylist
    | 'EXT-X-TARGETDURATION'
    | 'EXT-X-MEDIA-SEQUENCE'
    | 'EXT-X-DISCONTINUITY-SEQUENCE'
    | 'EXT-X-ENDLIST'
    | 'EXT-X-PLAYLIST-TYPE'
    | 'EXT-X-I-FRAMES-ONLY'
    | 'EXT-X-IMAGES-ONLY'
    | 'EXT-X-SERVER-CONTROL'
    | 'EXT-X-PART-INF'
    | 'EXT-X-PREFETCH'
    | 'EXT-X-RENDITION-REPORT'
    | 'EXT-X-SKIP'
    // MasterPlaylist
    | 'EXT-X-MEDIA'
    | 'EXT-X-STREAM-INF'
    | 'EXT-X-I-FRAME-STREAM-INF'
    | 'EXT-X-IMAGE-STREAM-INF'
    | 'EXT-X-SESSION-DATA'
    | 'EXT-X-SESSION-KEY'
    // MediaorMasterPlaylist
    | 'EXT-X-INDEPENDENT-SEGMENTS'
    | 'EXT-X-START';

export type Line = string | Tag;

export type TagCategory =
    | 'Basic'
    | 'Segment'
    | 'MediaPlaylist'
    | 'MasterPlaylist'
    | 'MediaorMasterPlaylist'
    | 'Unknown';

export interface ExtInf {
    duration: number;
    title: string;
}

export type AttributeTypes = string | number | boolean | Buffer | Date | ByteRange | Resolution | AllowedCpc[];
export type Attributes = Record<string, AttributeTypes>;

export type TagParams =
    | [null, null]
    | [number, null]
    | [null, Attributes]
    | [ExtInf, null]
    | [ByteRange, null]
    | ['EVENT' | 'VOID', null]
    | [unknown, null];

function unquote(str) {
    return utils.trim(str, '"');
}

function getTagCategory(tagName: TagName | string): TagCategory {
    switch (tagName) {
        case 'EXTM3U':
        case 'EXT-X-VERSION':
            return 'Basic';
        case 'EXTINF':
        case 'EXT-X-BYTERANGE':
        case 'EXT-X-DISCONTINUITY':
        case 'EXT-X-PREFETCH-DISCONTINUITY':
        case 'EXT-X-KEY':
        case 'EXT-X-MAP':
        case 'EXT-X-PROGRAM-DATE-TIME':
        case 'EXT-X-DATERANGE':
        case 'EXT-X-CUE-OUT':
        case 'EXT-X-CUE-IN':
        case 'EXT-X-TRANSMIT-CUE-OUT':
        case 'EXT-X-CUE-OUT-CONT':
        case 'EXT-X-CUE':
        case 'EXT-OATCLS-SCTE35':
        case 'EXT-X-ASSET':
        case 'EXT-X-SCTE35':
        case 'EXT-X-PART':
        case 'EXT-X-PRELOAD-HINT':
            return 'Segment';
        case 'EXT-X-TARGETDURATION':
        case 'EXT-X-MEDIA-SEQUENCE':
        case 'EXT-X-DISCONTINUITY-SEQUENCE':
        case 'EXT-X-ENDLIST':
        case 'EXT-X-PLAYLIST-TYPE':
        case 'EXT-X-I-FRAMES-ONLY':
        case 'EXT-X-IMAGES-ONLY':
        case 'EXT-X-SERVER-CONTROL':
        case 'EXT-X-PART-INF':
        case 'EXT-X-PREFETCH':
        case 'EXT-X-RENDITION-REPORT':
        case 'EXT-X-SKIP':
            return 'MediaPlaylist';
        case 'EXT-X-MEDIA':
        case 'EXT-X-STREAM-INF':
        case 'EXT-X-I-FRAME-STREAM-INF':
        case 'EXT-X-IMAGE-STREAM-INF':
        case 'EXT-X-SESSION-DATA':
        case 'EXT-X-SESSION-KEY':
            return 'MasterPlaylist';
        case 'EXT-X-INDEPENDENT-SEGMENTS':
        case 'EXT-X-START':
            return 'MediaorMasterPlaylist';
        default:
            return 'Unknown';
    }
}

export interface AllowedCpc {
    format: string;
    cpcList: string[];
}

export type UserAttribute = number | string | Uint8Array;

function parseEXTINF(param: string): ExtInf {
    const pair = utils.splitAt(param, ',');
    return { duration: utils.toNumber(pair[0]), title: decodeURIComponent(escape(pair[1])) };
}

function parseBYTERANGE(param: string): ByteRange {
    const pair = utils.splitAt(param, '@');
    return { length: utils.toNumber(pair[0]), offset: pair[1] ? utils.toNumber(pair[1]) : -1 };
}

function parseResolution(str: string): Resolution {
    const pair = utils.splitAt(str, 'x');
    return { width: utils.toNumber(pair[0]), height: utils.toNumber(pair[1]) };
}

function parseAllowedCpc(str: string): AllowedCpc[] {
    const message = 'ALLOWED-CPC: Each entry must consist of KEYFORMAT and Content Protection Configuration';
    const list = str.split(',');
    if (list.length === 0) {
        utils.INVALIDPLAYLIST(message);
    }
    const allowedCpcList: AllowedCpc[] = [];
    for (const item of list) {
        const [format, cpcText] = utils.splitAt(item, ':');
        if (!format || !cpcText) {
            utils.INVALIDPLAYLIST(message);
            continue;
        }
        allowedCpcList.push({ format, cpcList: cpcText.split('/') });
    }
    return allowedCpcList;
}

function parseIV(str: string): Buffer {
    const iv = utils.hexToByteSequence(str);
    if (iv.length !== 16) {
        utils.INVALIDPLAYLIST('IV must be a 128-bit unsigned integer');
    }
    return iv;
}

function parseUserAttribute(str: string): UserAttribute {
    if (str.startsWith('"')) {
        return unquote(str);
    }
    if (str.startsWith('0x') || str.startsWith('0X')) {
        return utils.hexToByteSequence(str);
    }
    return utils.toNumber(str);
}

function setCompatibleVersionOfKey(params: ParseParams, attributes: Attributes): void {
    if (attributes['IV'] && params.compatibleVersion < 2) {
        params.compatibleVersion = 2;
    }
    if ((attributes['KEYFORMAT'] || attributes['KEYFORMATVERSIONS']) && params.compatibleVersion < 5) {
        params.compatibleVersion = 5;
    }
}

function parseAttributeList(param: string): Attributes {
    const attributes: Attributes = {};
    for (const item of utils.splitByCommaWithPreservingQuotes(param)) {
        const [key, value] = utils.splitAt(item, '=');
        const val = unquote(value);
        switch (key) {
            case 'URI':
                attributes[key] = val;
                break;
            case 'START-DATE':
            case 'END-DATE':
                attributes[key] = new Date(val);
                break;
            case 'IV':
                attributes[key] = parseIV(val);
                break;
            case 'BYTERANGE':
                attributes[key] = parseBYTERANGE(val);
                break;
            case 'RESOLUTION':
                attributes[key] = parseResolution(val);
                break;
            case 'ALLOWED-CPC':
                attributes[key] = parseAllowedCpc(val);
                break;
            case 'END-ON-NEXT':
            case 'DEFAULT':
            case 'AUTOSELECT':
            case 'FORCED':
            case 'PRECISE':
            case 'CAN-BLOCK-RELOAD':
            case 'INDEPENDENT':
            case 'GAP':
                attributes[key] = val === 'YES';
                break;
            case 'DURATION':
            case 'PLANNED-DURATION':
            case 'BANDWIDTH':
            case 'AVERAGE-BANDWIDTH':
            case 'FRAME-RATE':
            case 'TIME-OFFSET':
            case 'CAN-SKIP-UNTIL':
            case 'HOLD-BACK':
            case 'PART-HOLD-BACK':
            case 'PART-TARGET':
            case 'BYTERANGE-START':
            case 'BYTERANGE-LENGTH':
            case 'LAST-MSN':
            case 'LAST-PART':
            case 'SKIPPED-SEGMENTS':
            case 'SCORE':
                attributes[key] = utils.toNumber(val);
                break;
            default:
                if (key.startsWith('SCTE35-')) {
                    attributes[key] = utils.hexToByteSequence(val);
                } else if (key.startsWith('X-')) {
                    attributes[key] = parseUserAttribute(value);
                } else {
                    if (key === 'VIDEO-RANGE' && val !== 'SDR' && val !== 'HLG' && val !== 'PQ') {
                        utils.INVALIDPLAYLIST(`VIDEO-RANGE: unknown value "${val}"`);
                    }
                    attributes[key] = val;
                }
        }
    }
    return attributes;
}

function parseTagParam(name: TagName, param: string): TagParams {
    switch (name) {
        case 'EXTM3U':
        case 'EXT-X-DISCONTINUITY':
        case 'EXT-X-ENDLIST':
        case 'EXT-X-I-FRAMES-ONLY':
        case 'EXT-X-IMAGES-ONLY':
        case 'EXT-X-INDEPENDENT-SEGMENTS':
        case 'EXT-X-CUE-IN':
            return [null, null];
        case 'EXT-X-VERSION':
        case 'EXT-X-TARGETDURATION':
        case 'EXT-X-MEDIA-SEQUENCE':
        case 'EXT-X-DISCONTINUITY-SEQUENCE':
            return [utils.toNumber(param), null];
        case 'EXT-X-CUE-OUT':
            // For backwards compatibility: attributes list is optional,
            // if only a number is found, use it as the duration
            if (!Number.isNaN(Number(param))) {
                return [utils.toNumber(param), null];
            }
            // If attributes are found, parse them out (i.e. DURATION)
            return [null, parseAttributeList(param)];
        case 'EXT-X-KEY':
        case 'EXT-X-MAP':
        case 'EXT-X-DATERANGE':
        case 'EXT-X-MEDIA':
        case 'EXT-X-STREAM-INF':
        case 'EXT-X-I-FRAME-STREAM-INF':
        case 'EXT-X-IMAGE-STREAM-INF':
        case 'EXT-X-SESSION-DATA':
        case 'EXT-X-SESSION-KEY':
        case 'EXT-X-START':
        case 'EXT-X-SERVER-CONTROL':
        case 'EXT-X-PART-INF':
        case 'EXT-X-PART':
        case 'EXT-X-PRELOAD-HINT':
        case 'EXT-X-RENDITION-REPORT':
        case 'EXT-X-SKIP':
            return [null, parseAttributeList(param)];
        case 'EXTINF':
            return [parseEXTINF(param), null];
        case 'EXT-X-BYTERANGE':
            return [parseBYTERANGE(param), null];
        case 'EXT-X-PROGRAM-DATE-TIME':
            return [new Date(param), null];
        case 'EXT-X-PLAYLIST-TYPE':
            return [param, null]; // <EVENT|VOD>
        case 'EXT-X-TRANSMIT-CUE-OUT':
            return [null, parseAttributeList(param)];
        default:
            return [param, null]; // Unknown tag
    }
}

function MIXEDTAGS(): void {
    utils.INVALIDPLAYLIST(`The file contains both media and master playlist tags.`);
}

function splitTag(line: string): [TagName, string | null] {
    const index = line.indexOf(':');
    if (index === -1) {
        return [line.slice(1).trim() as TagName, null];
    }
    return [line.slice(1, index).trim() as TagName, line.slice(index + 1).trim()];
}

function parseRendition({ attributes }: Tag): Rendition<RenditionType> {
    const rendition = new Rendition({
        type: attributes['TYPE'] as Rendition<RenditionType>['type'],
        uri: attributes['URI'] as Rendition<RenditionType>['uri'],
        groupId: attributes['GROUP-ID'] as Rendition<RenditionType>['groupId'],
        language: attributes['LANGUAGE'] as Rendition<RenditionType>['language'],
        assocLanguage: attributes['ASSOC-LANGUAGE'] as Rendition<RenditionType>['assocLanguage'],
        name: attributes['NAME'] as Rendition<RenditionType>['name'],
        isDefault: attributes['DEFAULT'] as Rendition<RenditionType>['isDefault'],
        autoselect: attributes['AUTOSELECT'] as Rendition<RenditionType>['autoselect'],
        forced: attributes['FORCED'] as Rendition<RenditionType>['forced'],
        instreamId: attributes['INSTREAM-ID'] as Rendition<RenditionType>['instreamId'],
        characteristics: attributes['CHARACTERISTICS'] as Rendition<RenditionType>['characteristics'],
        channels: attributes['CHANNELS'] as Rendition<RenditionType>['channels'],
    });
    return rendition;
}

function checkRedundantRendition(
    renditions: Array<Rendition<RenditionType>>,
    rendition: Rendition<RenditionType>,
): string {
    let defaultFound = false;
    for (const item of renditions) {
        if (item.name === rendition.name) {
            return 'All EXT-X-MEDIA tags in the same Group MUST have different NAME attributes.';
        }
        if (item.isDefault) {
            defaultFound = true;
        }
    }
    if (defaultFound && rendition.isDefault) {
        return 'EXT-X-MEDIA A Group MUST NOT have more than one member with a DEFAULT attribute of YES.';
    }
    return '';
}

function addRendition(variant: Variant, line: Tag, type: string): void {
    const rendition = parseRendition(line);
    const renditions = variant[utils.camelify(type)];
    const errorMessage = checkRedundantRendition(renditions, rendition);
    if (errorMessage) {
        utils.INVALIDPLAYLIST(errorMessage);
    }
    renditions.push(rendition);
    if (rendition.isDefault) {
        variant.currentRenditions[utils.camelify(type)] = renditions.length - 1;
    }
}

function matchTypes(attrs: Attributes, variant: Variant, params: ParseParams) {
    for (const type of ['AUDIO', 'VIDEO', 'SUBTITLES', 'CLOSED-CAPTIONS']) {
        if (type === 'CLOSED-CAPTIONS' && attrs[type] === 'NONE') {
            params.isClosedCaptionsNone = true;
            variant.closedCaptions = [];
        } else if (attrs[type] && !variant[utils.camelify(type)].some((item) => item.groupId === attrs[type])) {
            utils.INVALIDPLAYLIST(
                `${type} attribute MUST match the value of the GROUP-ID attribute of an EXT-X-MEDIA tag whose TYPE attribute is ${type}.`,
            );
        }
    }
}

function parseVariant<T extends VariantType>(
    lines: Array<Line>,
    variantAttrs: Attributes,
    uri: string,
    variantType: T,
    params: ParseParams,
): Variant {
    const variant = new Variant({
        uri,
        variantType,
        bandwidth: variantAttrs['BANDWIDTH'] as Variant['bandwidth'],
        averageBandwidth: variantAttrs['AVERAGE-BANDWIDTH'] as Variant['averageBandwidth'],
        score: variantAttrs['SCORE'] as Variant['score'],
        codecs: variantAttrs['CODECS'] as Variant['codecs'],
        resolution: variantAttrs['RESOLUTION'] as Variant['resolution'],
        frameRate: variantAttrs['FRAME-RATE'] as Variant['frameRate'],
        hdcpLevel: variantAttrs['HDCP-LEVEL'] as Variant['hdcpLevel'],
        allowedCpc: variantAttrs['ALLOWED-CPC'] as Variant['allowedCpc'],
        videoRange: variantAttrs['VIDEO-RANGE'] as Variant['videoRange'],
        stableVariantId: variantAttrs['STABLE-VARIANT-ID'] as Variant['stableVariantId'],
    });

    for (const line of lines) {
        if (typeof line === 'string') {
            continue; // ignore URI's
        }
        if (line.name === 'EXT-X-MEDIA') {
            const renditionAttrs = line.attributes;
            const renditionType = renditionAttrs['TYPE'] as RenditionType;
            if (!renditionType || !renditionAttrs['GROUP-ID']) {
                utils.INVALIDPLAYLIST('EXT-X-MEDIA TYPE attribute is REQUIRED.');
            }
            if (variantAttrs[renditionType] === renditionAttrs['GROUP-ID']) {
                addRendition(variant, line, renditionType);
                if (renditionType === 'CLOSED-CAPTIONS') {
                    for (const { instreamId } of variant.closedCaptions) {
                        if (instreamId && instreamId.startsWith('SERVICE') && params.compatibleVersion < 7) {
                            params.compatibleVersion = 7;
                            break;
                        }
                    }
                }
            }
        }
    }
    matchTypes(variantAttrs, variant, params);
    return variant;
}

function sameKey(key1: Key, key2: Key): boolean {
    if (key1.method !== key2.method) {
        return false;
    }
    if (key1.uri !== key2.uri) {
        return false;
    }
    if (key1.iv) {
        if (!key2.iv) {
            return false;
        }
        if (key1.iv.length !== key2.iv.length) {
            return false;
        }
        for (let i = 0; i < key1.iv.length; i++) {
            if (key1.iv[i] !== key2.iv[i]) {
                return false;
            }
        }
    } else if (key2.iv) {
        return false;
    }
    if (key1.format !== key2.format) {
        return false;
    }
    if (key1.formatVersion !== key2.formatVersion) {
        return false;
    }
    return true;
}

function parseMasterPlaylist(lines: Array<Line>, params: ParseParams): MasterPlaylist {
    const playlist = new MasterPlaylist();
    let variantIsScored = false;
    for (const [index, line] of lines.entries()) {
        if (typeof line === 'string') {
            continue; // Skip the uri lines
        }
        const { name, value, attributes } = line;
        if (name === 'EXT-X-VERSION') {
            playlist.version = value as number;
        } else if (name === VariantType.Standard) {
            const uri = lines[index + 1];
            if (typeof uri !== 'string' || uri.startsWith('#EXT')) {
                utils.INVALIDPLAYLIST('EXT-X-STREAM-INF must be followed by a URI line');
            }
            const variant = parseVariant(lines, attributes, uri as string, VariantType.Standard, params);
            if (variant) {
                if (typeof variant.score === 'number') {
                    variantIsScored = true;
                    if (variant.score < 0) {
                        utils.INVALIDPLAYLIST(
                            'SCORE attribute on EXT-X-STREAM-INF must be positive decimal-floating-point number.',
                        );
                    }
                }
                playlist.variants.push(variant);
            }
        } else if (name === VariantType.IFrame || name === VariantType.Image) {
            const variantType = name === VariantType.IFrame ? VariantType.IFrame : VariantType.Image;
            const uri: string = attributes.URI as string;
            if (!uri) {
                utils.INVALIDPLAYLIST(`${variantType} must contain a URI attribute`);
            }
            const variant = parseVariant(lines, attributes, uri, variantType, params);
            if (variant) {
                playlist.variants.push(variant);
            }
        } else if (name === 'EXT-X-SESSION-DATA') {
            const sessionData = new SessionData({
                id: attributes['DATA-ID'] as SessionData['id'],
                value: attributes['VALUE'] as SessionData['value'],
                uri: attributes['URI'] as SessionData['uri'],
                language: attributes['LANGUAGE'] as SessionData['language'],
            });
            if (
                playlist.sessionDataList.some(
                    (item) => item.id === sessionData.id && item.language === sessionData.language,
                )
            ) {
                utils.INVALIDPLAYLIST(
                    'A Playlist MUST NOT contain more than one EXT-X-SESSION-DATA tag with the same DATA-ID attribute and the same LANGUAGE attribute.',
                );
            }
            playlist.sessionDataList.push(sessionData);
        } else if (name === 'EXT-X-SESSION-KEY') {
            if (attributes['METHOD'] === 'NONE') {
                utils.INVALIDPLAYLIST('EXT-X-SESSION-KEY: The value of the METHOD attribute MUST NOT be NONE');
            }
            const sessionKey = new Key({
                method: attributes['METHOD'] as Key['method'],
                uri: attributes['URI'] as Key['uri'],
                iv: attributes['IV'] as Key['iv'],
                format: attributes['KEYFORMAT'] as Key['format'],
                formatVersion: attributes['KEYFORMATVERSIONS'] as Key['formatVersion'],
            });
            if (playlist.sessionKeyList.some((item) => sameKey(item, sessionKey))) {
                utils.INVALIDPLAYLIST(
                    'A Master Playlist MUST NOT contain more than one EXT-X-SESSION-KEY tag with the same METHOD, URI, IV, KEYFORMAT, and KEYFORMATVERSIONS attribute values.',
                );
            }
            setCompatibleVersionOfKey(params, attributes);
            playlist.sessionKeyList.push(sessionKey);
        } else if (name === 'EXT-X-INDEPENDENT-SEGMENTS') {
            if (playlist.independentSegments) {
                utils.INVALIDPLAYLIST('EXT-X-INDEPENDENT-SEGMENTS tag MUST NOT appear more than once in a Playlist');
            }
            playlist.independentSegments = true;
        } else if (name === 'EXT-X-START') {
            if (playlist.start) {
                utils.INVALIDPLAYLIST('EXT-X-START tag MUST NOT appear more than once in a Playlist');
            }
            if (typeof attributes['TIME-OFFSET'] !== 'number') {
                utils.INVALIDPLAYLIST('EXT-X-START: TIME-OFFSET attribute is REQUIRED');
            }
            playlist.start = {
                offset: attributes['TIME-OFFSET'] as PlaylistStart['offset'],
                precise: (attributes['PRECISE'] ?? false) as PlaylistStart['precise'],
            };
        }
    }
    if (variantIsScored) {
        for (const variant of playlist.variants) {
            if (typeof variant.score !== 'number') {
                utils.INVALIDPLAYLIST(
                    'If any Variant Stream contains the SCORE attribute, then all Variant Streams in the Master Playlist SHOULD have a SCORE attribute',
                );
            }
        }
    }
    if (params.isClosedCaptionsNone) {
        for (const variant of playlist.variants) {
            if (variant.closedCaptions.length > 0) {
                utils.INVALIDPLAYLIST(
                    'If there is a variant with CLOSED-CAPTIONS attribute of NONE, all EXT-X-STREAM-INF tags MUST have this attribute with a value of NONE',
                );
            }
        }
    }

    // Apply any user-specified transformations
    params.playlistTransformers?.reduce(
        (playlist: Playlist, transformer: PlaylistTransformer): Playlist => transformer(playlist),
        playlist,
    );

    return playlist;
}

function parseSegment(
    lines: Array<Line>,
    uri: string,
    start: number,
    end: number,
    mediaSequenceNumber: number,
    discontinuitySequence: number,
    params: ParseParams,
): Segment {
    const segment = new Segment({ uri, mediaSequenceNumber, discontinuitySequence, duration: -0 });
    let mapHint = false;
    let partHint = false;
    for (let i = start; i <= end; i++) {
        const currentLine = lines[i];
        if (typeof currentLine === 'string') {
            continue; // Skip the uri lines
        }
        const { name, value, attributes } = currentLine;
        if (name === 'EXTINF') {
            if (!Number.isInteger(value['duration']) && params.compatibleVersion < 3) {
                params.compatibleVersion = 3;
            }
            if (Math.round(value['duration']) > params.targetDuration) {
                utils.INVALIDPLAYLIST(
                    'EXTINF duration, when rounded to the nearest integer, MUST be less than or equal to the target duration',
                );
            }
            segment.duration = value['duration'];
            segment.title = value['title'];
        } else if (name === 'EXT-X-BYTERANGE') {
            if (params.compatibleVersion < 4) {
                params.compatibleVersion = 4;
            }
            segment.byterange = value;
        } else if (name === 'EXT-X-DISCONTINUITY') {
            if (segment.parts.length > 0) {
                utils.INVALIDPLAYLIST(
                    'EXT-X-DISCONTINUITY must appear before the first EXT-X-PART tag of the Parent Segment.',
                );
            }
            segment.discontinuity = true;
        } else if (name === 'EXT-X-KEY') {
            if (segment.parts.length > 0) {
                utils.INVALIDPLAYLIST('EXT-X-KEY must appear before the first EXT-X-PART tag of the Parent Segment.');
            }
            setCompatibleVersionOfKey(params, attributes);
            segment.key = new Key({
                method: attributes['METHOD'] as Key['method'],
                uri: attributes['URI'] as Key['uri'],
                iv: attributes['IV'] as Key['iv'],
                format: attributes['KEYFORMAT'] as Key['format'],
                formatVersion: attributes['KEYFORMATVERSIONS'] as Key['formatVersion'],
            });
        } else if (name === 'EXT-X-MAP') {
            if (segment.parts.length > 0) {
                utils.INVALIDPLAYLIST('EXT-X-MAP must appear before the first EXT-X-PART tag of the Parent Segment.');
            }
            if (params.compatibleVersion < 5) {
                params.compatibleVersion = 5;
            }
            params.hasMap = true;
            segment.map = new MediaInitializationSection({
                uri: attributes['URI'] as MediaInitializationSection['uri'],
                byterange: attributes['BYTERANGE'] as MediaInitializationSection['byterange'],
            });
        } else if (name === 'EXT-X-PROGRAM-DATE-TIME') {
            segment.programDateTime = value as Segment['programDateTime'];
        } else if (name === 'EXT-X-DATERANGE') {
            const attrs = {};
            for (const key of Object.keys(attributes)) {
                if (key.startsWith('SCTE35-') || key.startsWith('X-')) {
                    attrs[key] = attributes[key];
                }
            }
            segment.dateRange = new DateRange({
                id: attributes['ID'] as DateRange['id'],
                classId: attributes['CLASS'] as DateRange['classId'],
                start: attributes['START-DATE'] as DateRange['start'],
                end: attributes['END-DATE'] as DateRange['end'],
                duration: attributes['DURATION'] as DateRange['duration'],
                plannedDuration: attributes['PLANNED-DURATION'] as DateRange['plannedDuration'],
                endOnNext: attributes['END-ON-NEXT'] as DateRange['endOnNext'],
                attributes: attrs,
            });
        } else if (name === 'EXT-X-CUE-OUT') {
            segment.markers.push(
                new SpliceInfo({
                    type: 'OUT',
                    duration: (attributes?.DURATION ?? value) as SpliceInfo['duration'],
                }),
            );
        } else if (name === 'EXT-X-TRANSMIT-CUE-OUT') {
            segment.markers.push(
                new SpliceInfo({
                    type: 'OUT',
                    duration: (attributes?.MaxDuration ?? value) as SpliceInfo['duration'],
                    adProviderSpecificTag: 'transmit',
                    value: attributes as unknown as TransmitSpliceValue,
                }),
            );
        } else if (name === 'EXT-X-CUE-IN') {
            segment.markers.push(
                new SpliceInfo({
                    type: 'IN',
                }),
            );
        } else if (
            name === 'EXT-X-CUE-OUT-CONT' ||
            name === 'EXT-X-CUE' ||
            name === 'EXT-OATCLS-SCTE35' ||
            name === 'EXT-X-ASSET' ||
            name === 'EXT-X-SCTE35'
        ) {
            segment.markers.push(
                new SpliceInfo({
                    type: 'RAW',
                    tagName: name,
                    value: value as string,
                }),
            );
        } else if (name === 'EXT-X-PRELOAD-HINT' && !attributes['TYPE']) {
            utils.INVALIDPLAYLIST('EXT-X-PRELOAD-HINT: TYPE attribute is mandatory');
        } else if (name === 'EXT-X-PRELOAD-HINT' && attributes['TYPE'] === 'PART' && partHint) {
            utils.INVALIDPLAYLIST(
                'Servers should not add more than one EXT-X-PRELOAD-HINT tag with the same TYPE attribute to a Playlist.',
            );
        } else if ((name === 'EXT-X-PART' || name === 'EXT-X-PRELOAD-HINT') && !attributes['URI']) {
            utils.INVALIDPLAYLIST('EXT-X-PART / EXT-X-PRELOAD-HINT: URI attribute is mandatory');
        } else if (name === 'EXT-X-PRELOAD-HINT' && attributes['TYPE'] === 'MAP') {
            if (mapHint) {
                utils.INVALIDPLAYLIST(
                    'Servers should not add more than one EXT-X-PRELOAD-HINT tag with the same TYPE attribute to a Playlist.',
                );
            }
            mapHint = true;
            params.hasMap = true;
            segment.map = new MediaInitializationSection({
                hint: true,
                uri: attributes['URI'] as MediaInitializationSection['uri'],
                byterange: {
                    length: attributes['BYTERANGE-LENGTH'] as ByteRange['length'],
                    offset: (attributes['BYTERANGE-START'] ?? 0) as ByteRange['offset'],
                },
            });
        } else if (name === 'EXT-X-PART' || (name === 'EXT-X-PRELOAD-HINT' && attributes['TYPE'] === 'PART')) {
            if (name === 'EXT-X-PART' && !attributes['DURATION']) {
                utils.INVALIDPLAYLIST('EXT-X-PART: DURATION attribute is mandatory');
            }
            if (name === 'EXT-X-PRELOAD-HINT') {
                partHint = true;
            }
            const partialSegment = new PartialSegment({
                hint: name === 'EXT-X-PRELOAD-HINT',
                uri: attributes['URI'] as PartialSegment['uri'],
                byterange:
                    name === 'EXT-X-PART'
                        ? (attributes['BYTERANGE'] as ByteRange)
                        : {
                              length: attributes['BYTERANGE-LENGTH'] as ByteRange['length'],
                              offset: (attributes['BYTERANGE-START'] ?? 0) as ByteRange['offset'],
                          },
                duration: attributes['DURATION'] as PartialSegment['duration'],
                independent: attributes['INDEPENDENT'] as PartialSegment['independent'],
                gap: attributes['GAP'] as PartialSegment['gap'],
            });
            segment.parts.push(partialSegment);
        }
    }
    return segment;
}

function parsePrefetchSegment(
    lines: Array<Line>,
    uri: string,
    start: number,
    end: number,
    mediaSequenceNumber: number,
    discontinuitySequence: number,
    params: ParseParams,
): PrefetchSegment {
    const segment = new PrefetchSegment({ uri, mediaSequenceNumber, discontinuitySequence });
    for (let i = start; i <= end; i++) {
        const currentLine = lines[i];
        if (typeof currentLine === 'string') {
            continue; // Skip any uri lines
        }
        const { name, attributes } = currentLine;
        if (name === 'EXTINF') {
            utils.INVALIDPLAYLIST('A prefetch segment must not be advertised with an EXTINF tag.');
        } else if (name === 'EXT-X-DISCONTINUITY') {
            utils.INVALIDPLAYLIST('A prefetch segment must not be advertised with an EXT-X-DISCONTINUITY tag.');
        } else if (name === 'EXT-X-PREFETCH-DISCONTINUITY') {
            segment.discontinuity = true;
        } else if (name === 'EXT-X-KEY') {
            setCompatibleVersionOfKey(params, attributes);
            segment.key = new Key({
                method: attributes['METHOD'] as Key['method'],
                uri: attributes['URI'] as Key['uri'],
                iv: attributes['IV'] as Key['iv'],
                format: attributes['KEYFORMAT'] as Key['format'],
                formatVersion: attributes['KEYFORMATVERSIONS'] as Key['formatVersion'],
            });
        } else if (name === 'EXT-X-MAP') {
            utils.INVALIDPLAYLIST('Prefetch segments must not be advertised with an EXT-X-MAP tag.');
        }
    }
    return segment;
}

function parseMediaPlaylist(lines: Array<Line>, params: ParseParams): MediaPlaylist {
    const playlist = new MediaPlaylist();
    let segmentStart = -1;
    let mediaSequence = 0;
    let discontinuityFound = false;
    let prefetchFound = false;
    let discontinuitySequence = 0;
    let currentKey = null;
    let currentMap = null;
    let containsParts = false;
    for (const [index, line] of lines.entries()) {
        if (typeof line === 'string') {
            // uri
            if (segmentStart === -1) {
                utils.INVALIDPLAYLIST('A URI line is not preceded by any segment tags');
            }
            if (!playlist.targetDuration) {
                utils.INVALIDPLAYLIST('The EXT-X-TARGETDURATION tag is REQUIRED');
            }
            if (prefetchFound) {
                utils.INVALIDPLAYLIST('These segments must appear after all complete segments.');
            }
            let segment = parseSegment(
                lines,
                line,
                segmentStart,
                index - 1,
                mediaSequence++,
                discontinuitySequence,
                params,
            );

            // Apply user-specified segment transformers
            segment = transformSegment(segment, playlist, params);

            if (segment) {
                [discontinuitySequence, currentKey, currentMap] = addSegment(
                    playlist,
                    segment,
                    discontinuitySequence,
                    currentKey,
                    currentMap,
                );
                if (!containsParts && segment.parts.length > 0) {
                    containsParts = true;
                }
            }
            segmentStart = -1;
            continue;
        }
        const { name, value, attributes, category } = line;
        if (category === 'Segment') {
            if (segmentStart === -1) {
                segmentStart = index;
            }
            if (name === 'EXT-X-DISCONTINUITY') {
                discontinuityFound = true;
            }
            continue;
        }

        if (name === 'EXT-X-VERSION') {
            if (playlist.version === undefined) {
                playlist.version = value as Playlist['version'];
            } else {
                utils.INVALIDPLAYLIST('A Playlist file MUST NOT contain more than one EXT-X-VERSION tag.');
            }
        } else if (name === 'EXT-X-TARGETDURATION') {
            playlist.targetDuration = params.targetDuration = value as MediaPlaylist['targetDuration'];
        } else if (name === 'EXT-X-MEDIA-SEQUENCE') {
            if (playlist.segments.length > 0) {
                utils.INVALIDPLAYLIST(
                    'The EXT-X-MEDIA-SEQUENCE tag MUST appear before the first Media Segment in the Playlist.',
                );
            }
            playlist.mediaSequenceBase = mediaSequence = value as MediaPlaylist['mediaSequenceBase'];
        } else if (name === 'EXT-X-DISCONTINUITY-SEQUENCE') {
            if (playlist.segments.length > 0) {
                utils.INVALIDPLAYLIST(
                    'The EXT-X-DISCONTINUITY-SEQUENCE tag MUST appear before the first Media Segment in the Playlist.',
                );
            }
            if (discontinuityFound) {
                utils.INVALIDPLAYLIST(
                    'The EXT-X-DISCONTINUITY-SEQUENCE tag MUST appear before any EXT-X-DISCONTINUITY tag.',
                );
            }
            playlist.discontinuitySequenceBase = discontinuitySequence =
                value as MediaPlaylist['discontinuitySequenceBase'];
        } else if (name === 'EXT-X-ENDLIST') {
            playlist.endlist = true;
        } else if (name === 'EXT-X-PLAYLIST-TYPE') {
            playlist.playlistType = value as MediaPlaylist['playlistType'];
        } else if (name === MediaPlaylistType.IFrame || name === MediaPlaylistType.Image) {
            if (params.compatibleVersion < 4) {
                params.compatibleVersion = 4;
            }
            playlist.mediaPlaylistType = name as MediaPlaylistType;
        } else if (name === 'EXT-X-INDEPENDENT-SEGMENTS') {
            if (playlist.independentSegments) {
                utils.INVALIDPLAYLIST('EXT-X-INDEPENDENT-SEGMENTS tag MUST NOT appear more than once in a Playlist');
            }
            playlist.independentSegments = true;
        } else if (name === 'EXT-X-START') {
            if (playlist.start) {
                utils.INVALIDPLAYLIST('EXT-X-START tag MUST NOT appear more than once in a Playlist');
            }
            if (typeof attributes['TIME-OFFSET'] !== 'number') {
                utils.INVALIDPLAYLIST('EXT-X-START: TIME-OFFSET attribute is REQUIRED');
            }
            playlist.start = {
                offset: attributes['TIME-OFFSET'] as PlaylistStart['offset'],
                precise: (attributes['PRECISE'] ?? false) as PlaylistStart['precise'],
            };
        } else if (name === 'EXT-X-SERVER-CONTROL') {
            if (!attributes['CAN-BLOCK-RELOAD']) {
                utils.INVALIDPLAYLIST('EXT-X-SERVER-CONTROL: CAN-BLOCK-RELOAD=YES is mandatory for Low-Latency HLS');
            }
            playlist.lowLatencyCompatibility = {
                canBlockReload: attributes['CAN-BLOCK-RELOAD'] as LowLatencyCompatibility['canBlockReload'],
                canSkipUntil: attributes['CAN-SKIP-UNTIL'] as LowLatencyCompatibility['canSkipUntil'],
                holdBack: attributes['HOLD-BACK'] as LowLatencyCompatibility['holdBack'],
                partHoldBack: attributes['PART-HOLD-BACK'] as LowLatencyCompatibility['partHoldBack'],
            };
        } else if (name === 'EXT-X-PART-INF') {
            if (!attributes['PART-TARGET']) {
                utils.INVALIDPLAYLIST('EXT-X-PART-INF: PART-TARGET attribute is mandatory');
            }
            playlist.partTargetDuration = attributes['PART-TARGET'] as MediaPlaylist['partTargetDuration'];
        } else if (name === 'EXT-X-RENDITION-REPORT') {
            const uri: string = attributes['URI'] as string;
            if (!uri) {
                utils.INVALIDPLAYLIST('EXT-X-RENDITION-REPORT: URI attribute is mandatory');
            }
            if (uri && uri.search(/^[a-z]+:/) === 0) {
                utils.INVALIDPLAYLIST('EXT-X-RENDITION-REPORT: URI must be relative to the playlist uri');
            }
            playlist.renditionReports.push(
                new RenditionReport({
                    uri,
                    lastMSN: attributes['LAST-MSN'] as RenditionReport['lastMSN'],
                    lastPart: attributes['LAST-PART'] as RenditionReport['lastPart'],
                }),
            );
        } else if (name === 'EXT-X-SKIP') {
            if (!attributes['SKIPPED-SEGMENTS']) {
                utils.INVALIDPLAYLIST('EXT-X-SKIP: SKIPPED-SEGMENTS attribute is mandatory');
            }
            if (params.compatibleVersion < 9) {
                params.compatibleVersion = 9;
            }
            playlist.skip = attributes['SKIPPED-SEGMENTS'] as MediaPlaylist['skip'];
            mediaSequence += playlist.skip;
        } else if (name === 'EXT-X-PREFETCH') {
            const segment = parsePrefetchSegment(
                lines,
                value as string,
                segmentStart === -1 ? index : segmentStart,
                index - 1,
                mediaSequence++,
                discontinuitySequence,
                params,
            );
            if (segment) {
                if (segment.discontinuity) {
                    segment.discontinuitySequence++;
                    discontinuitySequence = segment.discontinuitySequence;
                }
                if (segment.key) {
                    currentKey = segment.key;
                } else {
                    segment.key = currentKey;
                }
                playlist.prefetchSegments.push(segment);
            }
            prefetchFound = true;
            segmentStart = -1;
        }
    }
    if (segmentStart !== -1) {
        let segment = parseSegment(
            lines,
            '',
            segmentStart,
            lines.length - 1,
            mediaSequence++,
            discontinuitySequence,
            params,
        );

        // Apply user-specified segment transformers
        segment = transformSegment(segment, playlist, params);

        if (segment) {
            const { parts } = segment;
            if (parts.length > 0 && !playlist.endlist && !parts[parts.length - 1].hint) {
                utils.INVALIDPLAYLIST(
                    'If the Playlist contains EXT-X-PART tags and does not contain an EXT-X-ENDLIST tag, the Playlist must contain an EXT-X-PRELOAD-HINT tag with a TYPE=PART attribute',
                );
            }
            addSegment(playlist, segment, currentKey, currentMap);
            if (!containsParts && segment.parts.length > 0) {
                containsParts = true;
            }
        }
    }
    checkDateRange(playlist.segments);
    if (playlist.lowLatencyCompatibility) {
        checkLowLatencyCompatibility(playlist, containsParts);
    }

    // Apply any user-specified Playlist transformations
    params.playlistTransformers?.reduce(
        (playlist: Playlist, transformer: PlaylistTransformer): Playlist => transformer(playlist),
        playlist,
    );

    return playlist;
}

function transformSegment(segment: Segment, playlist: MediaPlaylist, params: ParseParams): Segment | null {
    const transformers: Array<SegmentTransformer> | undefined = params.segmentTransformers;
    if (!transformers) {
        return segment;
    }

    // Apply all the transformers to the segment
    const transformedSegment: Segment | null = transformers.reduce(
        (currentSegment: Segment | null, transformer: SegmentTransformer) => {
            // Don't bother transforming null segments
            if (!currentSegment) {
                return currentSegment;
            }
            return transformer(currentSegment, playlist);
        },
        segment,
    );

    return transformedSegment;
}

function addSegment(
    playlist: MediaPlaylist,
    segment: Segment,
    discontinuitySequence: number,
    currentKey: Key,
    currentMap?: MediaInitializationSection,
): [number, Key, MediaInitializationSection] {
    const { discontinuity, key, map, byterange, uri } = segment;
    if (discontinuity) {
        segment.discontinuitySequence = discontinuitySequence + 1;
    }
    if (!key) {
        segment.key = currentKey;
    }
    if (!map) {
        segment.map = currentMap;
    }
    if (byterange && byterange.offset === -1) {
        const { segments } = playlist;
        if (segments.length > 0) {
            const prevSegment = segments[segments.length - 1];
            if (prevSegment.byterange && prevSegment.uri === uri) {
                byterange.offset = prevSegment.byterange.offset + prevSegment.byterange.length;
            } else {
                utils.INVALIDPLAYLIST(
                    'If offset of EXT-X-BYTERANGE is not present, a previous Media Segment MUST be a sub-range of the same media resource',
                );
            }
        } else {
            utils.INVALIDPLAYLIST(
                'If offset of EXT-X-BYTERANGE is not present, a previous Media Segment MUST appear in the Playlist file',
            );
        }
    }
    playlist.segments.push(segment);
    return [segment.discontinuitySequence, segment.key, segment.map];
}

function checkDateRange(segments: Array<Segment>): void {
    const earliestDates = new Map();
    const rangeList = new Map();
    let hasDateRange = false;
    let hasProgramDateTime = false;
    for (let i = segments.length - 1; i >= 0; i--) {
        const { programDateTime, dateRange } = segments[i];
        if (programDateTime) {
            hasProgramDateTime = true;
        }
        if (dateRange && dateRange.start) {
            hasDateRange = true;
            if (dateRange.endOnNext && (dateRange.end || dateRange.duration)) {
                utils.INVALIDPLAYLIST(
                    'An EXT-X-DATERANGE tag with an END-ON-NEXT=YES attribute MUST NOT contain DURATION or END-DATE attributes.',
                );
            }
            const start = dateRange.start.getTime();
            const duration = dateRange.duration || 0;
            if (dateRange.end && dateRange.duration) {
                if (start + duration * 1000 !== dateRange.end.getTime()) {
                    utils.INVALIDPLAYLIST(
                        'END-DATE MUST be equal to the value of the START-DATE attribute plus the value of the DURATION',
                    );
                }
            }
            if (dateRange.endOnNext) {
                dateRange.end = earliestDates.get(dateRange.classId);
            }
            earliestDates.set(dateRange.classId, dateRange.start);
            const end = dateRange.end
                ? dateRange.end.getTime()
                : dateRange.start.getTime() + (dateRange.duration || 0) * 1000;
            const range = rangeList.get(dateRange.classId);
            if (range) {
                for (const entry of range) {
                    if ((entry.start <= start && entry.end > start) || (entry.start >= start && entry.start < end)) {
                        utils.INVALIDPLAYLIST('DATERANGE tags with the same CLASS should not overlap');
                    }
                }
                range.push({ start, end });
            } else {
                rangeList.set(dateRange.classId, [{ start, end }]);
            }
        }
    }
    if (hasDateRange && !hasProgramDateTime) {
        utils.INVALIDPLAYLIST(
            'If a Playlist contains an EXT-X-DATERANGE tag, it MUST also contain at least one EXT-X-PROGRAM-DATE-TIME tag.',
        );
    }
}

function checkLowLatencyCompatibility(
    { lowLatencyCompatibility, targetDuration, partTargetDuration, segments, renditionReports }: MediaPlaylist,
    containsParts: boolean,
): void {
    const { canSkipUntil, holdBack, partHoldBack } = lowLatencyCompatibility;
    if (canSkipUntil < targetDuration * 6) {
        utils.INVALIDPLAYLIST('The Skip Boundary must be at least six times the EXT-X-TARGETDURATION.');
    }
    // Its value is a floating-point number of seconds and .
    if (holdBack < targetDuration * 3) {
        utils.INVALIDPLAYLIST('HOLD-BACK must be at least three times the EXT-X-TARGETDURATION.');
    }
    if (containsParts) {
        if (partTargetDuration === undefined) {
            utils.INVALIDPLAYLIST('EXT-X-PART-INF is required if a Playlist contains one or more EXT-X-PART tags');
        }
        if (partHoldBack === undefined) {
            utils.INVALIDPLAYLIST('EXT-X-PART: PART-HOLD-BACK attribute is mandatory');
        }
        if (partHoldBack < partTargetDuration) {
            utils.INVALIDPLAYLIST('PART-HOLD-BACK must be at least PART-TARGET');
        }
        for (const [segmentIndex, { parts }] of segments.entries()) {
            if (parts.length > 0 && segmentIndex < segments.length - 3) {
                utils.INVALIDPLAYLIST(
                    'Remove EXT-X-PART tags from the Playlist after they are greater than three target durations from the end of the Playlist.',
                );
            }
            for (const [partIndex, { duration }] of parts.entries()) {
                if (duration === undefined) {
                    continue;
                }
                if (duration > partTargetDuration) {
                    utils.INVALIDPLAYLIST('PART-TARGET is the maximum duration of any Partial Segment');
                }
                if (partIndex < parts.length - 1 && duration < partTargetDuration * 0.85) {
                    utils.INVALIDPLAYLIST(
                        'All Partial Segments except the last part of a segment must have a duration of at least 85% of PART-TARGET',
                    );
                }
            }
        }
    }
    for (const report of renditionReports) {
        const lastSegment = segments[segments.length - 1];
        if (!report.lastMSN) {
            report.lastMSN = lastSegment.mediaSequenceNumber;
        }
        if (!report.lastPart && lastSegment.parts.length > 0) {
            report.lastPart = lastSegment.parts.length - 1;
        }
    }
}

function CHECKTAGCATEGORY(category: TagCategory, params: ParseParams): void {
    if (category === 'Segment' || category === 'MediaPlaylist') {
        if (params.isMasterPlaylist === undefined) {
            params.isMasterPlaylist = false;
            return;
        }
        if (params.isMasterPlaylist) {
            MIXEDTAGS();
        }
        return;
    }
    if (category === 'MasterPlaylist') {
        if (params.isMasterPlaylist === undefined) {
            params.isMasterPlaylist = true;
            return;
        }
        if (params.isMasterPlaylist === false) {
            MIXEDTAGS();
        }
    }
    // category === 'Basic' or 'MediaorMasterPlaylist' or 'Unknown'
}

function parseTag(line: string, params: ParseParams): Tag {
    const [name, param] = splitTag(line);
    const category = getTagCategory(name);
    CHECKTAGCATEGORY(category, params);
    if (category === 'Unknown') {
        return null;
    }
    if (category === 'MediaPlaylist' && name !== 'EXT-X-RENDITION-REPORT' && name !== 'EXT-X-PREFETCH') {
        if (params.hash[name]) {
            utils.INVALIDPLAYLIST(
                'There MUST NOT be more than one Media Playlist tag of each type in any Media Playlist',
            );
        }
        params.hash[name] = true;
    }
    const [value, attributes] = parseTagParam(name, param);
    return { name, category, value, attributes };
}

function lexicalParse(text: string, params: ParseParams): Array<Line> {
    const lines: Array<Line> = [];
    for (const l of text.split('\n')) {
        // V8 has garbage collection issues when cleaning up substrings split from strings greater
        // than 13 characters so before we continue we need to safely copy over each line so that it
        // doesn't hold any reference to the containing string.
        const line = Buffer.from(l.trim()).toString();
        if (!line) {
            // empty line
            continue;
        }
        if (line.startsWith('#')) {
            if (line.startsWith('#EXT')) {
                // tag
                const tag = parseTag(line, params);
                if (tag) {
                    lines.push(tag);
                }
            }
            // comment
            continue;
        }
        // uri
        lines.push(line);
    }
    if (lines.length === 0 || (lines[0] as Tag).name !== 'EXTM3U') {
        utils.INVALIDPLAYLIST('The EXTM3U tag MUST be the first line.');
    }
    return lines;
}

function semanticParse(lines: Array<Line>, params: ParseParams): MasterPlaylist | MediaPlaylist {
    let playlist: MasterPlaylist | MediaPlaylist;
    if (params.isMasterPlaylist) {
        playlist = parseMasterPlaylist(lines, params);
    } else {
        playlist = parseMediaPlaylist(lines, params);
        if (playlist.isStandardPlaylist && params.hasMap && params.compatibleVersion < 6) {
            params.compatibleVersion = 6;
        }
    }
    if (params.compatibleVersion > 1) {
        if (!playlist.version || playlist.version < params.compatibleVersion) {
            utils.INVALIDPLAYLIST(`EXT-X-VERSION needs to be ${params.compatibleVersion} or higher.`);
        }
    }
    return playlist;
}

export function parse(text: string, customParams: UserParseParams = {}): MasterPlaylist | MediaPlaylist {
    const defaultParams: ParseParams = {
        version: undefined,
        isMasterPlaylist: undefined,
        hasMap: false,
        targetDuration: 0,
        compatibleVersion: 1,
        isClosedCaptionsNone: false,
        hash: {},
    };

    const params: ParseParams = Object.assign(defaultParams, customParams);

    const lines = lexicalParse(text, params);
    const playlist = semanticParse(lines, params);
    playlist.source = text;
    return playlist;
}

export function safeParseMaster(text: string, customParams: UserParseParams = {}): MasterPlaylist {
    const playlist: MasterPlaylist | MediaPlaylist = parse(text, customParams);
    if (!(playlist instanceof MasterPlaylist)) {
        throw new Error('Playlist is not a Master Playlist');
    }
    return playlist;
}

export function safeParseMedia(text: string, customParams: UserParseParams = {}): MediaPlaylist {
    const playlist: MasterPlaylist | MediaPlaylist = parse(text, customParams);
    if (!(playlist instanceof MediaPlaylist)) {
        throw new Error('Playlist is not a Media Playlist');
    }
    return playlist;
}
