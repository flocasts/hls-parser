export interface RenditionReportProperties {
    uri: string;
    lastMSN: string;
    lastPart: string;
}
export declare type RenditionReportOptionalConstructorProperties = Partial<Pick<RenditionReportProperties, 'lastMSN' | 'lastPart'>>;
export declare type RenditionReportRequiredConstructorProperties = Pick<RenditionReportProperties, 'uri'>;
export declare class RenditionReport implements RenditionReportProperties {
    uri: string;
    lastMSN: string;
    lastPart: string;
    constructor({ uri, lastMSN, lastPart, }: {
        uri: any;
        lastMSN: any;
        lastPart: any;
    });
}
export default RenditionReport;
