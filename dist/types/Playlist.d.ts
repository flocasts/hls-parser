import Data from './Data';
export interface PlaylistStart {
    offset: number;
    precise: boolean;
}
export interface PlaylistProperties extends Data {
    isMasterPlaylist: boolean;
    uri: string;
    version: number;
    independentSegments: boolean;
    start: PlaylistStart;
    source?: string;
}
export declare type PlaylistOptionalConstructorProperties = Partial<Pick<PlaylistProperties, 'uri' | 'version' | 'independentSegments' | 'start' | 'source'>>;
export declare type PlaylistRequiredConstructorProperties = Pick<PlaylistProperties, 'isMasterPlaylist'>;
export declare type PlaylistConstructorProperties = PlaylistOptionalConstructorProperties & PlaylistRequiredConstructorProperties;
export declare class Playlist extends Data implements PlaylistProperties {
    isMasterPlaylist: boolean;
    uri: string;
    version: number;
    independentSegments: boolean;
    start: PlaylistStart;
    source?: string;
    constructor({ isMasterPlaylist, uri, version, independentSegments, start, source, }: PlaylistConstructorProperties);
}
export default Playlist;
