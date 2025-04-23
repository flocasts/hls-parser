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

export type MasterPlaylistOptionalConstructorProperties = Partial<
    Pick<MasterPlaylistProperties, 'variants' | 'currentVariant' | 'sessionDataList' | 'sessionKeyList'>
>;
export type MasterPlaylistConstructorProperties = Omit<PlaylistConstructorProperties, 'isMasterPlaylist'> &
    MasterPlaylistOptionalConstructorProperties;

export class MasterPlaylist extends Playlist implements MasterPlaylistProperties, Iterable<Variant> {
    public variants: Variant[];
    public currentVariant: Variant;
    public sessionDataList: SessionData[];
    public sessionKeyList: Key[];

    constructor(params: MasterPlaylistConstructorProperties = {}) {
        (params as PlaylistConstructorProperties).isMasterPlaylist = true;
        super(params as PlaylistConstructorProperties);
        const { variants = [], currentVariant, sessionDataList = [], sessionKeyList = [] } = params;
        this.variants = variants;
        this.currentVariant = currentVariant;
        this.sessionDataList = sessionDataList;
        this.sessionKeyList = sessionKeyList;
    }

    [Symbol.iterator](): Iterator<Variant> {
        return this.variants[Symbol.iterator]();
    }
}

export default MasterPlaylist;
