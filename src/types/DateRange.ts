import * as utils from '../utils';

export interface DateRangeProperties {
    id: string;
    classId: string;
    start: Date;
    end: Date;
    duration: number;
    plannedDuration: number;
    endOnNext: boolean;
    attributes: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type DateRangeOptionalConstructorProperties = Partial<
    Pick<DateRangeProperties, 'start' | 'end' | 'duration' | 'plannedDuration' | 'endOnNext' | 'attributes' | 'classId'>
>;
export type DateRangeRequiredConstructorProperties = Pick<DateRangeProperties, 'id'>;
export type DateRangeConstructorProperties = DateRangeOptionalConstructorProperties &
    DateRangeRequiredConstructorProperties;

export class DateRange implements DateRangeProperties {
    public id: string;
    public classId: string;
    public start: Date;
    public end: Date;
    public duration: number;
    public plannedDuration: number;
    public endOnNext: boolean;
    public attributes: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

    constructor({
        id, // required
        classId, // required if endOnNext is true
        start,
        end,
        duration,
        plannedDuration,
        endOnNext,
        attributes = {},
    }: DateRangeConstructorProperties) {
        utils.PARAMCHECK(id);
        utils.CONDITIONALPARAMCHECK([endOnNext === true, classId]);
        utils.CONDITIONALASSERT(
            [end, start],
            [end, start <= end],
            [duration, duration >= 0],
            [plannedDuration, plannedDuration >= 0],
        );
        this.id = id;
        this.classId = classId;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.plannedDuration = plannedDuration;
        this.endOnNext = endOnNext;
        this.attributes = attributes;
    }
}

export default DateRange;
