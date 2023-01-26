import Data from './Data';
import ByteRange from './ByteRange';
import Key from './Key';
import MediaInitializationSection from './MediaInitializationSection';
import DateRange from './DateRange';
import SpliceInfo from './SpliceInfo';
import PartialSegment from './PartialSegment';
export interface SegmentProperties {
    duration: number;
    uri: string;
    mimeType?: string;
    data?: string;
    title?: string;
    byterange?: ByteRange;
    discontinuity?: boolean;
    mediaSequenceNumber?: number;
    discontinuitySequence?: number;
    key?: Key | null;
    map?: MediaInitializationSection | null;
    programDateTime?: Date;
    dateRange?: DateRange;
    markers?: SpliceInfo[];
    parts?: PartialSegment[];
}
export declare class Segment extends Data implements SegmentProperties {
    duration: number;
    uri: string;
    discontinuity: boolean;
    mimeType?: string;
    data?: string;
    title?: string;
    byterange?: ByteRange;
    mediaSequenceNumber?: number;
    discontinuitySequence?: number;
    key: Key | null;
    map: MediaInitializationSection | null;
    programDateTime?: Date;
    dateRange?: DateRange;
    markers?: SpliceInfo[];
    parts?: PartialSegment[];
    constructor({ duration, uri, mimeType, data, title, byterange, discontinuity, mediaSequenceNumber, discontinuitySequence, key, map, programDateTime, dateRange, markers, parts, }: SegmentProperties);
    get endTime(): Date | null;
}
export default Segment;
