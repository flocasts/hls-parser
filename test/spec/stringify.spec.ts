import fixtures from '../helpers/fixtures';
import * as utils from '../helpers/utils';
import * as HLS from '../../src/index';

HLS.setOptions({ strictMode: true });

describe('stringify', () => {
    for (const { name, m3u8, object } of fixtures) {
        test(name, () => {
            const result = HLS.stringify(object);
            expect(result).toBe(utils.stripCommentsAndEmptyLines(m3u8));
        });
    }
});
