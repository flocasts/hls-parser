import * as utils from '../../src/utils';

describe('utils', () => {
    let consoleErrorMock: jest.Mock<typeof global.console.error>;
    let originalConsoleError;

    beforeEach(() => {
        originalConsoleError = global.console.error;
        consoleErrorMock = global.console.error = jest.fn();
        utils.setOptions({ strictMode: true });
    });

    afterEach(() => {
        global.console.error = originalConsoleError;
    });

    test('utils.THROW', () => {
        try {
            utils.THROW(new Error('abc'));
        } catch (err) {
            expect(err).toBeTruthy();
            expect(err.message).toBe('abc');
        }
    });

    test('utils.ASSERT', () => {
        utils.ASSERT('No error occurred', 1, 2, 3);
        try {
            utils.ASSERT('Error occurred', 1, 2, false);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(err.message).toBe('Error occurred : Failed at [2]');
        }
    });

    test('utils.CONDITIONALASSERT', () => {
        utils.CONDITIONALASSERT([true, 1], [true, 2], [true, 3]);
        utils.CONDITIONALASSERT([false, 0], [false, 1], [false, 2]);
        try {
            utils.CONDITIONALASSERT([false, 0], [true, 1], [true, 0]);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(err.message).toBe('Conditional Assert : Failed at [2]');
        }
    });

    test('utils.PARAMCHECK', () => {
        utils.PARAMCHECK(1, 2, 3);
        try {
            utils.PARAMCHECK(1, 2, undefined);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(err.message).toBe('Param Check : Failed at [2]');
        }
    });

    test('utils.CONDITIONALPARAMCHECK', () => {
        utils.CONDITIONALPARAMCHECK([true, 1], [true, 2], [true, 3]);
        utils.CONDITIONALPARAMCHECK([false, undefined], [false, 1], [false, 2]);
        try {
            utils.CONDITIONALPARAMCHECK([false, undefined], [true, 1], [true, undefined]);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(err.message).toBe('Conditional Param Check : Failed at [2]');
        }
    });

    test('utils.toNumber', () => {
        expect(utils.toNumber('123')).toBe(123);
        expect(utils.toNumber(123)).toBe(123);
        expect(utils.toNumber('abc')).toBe(0);
        expect(utils.toNumber('8bc')).toBe(8);
    });

    test('utils.hexToByteSequence', () => {
        expect(utils.hexToByteSequence('0x000000')).toEqual(Buffer.from([0, 0, 0]));
        expect(utils.hexToByteSequence('0xFFFFFF')).toEqual(Buffer.from([255, 255, 255]));
        expect(utils.hexToByteSequence('FFFFFF')).toEqual(Buffer.from([255, 255, 255]));
    });

    test('utils.byteSequenceToHex', () => {
        expect(utils.byteSequenceToHex(Buffer.from([0, 0, 0]))).toBe('0x000000');
        expect(utils.byteSequenceToHex(Buffer.from([255, 255, 255]))).toBe('0xFFFFFF');
        expect(utils.byteSequenceToHex(Buffer.from([255, 255, 256]))).toBe('0xFFFF00');
    });

    test('utils.tryCatch', () => {
        let result = utils.tryCatch(
            () => {
                return 1;
            },
            () => {
                return 0;
            },
        );
        expect(result).toBe(1);
        result = utils.tryCatch(
            () => {
                return JSON.parse('{{');
            },
            () => {
                return 0;
            },
        );
        expect(result).toBe(0);
        expect(() => {
            utils.tryCatch(
                () => {
                    return JSON.parse('{{');
                },
                () => {
                    return JSON.parse('}}');
                },
            );
        }).toThrow();
    });

    test('utils.splitAt', () => {
        expect(utils.splitAt('a=1', '=')).toEqual(['a', '1']);
        expect(utils.splitAt('a=1=2', '=')).toEqual(['a', '1=2']);
        expect(utils.splitAt('a=1=2=3', '=')).toEqual(['a', '1=2=3']);
        expect(utils.splitAt('a=1=2=3', '=', 0)).toEqual(['a', '1=2=3']);
        expect(utils.splitAt('a=1=2=3', '=', 1)).toEqual(['a=1', '2=3']);
        expect(utils.splitAt('a=1=2=3', '=', 2)).toEqual(['a=1=2', '3']);
        expect(utils.splitAt('a=1=2=3', '=', -1)).toEqual(['a=1=2', '3']);
    });

    test('utils.trim', () => {
        expect(utils.trim(' abc ')).toBe('abc');
        expect(utils.trim(' abc ', ' ')).toBe('abc');
        expect(utils.trim('"abc"', '"')).toBe('abc');
        expect(utils.trim('abc:', ':')).toBe('abc');
        expect(utils.trim('abc')).toBe('abc');
        expect(utils.trim(' "abc" ', '"')).toBe('abc');
    });

    test('utils.splitWithPreservingQuotes', () => {
        expect(utils.splitByCommaWithPreservingQuotes('abc=123, def="4,5,6", ghi=78=9, jkl="abc\'123\'def"')).toEqual([
            'abc=123',
            'def="4,5,6"',
            'ghi=78=9',
            'jkl="abc\'123\'def"',
        ]);
    });

    test('utls.camelify', () => {
        const props = [
            'caption',
            'Caption',
            'captioN',
            'CAPTION',
            'closed-captions',
            'closed_captions',
            'CLOSED-CAPTIONS',
        ];
        const results = [
            'caption',
            'caption',
            'caption',
            'caption',
            'closedCaptions',
            'closedCaptions',
            'closedCaptions',
        ];
        expect(props.map((p) => utils.camelify(p))).toEqual(results);
    });

    test('utils.formatDate', () => {
        const DATE = '2014-03-05T11:15:00.000Z';
        expect(utils.formatDate(new Date(DATE))).toBe(DATE);
        const LOCALDATE = '2000-01-01T08:59:59.999+09:00';
        const UTC = '1999-12-31T23:59:59.999Z';
        expect(utils.formatDate(new Date(LOCALDATE))).toBe(UTC);
    });

    test('utils.setOptions/getOptions', () => {
        const params = { a: 1, b: 'b', c: [1, 2, 3], strictMode: true };
        utils.setOptions(params);
        expect(params).toEqual(utils.getOptions());
        params.strictMode = false;
        expect(params).not.toEqual(utils.getOptions());
        expect(utils.getOptions().strictMode).toBe(true);
    });

    test('utils.THROW.strictMode', () => {
        const error = new Error('Error Message');
        utils.setOptions({ strictMode: false });
        expect(() => {
            utils.THROW(error);
        }).not.toThrow();

        utils.setOptions({ strictMode: true });

        expect(() => {
            utils.THROW(error);
        }).toThrow('Error Message');
    });

    test('utils.THROW.silent', () => {
        utils.setOptions({ strictMode: false });
        utils.THROW(new Error('Error Message'));
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);

        utils.setOptions({ silent: true });
        utils.THROW(new Error('Error Message'));
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
});
