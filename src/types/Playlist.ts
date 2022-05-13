import Data from './Data';
import * as utils from '../utils';

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

export type PlaylistOptionalConstructorProperties = Partial<
    Pick<PlaylistProperties, 'uri' | 'version' | 'independentSegments' | 'start' | 'source'>
>;
export type PlaylistRequiredConstructorProperties = Pick<PlaylistProperties, 'isMasterPlaylist'>;
export type PlaylistConstructorProperties = PlaylistOptionalConstructorProperties &
    PlaylistRequiredConstructorProperties;

export class Playlist extends Data implements PlaylistProperties {
    public isMasterPlaylist: boolean;
    public uri: string;
    public version: number;
    public independentSegments: boolean;
    public start: PlaylistStart;
    public source?: string;

    constructor({
        isMasterPlaylist, // required
        uri,
        version,
        independentSegments = false,
        start,
        source,
    }: PlaylistConstructorProperties) {
        super('playlist');
        utils.PARAMCHECK(isMasterPlaylist);
        this.isMasterPlaylist = isMasterPlaylist;
        this.uri = uri;
        this.version = version;
        this.independentSegments = independentSegments;
        this.start = start;
        this.source = source;
    }
}

export default Playlist;
