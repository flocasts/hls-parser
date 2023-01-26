import MasterPlaylist from './MasterPlaylist';
export interface RedundantPlaylistProperties {
    root?: MasterPlaylist;
    sides: Array<MasterPlaylist>;
}
export declare type RedundantPlaylistConstructorRequiredProperties = Required<Pick<RedundantPlaylistProperties, 'sides'>>;
export declare type RedundantPlaylistConstructorOptionalProperties = Partial<Pick<RedundantPlaylistProperties, 'root'>>;
export declare type RedundantPlaylistConstructorProperties = RedundantPlaylistConstructorRequiredProperties & RedundantPlaylistConstructorOptionalProperties;
export declare class RedundantStream implements RedundantPlaylistProperties {
    root?: MasterPlaylist;
    sides: Array<MasterPlaylist>;
    constructor({ root, sides }: RedundantPlaylistConstructorProperties);
}
export default RedundantStream;
