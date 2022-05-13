import { MediaPlaylist } from '../types';

export default interface MediaPlaylistTransformer {
    (playlist: MediaPlaylist): MediaPlaylist;
}
