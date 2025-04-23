import Segment from './Segment';
import PrefetchSegment from './PrefetchSegment';
import RenditionReport from './RenditionReport';
import Playlist, { PlaylistConstructorProperties, PlaylistProperties } from './Playlist';
import { SegmentIterator } from './SegmentIterator';
import SegmentTransformer from '../transformers/SegmentTransformer';

export enum MediaPlaylistType {
    Standard = 'STANDARD',
    IFrame = 'EXT-X-I-FRAMES-ONLY',
    Image = 'EXT-X-IMAGES-ONLY',
}

export interface LowLatencyCompatibility {
    canBlockReload: boolean;
    canSkipUntil: number;
    holdBack?: number;
    partHoldBack: number;
}

export interface MediaPlaylistProperties extends PlaylistProperties {
    targetDuration: number;
    mediaSequenceBase: number;
    discontinuitySequenceBase: number;
    endlist: boolean;
    playlistType: string;
    mediaPlaylistType: MediaPlaylistType;
    segments: Segment[];
    prefetchSegments: PrefetchSegment[];
    lowLatencyCompatibility: LowLatencyCompatibility;
    partTargetDuration: number;
    renditionReports: RenditionReport[];
    skip: number;
    hash: string;
}

export type MediaPlaylistOptionalConstructorProperties = Partial<
    Pick<
        MediaPlaylistProperties,
        | 'mediaSequenceBase'
        | 'discontinuitySequenceBase'
        | 'endlist'
        | 'segments'
        | 'prefetchSegments'
        | 'renditionReports'
        | 'skip'
        | 'targetDuration'
        | 'playlistType'
        | 'mediaPlaylistType'
        | 'lowLatencyCompatibility'
        | 'partTargetDuration'
        | 'hash'
    >
>;

export type MediaPlaylistConstructorProperties = Omit<PlaylistConstructorProperties, 'isMasterPlaylist'> &
    MediaPlaylistOptionalConstructorProperties;

export class MediaPlaylist extends Playlist implements MediaPlaylistProperties, Iterable<Segment> {
    public targetDuration: number;
    public mediaSequenceBase: number;
    public discontinuitySequenceBase: number;
    public endlist: boolean;
    public playlistType: string;
    public mediaPlaylistType: MediaPlaylistType;
    public segments: Segment[];
    public prefetchSegments: PrefetchSegment[];
    public lowLatencyCompatibility: LowLatencyCompatibility;
    public partTargetDuration: number;
    public renditionReports: RenditionReport[];
    public skip: number;
    public hash: string;

    constructor(params: MediaPlaylistConstructorProperties = {}) {
        (params as PlaylistConstructorProperties).isMasterPlaylist = false;
        super(params as PlaylistConstructorProperties);
        const {
            targetDuration,
            mediaSequenceBase = 0,
            discontinuitySequenceBase = 0,
            endlist = false,
            playlistType,
            mediaPlaylistType,
            segments = [],
            prefetchSegments = [],
            lowLatencyCompatibility,
            partTargetDuration,
            renditionReports = [],
            skip = 0,
            hash,
        } = params;
        this.targetDuration = targetDuration;
        this.mediaSequenceBase = mediaSequenceBase;
        this.discontinuitySequenceBase = discontinuitySequenceBase;
        this.endlist = endlist;
        this.playlistType = playlistType;
        this.mediaPlaylistType = mediaPlaylistType ?? MediaPlaylistType.Standard;
        this.segments = segments;
        this.prefetchSegments = prefetchSegments;
        this.lowLatencyCompatibility = lowLatencyCompatibility;
        this.partTargetDuration = partTargetDuration;
        this.renditionReports = renditionReports;
        this.skip = skip;
        this.hash = hash;
    }

    [Symbol.iterator](): SegmentIterator {
        return new SegmentIterator(this.segments);
    }

    segmentIterator(transformer?: SegmentTransformer): SegmentIterator {
        return new SegmentIterator(this.segments, transformer);
    }

    get isStandardPlaylist(): boolean {
        return this.mediaPlaylistType === MediaPlaylistType.Standard;
    }

    get isIFramePlaylist(): boolean {
        return this.mediaPlaylistType === MediaPlaylistType.IFrame;
    }

    get isImagePlaylist(): boolean {
        return this.mediaPlaylistType === MediaPlaylistType.Image;
    }
}

export default MediaPlaylist;
