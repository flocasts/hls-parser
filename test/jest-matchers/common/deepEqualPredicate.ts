import * as fastDeepEqual from 'fast-deep-equal/es6';

function deepEqual<T>(expected: T, received: T): boolean {
    return fastDeepEqual(expected, received);
}

export default deepEqual;
