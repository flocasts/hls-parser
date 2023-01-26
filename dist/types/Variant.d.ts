import MediaPlaylist from './MediaPlaylist';
import Rendition from './Rendition';
import Resolution from './Resolution';
export interface VariantCurrentRendition {
    audio?: number;
    video?: number;
    subtitles?: number;
    closedCaptions?: number;
}
export interface VariantProperties {
    uri: string;
    isIFrameOnly: boolean;
    bandwidth: number;
    averageBandwidth: number;
    score: number;
    codecs: string;
    resolution: Resolution;
    frameRate: number;
    hdcpLevel: string;
    allowedCpc: boolean;
    videoRange: string;
    stableVariantId: string;
    audio: Rendition<'AUDIO'>[];
    video: Rendition<'VIDEO'>[];
    subtitles: Rendition<'SUBTITLES'>[];
    closedCaptions: Rendition<'CLOSED-CAPTIONS'>[];
    currentRenditions: VariantCurrentRendition;
    playlist: MediaPlaylist;
}
export declare type VariantConstructorOptionalProperties = Partial<Pick<VariantProperties, 'isIFrameOnly' | 'averageBandwidth' | 'score' | 'resolution' | 'frameRate' | 'hdcpLevel' | 'allowedCpc' | 'videoRange' | 'stableVariantId' | 'audio' | 'video' | 'subtitles' | 'closedCaptions' | 'currentRenditions' | 'codecs' | 'playlist'>>;
export declare type VariantConstructorRequiredProperties = Pick<VariantProperties, 'uri' | 'bandwidth'>;
export declare type VariantConstructorProperties = VariantConstructorOptionalProperties & VariantConstructorRequiredProperties;
export declare class Variant implements VariantProperties {
    uri: string;
    isIFrameOnly: boolean;
    bandwidth: number;
    averageBandwidth: number;
    score: number;
    codecs: string;
    resolution: Resolution;
    frameRate: number;
    hdcpLevel: string;
    allowedCpc: boolean;
    videoRange: string;
    stableVariantId: string;
    audio: Rendition<'AUDIO'>[];
    video: Rendition<'VIDEO'>[];
    subtitles: Rendition<'SUBTITLES'>[];
    closedCaptions: Rendition<'CLOSED-CAPTIONS'>[];
    currentRenditions: VariantCurrentRendition;
    playlist: MediaPlaylist;
    constructor({ uri, isIFrameOnly, bandwidth, averageBandwidth, score, codecs, resolution, frameRate, hdcpLevel, allowedCpc, videoRange, stableVariantId, audio, video, subtitles, closedCaptions, currentRenditions, playlist, }: VariantConstructorProperties);
}
export default Variant;
