import Data from './Data';
import ByteRange from './ByteRange';
import Key from './Key';
import MediaInitializationSection from './MediaInitializationSection';
import DateRange from './DateRange';
import SpliceInfo from './SpliceInfo';
import PartialSegment from './PartialSegment';

export interface SegmentProperties extends Data {
    duration: number;
    uri: string;
    mimeType?: string;
    data?: string;
    title?: string;
    byterange?: ByteRange;
    discontinuity: boolean;
    mediaSequenceNumber?: number;
    discontinuitySequence?: number;
    key?: Key | null;
    map?: MediaInitializationSection | null;
    programDateTime?: Date;
    dateRange?: DateRange;
    markers?: SpliceInfo[];
    parts?: PartialSegment[];
}

export type SegmentOptionalConstructorProperties = Partial<
    Pick<
        SegmentProperties,
        | 'mediaSequenceNumber'
        | 'discontinuitySequence'
        | 'markers'
        | 'parts'
        | 'mimeType'
        | 'data'
        | 'title'
        | 'byterange'
        | 'discontinuity'
        | 'key'
        | 'map'
        | 'programDateTime'
        | 'dateRange'
    >
>;

export type SegmentRequiredConstructorProperties = Pick<SegmentProperties, 'uri' | 'duration'>;

export type SegmentConstructorProperties = SegmentOptionalConstructorProperties & SegmentRequiredConstructorProperties;

export class Segment extends Data implements SegmentProperties {
    public duration: number;
    public uri: string;
    public discontinuity: boolean;
    public mimeType?: string;
    public data?: string;
    public title?: string;
    public byterange?: ByteRange;
    public mediaSequenceNumber?: number;
    public discontinuitySequence?: number;
    public key: Key | null;
    public map: MediaInitializationSection | null;
    public programDateTime?: Date;
    public dateRange?: DateRange;
    public markers?: SpliceInfo[];
    public parts?: PartialSegment[];

    constructor({
        duration,
        uri,
        mimeType,
        data,
        title,
        byterange,
        discontinuity = false,
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
        this.duration = duration;
        this.uri = uri;
        this.mimeType = mimeType;
        this.data = data;
        this.title = title;
        this.byterange = byterange;
        this.discontinuity = discontinuity;
        this.mediaSequenceNumber = mediaSequenceNumber;
        this.discontinuitySequence = discontinuitySequence;
        this.key = key || null;
        this.map = map || null;
        this.programDateTime = programDateTime;
        this.dateRange = dateRange;
        this.markers = markers;
        this.parts = parts;
    }

    get endTime(): Date | null {
        if (!this.programDateTime) {
            return null;
        } else {
            const millis = this.programDateTime.getTime() + this.duration * 1000;
            return new Date(millis);
        }
    }
}

export default Segment;
