import { Playlist } from '../types';
export default interface PlaylistTransformer {
    (playlist: Playlist): Playlist;
}
