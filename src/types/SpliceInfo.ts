import * as utils from '../utils';

export type SpliceTypes = 'OUT' | 'IN' | 'RAW';
export type SpliceTagNames =
    | 'EXT-X-CUE-OUT-CONT'
    | 'EXT-X-CUE-OUT-CONT'
    | 'EXT-OATCLS-SCTE35'
    | 'EXT-X-ASSET'
    | 'EXT-X-SCTE35'
    | 'EXT-X-CUE';
export interface SpliceInfoProperties {
    type: SpliceTypes;
    duration?: number;
    tagName?: SpliceTagNames;
    value?: string;
    adProviderSpecificTag?: string;
}

export type SpliceInfoOptionsalConstructorProperties = Partial<
    Pick<SpliceInfoProperties, 'duration' | 'tagName' | 'value' | 'adProviderSpecificTag'>
>;
export type SpliceInfoRequiredConstructorProperties = Pick<SpliceInfoProperties, 'type'>;
export type SpliceInfoConstructorProperties = SpliceInfoOptionsalConstructorProperties &
    SpliceInfoRequiredConstructorProperties;

export class SpliceInfo implements SpliceInfoProperties {
    public type: SpliceTypes;
    public duration?: number;
    public tagName?: SpliceTagNames;
    public value?: string;
    public adProviderSpecificTag?: string;

    constructor({
        type, // required
        duration, // required if the type is 'OUT'
        tagName, // required if the type is 'RAW'
        value,
        adProviderSpecificTag,
    }: SpliceInfoConstructorProperties) {
        utils.PARAMCHECK(type);
        utils.CONDITIONALPARAMCHECK([type === 'OUT', duration]);
        utils.CONDITIONALPARAMCHECK([type === 'RAW', tagName]);
        this.type = type;
        this.duration = duration;
        this.tagName = tagName;
        this.value = value;
        this.adProviderSpecificTag = adProviderSpecificTag;
    }
}

export default SpliceInfo;
