import Segment from './Segment';
import PrefetchSegment from './PrefetchSegment';
import RenditionReport from './RenditionReport';
import Playlist, { PlaylistProperties, PlaylistConstructorProperties } from './Playlist';

export interface LowLatencyCompatibility {
    canBlockReload: boolean;
    canSkipUntil: number;
    holdBack?: boolean;
    partHoldBack: number;
}

export interface MediaPlaylistProperties extends PlaylistProperties {
    targetDuration: number;
    mediaSequenceBase: number;
    discontinuitySequenceBase: number;
    endlist: boolean;
    playlistType: string;
    isIFrame: boolean;
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
        | 'isIFrame'
        | 'lowLatencyCompatibility'
        | 'partTargetDuration'
        | 'hash'
    >
>;
export type MediaPlaylistConstructorProperties = Omit<PlaylistConstructorProperties, 'isMasterPlaylist'> &
    MediaPlaylistOptionalConstructorProperties;

export class MediaPlaylist extends Playlist implements MediaPlaylistProperties {
    public targetDuration: number;
    public mediaSequenceBase: number;
    public discontinuitySequenceBase: number;
    public endlist: boolean;
    public playlistType: string;
    public isIFrame: boolean;
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
            isIFrame,
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
        this.isIFrame = isIFrame;
        this.segments = segments;
        this.prefetchSegments = prefetchSegments;
        this.lowLatencyCompatibility = lowLatencyCompatibility;
        this.partTargetDuration = partTargetDuration;
        this.renditionReports = renditionReports;
        this.skip = skip;
        this.hash = hash;
    }
}

export default MediaPlaylist;
