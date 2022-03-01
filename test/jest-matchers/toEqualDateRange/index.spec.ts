import toEqualDateRange from './index';
import { DateRange, DateRangeConstructorProperties } from '../../../src/types';
import * as HLS from '../../../src';

expect.extend({ toEqualDateRange });

describe('.toEqualDateRange', () => {
    HLS.setOptions({ strictMode: true });

    const NOW = new Date();
    const EARLIER = new Date(NOW.getTime() - 10000);

    function buildDateRange(customProps?: Partial<DateRangeConstructorProperties>): DateRange {
        const defaults: DateRangeConstructorProperties = {
            id: 'expected id',
            classId: 'expected classId',
            start: EARLIER,
            end: NOW,
            duration: 300,
            plannedDuration: 250,
            endOnNext: true,
            attributes: {
                extra: true,
                bonus: 3,
            },
        };

        const options = Object.assign(defaults, customProps);
        return new DateRange(options);
    }

    let d1: DateRange;
    let d2: DateRange;

    beforeEach(() => {
        d1 = buildDateRange();
        d2 = buildDateRange();
    });

    it('should pass when objects are identical', () => {
        expect(d1).toEqualDateRange(d2);
    });

    it('should fail when ids do not match', () => {
        d2 = buildDateRange({ id: 'some other' });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when classId do not match', () => {
        d2 = buildDateRange({ classId: 'some other' });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when start dates do not match', () => {
        d2 = buildDateRange({ start: NOW });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when end dates do not match', () => {
        d2 = buildDateRange({ end: EARLIER });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when durations do not match', () => {
        d2 = buildDateRange({ duration: 5 });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when plannedDuration do not match', () => {
        d2 = buildDateRange({ plannedDuration: 6 });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when endOnNext do not match', () => {
        d2 = buildDateRange({ endOnNext: false });
        expect(d1).not.toEqualDateRange(d2);
    });

    it('should fail when attributes do not match', () => {
        d2 = buildDateRange({
            attributes: {
                newAttr: 'wow',
            },
        });
        expect(d1).not.toEqualDateRange(d2);
    });
});
