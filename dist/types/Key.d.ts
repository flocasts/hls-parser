/// <reference types="node" />
export interface KeyProperties {
    method: string;
    uri: string;
    iv: Buffer;
    format: string;
    formatVersion: string;
}
export declare type KeyOptionalConstructorProperties = Partial<Pick<KeyProperties, 'uri' | 'iv' | 'format' | 'formatVersion'>>;
export declare type KeyRequiredConstructorProperties = Pick<KeyProperties, 'method'>;
export declare type KeyConstructorProperties = KeyOptionalConstructorProperties & KeyRequiredConstructorProperties;
export declare class Key implements KeyProperties {
    method: string;
    uri: string;
    iv: Buffer;
    format: string;
    formatVersion: string;
    constructor({ method, uri, iv, format, formatVersion, }: KeyConstructorProperties);
}
export default Key;
