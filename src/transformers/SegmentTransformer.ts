import { MediaPlaylist, Segment } from '../types';

/**
 * This defines a function used in two ways:
 * - transforming segments of a playlist during parsing
 * - transforming segment during iteration
 * @see UserParseParams
 * @see SegmentIterator
 */
export default interface SegmentTransformer {
    (segment: Segment, playlist?: MediaPlaylist): Segment | null;
}
