import Variant from './Variant';
import SessionData from './SessionData';
import Key from './Key';
import Playlist, { PlaylistProperties, PlaylistConstructorProperties } from './Playlist';
export interface MasterPlaylistProperties extends PlaylistProperties {
    variants: Variant[];
    currentVariant: Variant;
    sessionDataList: SessionData[];
    sessionKeyList: Key[];
}
export declare type MasterPlaylistOptionalConstructorProperties = Partial<Pick<MasterPlaylistProperties, 'variants' | 'currentVariant' | 'sessionDataList' | 'sessionKeyList'>>;
export declare type MasterPlaylistConstructorProperties = Omit<PlaylistConstructorProperties, 'isMasterPlaylist'> & MasterPlaylistOptionalConstructorProperties;
export declare class MasterPlaylist extends Playlist implements MasterPlaylistProperties {
    variants: Variant[];
    currentVariant: Variant;
    sessionDataList: SessionData[];
    sessionKeyList: Key[];
    constructor(params?: MasterPlaylistConstructorProperties);
}
export default MasterPlaylist;
