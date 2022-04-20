import * as utils from '../utils';
import ByteRange from './ByteRange';

export interface MediaInitializationSectionProperties {
    hint: boolean;
    uri: string;
    mimeType: string;
    byterange: ByteRange;
}

export type MediaInitializationSectionOptionalConstructorProperties = Partial<
    Pick<MediaInitializationSectionProperties, 'hint' | 'mimeType' | 'byterange'>
>;
export type MediaInitializationSectionRequiredConstructorProperties = Pick<MediaInitializationSectionProperties, 'uri'>;
export type MediaInitializationSectionConstructorProperties = MediaInitializationSectionOptionalConstructorProperties &
    MediaInitializationSectionRequiredConstructorProperties;

export class MediaInitializationSection implements MediaInitializationSectionProperties {
    public hint: boolean;
    public uri: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    public mimeType: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    public byterange: ByteRange;

    constructor({
        hint = false,
        uri, // required
        mimeType,
        byterange,
    }: MediaInitializationSectionConstructorProperties) {
        utils.PARAMCHECK(uri);
        this.hint = hint;
        this.uri = uri;
        this.mimeType = mimeType;
        this.byterange = byterange;
    }
}

export default MediaInitializationSection;