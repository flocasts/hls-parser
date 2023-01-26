export interface DateRangeProperties {
    id: string;
    classId: string;
    start: Date;
    end: Date;
    duration: number;
    plannedDuration: number;
    endOnNext: boolean;
    attributes: Record<string, any>;
}
export declare type DateRangeOptionalConstructorProperties = Partial<Pick<DateRangeProperties, 'start' | 'end' | 'duration' | 'plannedDuration' | 'endOnNext' | 'attributes' | 'classId'>>;
export declare type DateRangeRequiredConstructorProperties = Pick<DateRangeProperties, 'id'>;
export declare type DateRangeConstructorProperties = DateRangeOptionalConstructorProperties & DateRangeRequiredConstructorProperties;
export declare class DateRange implements DateRangeProperties {
    id: string;
    classId: string;
    start: Date;
    end: Date;
    duration: number;
    plannedDuration: number;
    endOnNext: boolean;
    attributes: Record<string, any>;
    constructor({ id, classId, start, end, duration, plannedDuration, endOnNext, attributes, }: DateRangeConstructorProperties);
}
export default DateRange;
