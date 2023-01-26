"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
const utils = require("../utils");
class Key {
    constructor({ method, uri, iv, format, formatVersion, }) {
        utils.PARAMCHECK(method);
        utils.CONDITIONALPARAMCHECK([method !== 'NONE', uri]);
        utils.CONDITIONALASSERT([method === 'NONE', !(uri || iv || format || formatVersion)]);
        this.method = method;
        this.uri = uri;
        this.iv = iv;
        this.format = format;
        this.formatVersion = formatVersion;
    }
}
exports.Key = Key;
exports.default = Key;
//# sourceMappingURL=Key.js.map