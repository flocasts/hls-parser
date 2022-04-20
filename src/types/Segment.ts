import Data from './Data';
import ByteRange from './ByteRange';
import Key from './Key';
import MediaInitializationSection from './MediaInitializationSection';
import DateRange from './DateRange';
import SpliceInfo from './SpliceInfo';
import PartialSegment from './PartialSegment';

export interface SegmentProperties extends Data {
    uri: string;
    mimeType: string;
    data: string;
    duration: number;
    title: string;
    byterange: ByteRange;
    discontinuity: boolean;
    mediaSequenceNumber: number;
    discontinuitySequence: number;
    key: Key;
    map: MediaInitializationSection;
    programDateTime: Date | null;
    dateRange: DateRange;
    markers: SpliceInfo[];
    parts: PartialSegment[];
}

export type SegmentOptionalConstructorProperties = Partial<
    Pick<
        SegmentProperties,
        | 'mediaSequenceNumber'
        | 'discontinuitySequence'
        | 'markers'
        | 'parts'
        | 'uri'
        | 'mimeType'
        | 'data'
        | 'title'
        | 'byterange'
        | 'discontinuity'
        | 'key'
        | 'map'
        | 'programDateTime'
        | 'dateRange'
        | 'duration'
    >
>;
export type SegmentConstructorProperties = SegmentOptionalConstructorProperties;

export class Segment extends Data implements SegmentProperties {
    public uri: string;
    public mimeType: string;
    public data: string;
    public duration: number;
    public title: string;
    public byterange: ByteRange;
    public discontinuity: boolean;
    public mediaSequenceNumber: number;
    public discontinuitySequence: number;
    public key: Key;
    public map: MediaInitializationSection;
    public programDateTime: Date | null;
    public dateRange: DateRange;
    public markers: SpliceInfo[];
    public parts: PartialSegment[];

    constructor({
        uri,
        mimeType,
        data,
        duration,
        title,
        byterange,
        discontinuity,
        mediaSequenceNumber = 0,
        discontinuitySequence = 0,
        key,
        map,
        programDateTime,
        dateRange,
        markers = [],
        parts = [],
    }: SegmentConstructorProperties) {
        super('segment');
        // utils.PARAMCHECK(uri, mediaSequenceNumber, discontinuitySequence);
        this.uri = uri;
        this.mimeType = mimeType;
        this.data = data;
        this.duration = duration;
        this.title = title;
        this.byterange = byterange;
        this.discontinuity = discontinuity;
        this.mediaSequenceNumber = mediaSequenceNumber;
        this.discontinuitySequence = discontinuitySequence;
        this.key = key;
        this.map = map;
        this.programDateTime = programDateTime;
        this.dateRange = dateRange;
        this.markers = markers;
        this.parts = parts;
    }
}

export default Segment;
