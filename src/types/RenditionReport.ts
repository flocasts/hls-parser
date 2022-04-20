import * as utils from '../utils';

export interface RenditionReportProperties {
    uri: string;
    lastMSN: string;
    lastPart: string;
}

export type RenditionReportOptionalConstructorProperties = Partial<
    Pick<RenditionReportProperties, 'lastMSN' | 'lastPart'>
>;
export type RenditionReportRequiredConstructorProperties = Pick<RenditionReportProperties, 'uri'>;

export class RenditionReport implements RenditionReportProperties {
    public uri: string;
    public lastMSN: string;
    public lastPart: string;

    constructor({
        uri, // required
        lastMSN,
        lastPart,
    }) {
        utils.PARAMCHECK(uri);
        this.uri = uri;
        this.lastMSN = lastMSN;
        this.lastPart = lastPart;
    }
}

export default RenditionReport;
