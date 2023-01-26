import { MediaPlaylist, Segment } from '../types';
export default interface SegmentTransformer {
    (segment: Segment, playlist: MediaPlaylist): Segment | null;
}
