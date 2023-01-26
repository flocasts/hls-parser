import Data from './Data';
import ByteRange from './ByteRange';
export interface PartialSegmentProperties extends Data {
    hint: boolean;
    uri: string;
    duration: number;
    independent: boolean;
    byterange: ByteRange;
    gap: string;
}
export declare type PartialSegmentsOptionalConstructorProperties = Partial<Pick<PartialSegmentProperties, 'hint' | 'duration' | 'independent' | 'byterange' | 'gap'>>;
export declare type PartialSegmentsRequiredConstructorProperties = Pick<PartialSegmentProperties, 'uri'>;
export declare type PartialSegmentConstructorProperties = PartialSegmentsOptionalConstructorProperties & PartialSegmentsRequiredConstructorProperties;
export declare class PartialSegment extends Data implements PartialSegmentProperties {
    hint: boolean;
    uri: string;
    duration: number;
    independent: boolean;
    byterange: ByteRange;
    gap: string;
    constructor({ hint, uri, duration, independent, byterange, gap, }: PartialSegmentConstructorProperties);
}
export default PartialSegment;
