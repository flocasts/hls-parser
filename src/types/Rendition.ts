import MediaPlaylist from './MediaPlaylist';
import * as utils from '../utils';

export type RenditionType = 'AUDIO' | 'VIDEO' | 'SUBTITLES' | 'CLOSED-CAPTIONS';

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

export type RenditionConstructorOptionalProperties<T extends RenditionType> = Partial<
    Pick<
        RenditionProperties<T>,
        | 'uri'
        | 'language'
        | 'assocLanguage'
        | 'isDefault'
        | 'autoselect'
        | 'forced'
        | 'channels'
        | 'characteristics'
        | 'instreamId'
        | 'playlist'
    >
>;

export type RenditionConstructorRequiredProperties<T extends RenditionType> = Pick<
    RenditionProperties<T>,
    'type' | 'groupId' | 'name'
>;

export type RenditionConstructorProperties<T extends RenditionType> = RenditionConstructorOptionalProperties<T> &
    RenditionConstructorRequiredProperties<T>;

export class Rendition<T extends RenditionType> implements RenditionProperties<T> {
    public type: T;
    public uri: string;
    public groupId: string;
    public language: string;
    public assocLanguage: string;
    public name: string;
    public isDefault: boolean;
    public autoselect: boolean;
    public forced: boolean;
    public instreamId: string;
    public characteristics: string;
    public channels: string;
    public playlist: MediaPlaylist;

    constructor({
        type, // required
        uri, // required if type='SUBTITLES'
        groupId, // required
        language,
        assocLanguage,
        name, // required
        isDefault,
        autoselect,
        forced,
        instreamId, // required if type=CLOSED-CAPTIONS
        characteristics,
        channels,
        playlist,
    }: RenditionConstructorProperties<T>) {
        utils.PARAMCHECK(type, groupId, name);
        utils.CONDITIONALASSERT(
            [type === 'SUBTITLES', uri],
            [type === 'CLOSED-CAPTIONS', instreamId],
            [type === 'CLOSED-CAPTIONS', !uri],
            [forced, type === 'SUBTITLES'],
        );
        this.type = type;
        this.uri = uri;
        this.groupId = groupId;
        this.language = language;
        this.assocLanguage = assocLanguage;
        this.name = name;
        this.isDefault = isDefault;
        this.autoselect = autoselect;
        this.forced = forced;
        this.instreamId = instreamId;
        this.characteristics = characteristics;
        this.channels = channels;
        this.playlist = playlist;
    }
}

export default Rendition;
