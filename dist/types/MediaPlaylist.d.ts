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
export declare type MediaPlaylistOptionalConstructorProperties = Partial<Pick<MediaPlaylistProperties, 'mediaSequenceBase' | 'discontinuitySequenceBase' | 'endlist' | 'segments' | 'prefetchSegments' | 'renditionReports' | 'skip' | 'targetDuration' | 'playlistType' | 'isIFrame' | 'lowLatencyCompatibility' | 'partTargetDuration' | 'hash'>>;
export declare type MediaPlaylistConstructorProperties = Omit<PlaylistConstructorProperties, 'isMasterPlaylist'> & MediaPlaylistOptionalConstructorProperties;
export declare class MediaPlaylist extends Playlist implements MediaPlaylistProperties {
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
    constructor(params?: MediaPlaylistConstructorProperties);
}
export default MediaPlaylist;
