import { Segment } from './Segment';
import SegmentTransformer from '../transformers/SegmentTransformer';

export class SegmentIterator implements IterableIterator<Segment> {
    private index = 0;
    constructor(
        private readonly segments: ReadonlyArray<Segment>,
        private transformer: SegmentTransformer | null = null,
    ) {}

    next(): IteratorResult<Segment> {
        if (this.done) {
            return { done: true, value: undefined };
        }

        this.index++;
        const segment = this.segments[this.index];
        const transformedSegment: Segment | null = this.transformer ? this.transformer(segment) : segment;

        // If the transformer dropped the segment, we skip it
        if (!transformedSegment) {
            return this.next();
        }

        return { done: false, value: transformedSegment };
    }

    get done(): boolean {
        return this.index >= this.segments.length;
    }

    [Symbol.iterator](): IterableIterator<Segment> {
        return this;
    }
}
