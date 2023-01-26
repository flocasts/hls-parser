export declare type SpliceTypes = 'OUT' | 'IN' | 'RAW';
export declare type SpliceTagNames = 'EXT-X-CUE-OUT-CONT' | 'EXT-X-CUE-OUT-CONT' | 'EXT-OATCLS-SCTE35' | 'EXT-X-ASSET' | 'EXT-X-SCTE35' | 'EXT-X-CUE';
export interface SpliceInfoProperties {
    type: SpliceTypes;
    duration?: number;
    tagName?: SpliceTagNames;
    value?: string;
}
export declare type SpliceInfoOptionsalConstructorProperties = Partial<Pick<SpliceInfoProperties, 'duration' | 'tagName' | 'value'>>;
export declare type SpliceInfoRequiredConstructorProperties = Pick<SpliceInfoProperties, 'type'>;
export declare type SpliceInfoConstructorProperties = SpliceInfoOptionsalConstructorProperties & SpliceInfoRequiredConstructorProperties;
export declare class SpliceInfo implements SpliceInfoProperties {
    type: SpliceTypes;
    duration?: number;
    tagName?: SpliceTagNames;
    value?: string;
    constructor({ type, duration, tagName, value, }: SpliceInfoConstructorProperties);
}
export default SpliceInfo;
