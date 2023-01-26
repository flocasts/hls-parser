import MediaPlaylist from './MediaPlaylist';
export declare type RenditionType = 'AUDIO' | 'VIDEO' | 'SUBTITLES' | 'CLOSED-CAPTIONS';
export interface RenditionProperties<T extends RenditionType> {
    type: T;
    uri: string;
    groupId: string;
    language: string;
    assocLanguage: string;
    name: string;
    isDefault: boolean;
    autoselect: boolean;
    forced: boolean;
    instreamId: string;
    characteristics: string;
    channels: string;
    playlist: MediaPlaylist;
}
export declare type RenditionConstructorOptionalProperties<T extends RenditionType> = Partial<Pick<RenditionProperties<T>, 'uri' | 'language' | 'assocLanguage' | 'isDefault' | 'autoselect' | 'forced' | 'channels' | 'characteristics' | 'instreamId' | 'playlist'>>;
export declare type RenditionConstructorRequiredProperties<T extends RenditionType> = Pick<RenditionProperties<T>, 'type' | 'groupId' | 'name'>;
export declare type RenditionConstructorProperties<T extends RenditionType> = RenditionConstructorOptionalProperties<T> & RenditionConstructorRequiredProperties<T>;
export declare class Rendition<T extends RenditionType> implements RenditionProperties<T> {
    type: T;
    uri: string;
    groupId: string;
    language: string;
    assocLanguage: string;
    name: string;
    isDefault: boolean;
    autoselect: boolean;
    forced: boolean;
    instreamId: string;
    characteristics: string;
    channels: string;
    playlist: MediaPlaylist;
    constructor({ type, uri, groupId, language, assocLanguage, name, isDefault, autoselect, forced, instreamId, characteristics, channels, playlist, }: RenditionConstructorProperties<T>);
}
export default Rendition;
