/// <reference types="node" />
export interface HlsParserOptions {
    strictMode?: boolean;
    silent?: boolean;
    allowClosedCaptionsNone?: boolean;
}
export declare function THROW(err: Error): void;
export declare function ASSERT(msg: any, ...options: unknown[]): void;
export declare function CONDITIONALASSERT(...options: [unknown, any][]): void;
export declare function PARAMCHECK(...options: unknown[]): void;
export declare function CONDITIONALPARAMCHECK(...options: [boolean, any][]): void;
export declare function INVALIDPLAYLIST(msg: string): void;
export declare function toNumber(str: string | number, radix?: number): number;
export declare function hexToByteSequence(str: string): Buffer;
export declare function byteSequenceToHex(sequence: Buffer, start?: number, end?: number): string;
export declare function splitAt(str: string, delimiter: string, index?: number): [string, string] | [string];
export declare function trim(str: string, char?: string): string;
export declare function splitByCommaWithPreservingQuotes(str: string): string[];
export declare function camelify(str: any): string;
export declare function formatDate(date: Date): string;
export declare function setOptions(newOptions?: {}): void;
export declare function getOptions(): HlsParserOptions;
