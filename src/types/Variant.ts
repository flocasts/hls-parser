import MediaPlaylist from './MediaPlaylist';
import Rendition from './Rendition';
import Resolution from './Resolution';
import * as utils from '../utils';
import { AllowedCpc } from '../parse';

export enum VariantType {
    Standard = 'EXT-X-STREAM-INF',
    IFrame = 'EXT-X-I-FRAME-STREAM-INF',
    Image = 'EXT-X-IMAGE-STREAM-INF',
}

export interface VariantCurrentRendition {
    audio?: number;
    video?: number;
    subtitles?: number;
    closedCaptions?: number;
}

export interface VariantProperties {
    uri: string;
    variantType: VariantType;
    bandwidth: number;
    averageBandwidth: number;
    score: number;
    codecs: string;
    resolution: Resolution;
    frameRate: number;
    hdcpLevel: string;
    allowedCpc: Array<AllowedCpc>;
    videoRange: string;
    stableVariantId: string;
    audio: Rendition<'AUDIO'>[];
    video: Rendition<'VIDEO'>[];
    subtitles: Rendition<'SUBTITLES'>[];
    closedCaptions: Rendition<'CLOSED-CAPTIONS'>[];
    currentRenditions: VariantCurrentRendition;
    playlist?: MediaPlaylist;
}

export type VariantConstructorOptionalProperties = Partial<
    Pick<
        VariantProperties,
        | 'variantType'
        | 'averageBandwidth'
        | 'score'
        | 'resolution'
        | 'frameRate'
        | 'hdcpLevel'
        | 'allowedCpc'
        | 'videoRange'
        | 'stableVariantId'
        | 'audio'
        | 'video'
        | 'subtitles'
        | 'closedCaptions'
        | 'currentRenditions'
        | 'codecs'
        | 'playlist'
    >
>;

export type VariantConstructorRequiredProperties = Pick<VariantProperties, 'uri' | 'bandwidth'>;

export type VariantConstructorProperties = VariantConstructorOptionalProperties & VariantConstructorRequiredProperties;

export class Variant implements VariantProperties {
    public uri: string;
    public variantType: VariantType;
    public bandwidth: number;
    public averageBandwidth: number;
    public score: number;
    public codecs: string;
    public resolution: Resolution;
    public frameRate: number;
    public hdcpLevel: string;
    public allowedCpc: Array<AllowedCpc>;
    public videoRange: string;
    public stableVariantId: string;
    public audio: Rendition<'AUDIO'>[];
    public video: Rendition<'VIDEO'>[];
    public subtitles: Rendition<'SUBTITLES'>[];
    public closedCaptions: Rendition<'CLOSED-CAPTIONS'>[];
    public currentRenditions: VariantCurrentRendition;
    public playlist?: MediaPlaylist;

    constructor({
        uri, // required
        variantType = VariantType.Standard,
        bandwidth, // required
        averageBandwidth,
        score,
        codecs, // required?
        resolution,
        frameRate,
        hdcpLevel,
        allowedCpc,
        videoRange,
        stableVariantId,
        audio = [],
        video = [],
        subtitles = [],
        closedCaptions = [],
        currentRenditions = { audio: 0, video: 0, subtitles: 0, closedCaptions: 0 },
        playlist,
    }: VariantConstructorProperties) {
        utils.PARAMCHECK(variantType, uri, bandwidth); // the spec states that CODECS is required but not true in the real world
        this.uri = uri;
        this.variantType = variantType;
        this.bandwidth = bandwidth;
        this.averageBandwidth = averageBandwidth;
        this.score = score;
        this.codecs = codecs;
        this.resolution = resolution;
        this.frameRate = frameRate;
        this.hdcpLevel = hdcpLevel;
        this.allowedCpc = allowedCpc;
        this.videoRange = videoRange;
        this.stableVariantId = stableVariantId;
        this.audio = audio;
        this.video = video;
        this.subtitles = subtitles;
        this.closedCaptions = closedCaptions;
        this.currentRenditions = currentRenditions;
        this.playlist = playlist;
    }

    get isStandardVariant(): boolean {
        return this.variantType === VariantType.Standard;
    }

    get isIFrameVariant(): boolean {
        return this.variantType === VariantType.IFrame;
    }

    get isImageVariant(): boolean {
        return this.variantType === VariantType.Image;
    }
}

export default Variant;
