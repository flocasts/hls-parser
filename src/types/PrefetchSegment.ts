import Data from './Data';
import Key from './Key';
import * as utils from '../utils';

export interface PrefetchSegmentProperties extends Data {
    uri: string;
    discontinuity: boolean;
    mediaSequenceNumber: number;
    discontinuitySequence: number;
    key: Key;
}

export type PrefetchSegmentOptionalConstructorProperties = Partial<
    Pick<PrefetchSegmentProperties, 'discontinuity' | 'mediaSequenceNumber' | 'discontinuitySequence' | 'key'>
>;
export type PrefetchSegmentRequiredConstructorProperties = Pick<PrefetchSegmentProperties, 'uri'>;
export type PrefetchSegmentConstructorProperties = PrefetchSegmentOptionalConstructorProperties &
    PrefetchSegmentRequiredConstructorProperties;

export class PrefetchSegment extends Data implements PrefetchSegmentProperties {
    public uri: string;
    public discontinuity: boolean;
    public mediaSequenceNumber: number;
    public discontinuitySequence: number;
    public key: Key;

    constructor({
        uri, // required
        discontinuity,
        mediaSequenceNumber = 0,
        discontinuitySequence = 0,
        key,
    }: PrefetchSegmentConstructorProperties) {
        super('prefetch');
        utils.PARAMCHECK(uri);
        this.uri = uri;
        this.discontinuity = discontinuity;
        this.mediaSequenceNumber = mediaSequenceNumber;
        this.discontinuitySequence = discontinuitySequence;
        this.key = key;
    }
}

export default PrefetchSegment;
