import * as utils from '../utils';

export interface KeyProperties {
    method: string;
    uri: string;
    iv: Buffer;
    format: string;
    formatVersion: string;
}

export type KeyOptionalConstructorProperties = Partial<Pick<KeyProperties, 'uri' | 'iv' | 'format' | 'formatVersion'>>;
export type KeyRequiredConstructorProperties = Pick<KeyProperties, 'method'>;
export type KeyConstructorProperties = KeyOptionalConstructorProperties & KeyRequiredConstructorProperties;

export class Key implements KeyProperties {
    public method: string;
    public uri: string;
    public iv: Buffer;
    public format: string;
    public formatVersion: string;

    constructor({
        method, // required
        uri, // required unless method=NONE
        iv,
        format,
        formatVersion,
    }: KeyConstructorProperties) {
        utils.PARAMCHECK(method);
        utils.CONDITIONALPARAMCHECK([method !== 'NONE', uri]);
        utils.CONDITIONALASSERT([method === 'NONE', !(uri || iv || format || formatVersion)]);
        this.method = method;
        this.uri = uri;
        this.iv = iv;
        this.format = format;
        this.formatVersion = formatVersion;
    }
}

export default Key;
