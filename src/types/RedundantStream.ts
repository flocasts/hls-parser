import MasterPlaylist from './MasterPlaylist';

export interface RedundantPlaylistProperties {
    root?: MasterPlaylist;
    sides: Array<MasterPlaylist>;
}

export type RedundantPlaylistConstructorRequiredProperties = Required<Pick<RedundantPlaylistProperties, 'sides'>>;

export type RedundantPlaylistConstructorOptionalProperties = Partial<Pick<RedundantPlaylistProperties, 'root'>>;

export type RedundantPlaylistConstructorProperties = RedundantPlaylistConstructorRequiredProperties &
    RedundantPlaylistConstructorOptionalProperties;

export class RedundantStream implements RedundantPlaylistProperties {
    public root?: MasterPlaylist;
    public sides: Array<MasterPlaylist>;

    constructor({ root, sides }: RedundantPlaylistConstructorProperties) {
        this.root = root;
        this.sides = sides;
    }
}

export default RedundantStream;
