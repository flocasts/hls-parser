/// <reference types="node" />
import { MasterPlaylist, MediaPlaylist, ByteRange, Resolution } from './types';
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
    hash: Record<string, any>;
}
export interface Tag {
    name: string;
    category: TagCategory;
    value: unknown;
    attributes: Attributes;
}
export declare type TagName = 'EXTM3U' | 'EXT-X-VERSION' | 'EXTINF' | 'EXT-X-BYTERANGE' | 'EXT-X-DISCONTINUITY' | 'EXT-X-PREFETCH-DISCONTINUITY' | 'EXT-X-KEY' | 'EXT-X-MAP' | 'EXT-X-PROGRAM-DATE-TIME' | 'EXT-X-DATERANGE' | 'EXT-X-CUE-OUT' | 'EXT-X-CUE-IN' | 'EXT-X-CUE-OUT-CONT' | 'EXT-X-CUE' | 'EXT-OATCLS-SCTE35' | 'EXT-X-ASSET' | 'EXT-X-SCTE35' | 'EXT-X-PART' | 'EXT-X-PRELOAD-HINT' | 'EXT-X-TARGETDURATION' | 'EXT-X-MEDIA-SEQUENCE' | 'EXT-X-DISCONTINUITY-SEQUENCE' | 'EXT-X-ENDLIST' | 'EXT-X-PLAYLIST-TYPE' | 'EXT-X-I-FRAMES-ONLY' | 'EXT-X-SERVER-CONTROL' | 'EXT-X-PART-INF' | 'EXT-X-PREFETCH' | 'EXT-X-RENDITION-REPORT' | 'EXT-X-SKIP' | 'EXT-X-MEDIA' | 'EXT-X-STREAM-INF' | 'EXT-X-I-FRAME-STREAM-INF' | 'EXT-X-SESSION-DATA' | 'EXT-X-SESSION-KEY' | 'EXT-X-INDEPENDENT-SEGMENTS' | 'EXT-X-START';
export declare type LexicalLines = [Tag, ...(Tag | string)[]];
export declare type TagCategory = 'Basic' | 'Segment' | 'MediaPlaylist' | 'MasterPlaylist' | 'MediaorMasterPlaylist' | 'Unknown';
export interface ExtInf {
    duration: number;
    title: string;
}
export declare type AttributeTypes = string | number | boolean | Buffer | Date | ByteRange | Resolution | AllowedCpc[];
export declare type Attributes = Record<string, AttributeTypes>;
export declare type TagParams = [null, null] | [number, null] | [null, Attributes] | [ExtInf, null] | [ByteRange, null] | ['EVENT' | 'VOID', null] | [unknown, null];
export interface AllowedCpc {
    format: string;
    cpcList: string[];
}
export declare function parse(text: string, customParams?: UserParseParams): MediaPlaylist | MasterPlaylist;
