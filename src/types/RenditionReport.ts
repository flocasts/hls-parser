import * as utils from '../utils';

export interface RenditionReportProperties {
    uri: string;
    lastMSN?: number;
    lastPart?: number;
}

export type RenditionReportOptionalConstructorProperties = Partial<
    Pick<RenditionReportProperties, 'lastMSN' | 'lastPart'>
>;
export type RenditionReportRequiredConstructorProperties = Pick<RenditionReportProperties, 'uri'>;

export type RenditionReportConstructorProperties = RenditionReportOptionalConstructorProperties &
    RenditionReportRequiredConstructorProperties;

export class RenditionReport implements RenditionReportProperties {
    public uri: string;
    public lastMSN?: number;
    public lastPart?: number;

    constructor({
        uri, // required
        lastMSN,
        lastPart,
    }: RenditionReportConstructorProperties) {
        utils.PARAMCHECK(uri);
        this.uri = uri;
        this.lastMSN = lastMSN;
        this.lastPart = lastPart;
    }
}

export default RenditionReport;
