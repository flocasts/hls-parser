import { MatcherHintOptions } from 'jest-matcher-utils';
import deepEqual from '../common/deepEqualPredicate';
import { buildFailMessage, buildPassMessage } from '../common/buildMessages';
import { DateRange } from '../../../src/types';

export default function toEqualDateRange(received: DateRange, expected: DateRange) {
    const options: MatcherHintOptions = {
        isNot: this.isNot,
        promise: this.promise,
        comment: 'DateRange equality',
    };
    const pass = deepEqual(expected, received);
    let message: () => string;
    if (pass) {
        message = buildPassMessage(received, expected, 'toEqualDateRange', options);
    } else {
        message = buildFailMessage(received, expected, 'toEqualDateRange', 'DateRange', options);
    }
    return { pass, message };
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toEqualDateRange(received: DateRange): R;
        }
    }
}
