import ByteRange from './ByteRange';
export interface MediaInitializationSectionProperties {
    hint: boolean;
    uri: string;
    mimeType: string;
    byterange: ByteRange;
}
export declare type MediaInitializationSectionOptionalConstructorProperties = Partial<Pick<MediaInitializationSectionProperties, 'hint' | 'mimeType' | 'byterange'>>;
export declare type MediaInitializationSectionRequiredConstructorProperties = Pick<MediaInitializationSectionProperties, 'uri'>;
export declare type MediaInitializationSectionConstructorProperties = MediaInitializationSectionOptionalConstructorProperties & MediaInitializationSectionRequiredConstructorProperties;
export declare class MediaInitializationSection implements MediaInitializationSectionProperties {
    hint: boolean;
    uri: any;
    mimeType: any;
    byterange: ByteRange;
    constructor({ hint, uri, mimeType, byterange, }: MediaInitializationSectionConstructorProperties);
}
export default MediaInitializationSection;
