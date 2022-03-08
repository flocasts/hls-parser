import { matcherHint, printExpected, printReceived, MatcherHintOptions } from 'jest-matcher-utils';
import { diff } from 'jest-diff';

export function buildFailMessage<T>(
    received: T,
    expected: T,
    matcherName: string,
    dataTypeName: string,
    options: MatcherHintOptions,
): () => string {
    const message =
        matcherHint(matcherName, undefined, undefined, options) +
        `\n\nExpected ${dataTypeName} values to be equal:\n` +
        diff(expected, received);

    return () => message;
}

export function buildPassMessage<T>(
    received: T,
    expected: T,
    matcherName: string,
    options: MatcherHintOptions,
): () => string {
    const message =
        matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        `Expected:\n` +
        `  ${printExpected(expected)}\n` +
        `Should not match received:\n` +
        `  ${printReceived(received)}`;

    return () => message;
}
