import Data from './Data';
import ByteRange from './ByteRange';
import * as utils from '../utils';

export interface PartialSegmentProperties extends Data {
    hint: boolean;
    uri: string;
    duration: number;
    independent: boolean;
    byterange: ByteRange;
    gap: string;
}

export type PartialSegmentsOptionalConstructorProperties = Partial<
    Pick<PartialSegmentProperties, 'hint' | 'duration' | 'independent' | 'byterange' | 'gap'>
>;
export type PartialSegmentsRequiredConstructorProperties = Pick<PartialSegmentProperties, 'uri'>;
export type PartialSegmentConstructorProperties = PartialSegmentsOptionalConstructorProperties &
    PartialSegmentsRequiredConstructorProperties;

export class PartialSegment extends Data implements PartialSegmentProperties {
    public hint: boolean;
    public uri: string;
    public duration: number;
    public independent: boolean;
    public byterange: ByteRange;
    public gap: string;

    constructor({
        hint = false,
        uri, // required
        duration,
        independent,
        byterange,
        gap,
    }: PartialSegmentConstructorProperties) {
        super('part');
        utils.PARAMCHECK(uri);
        this.hint = hint;
        this.uri = uri;
        this.duration = duration;
        this.independent = independent;
        this.duration = duration;
        this.byterange = byterange;
        this.gap = gap;
    }
}

export default PartialSegment;
