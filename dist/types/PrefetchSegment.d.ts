import Data from './Data';
import Key from './Key';
export interface PrefetchSegmentProperties extends Data {
    uri: string;
    discontinuity: boolean;
    mediaSequenceNumber: number;
    discontinuitySequence: number;
    key: Key;
}
export declare type PrefetchSegmentOptionalConstructorProperties = Partial<Pick<PrefetchSegmentProperties, 'discontinuity' | 'mediaSequenceNumber' | 'discontinuitySequence' | 'key'>>;
export declare type PrefetchSegmentRequiredConstructorProperties = Pick<PrefetchSegmentProperties, 'uri'>;
export declare type PrefetchSegmentConstructorProperties = PrefetchSegmentOptionalConstructorProperties & PrefetchSegmentRequiredConstructorProperties;
export declare class PrefetchSegment extends Data implements PrefetchSegmentProperties {
    uri: string;
    discontinuity: boolean;
    mediaSequenceNumber: number;
    discontinuitySequence: number;
    key: Key;
    constructor({ uri, discontinuity, mediaSequenceNumber, discontinuitySequence, key, }: PrefetchSegmentConstructorProperties);
}
export default PrefetchSegment;
