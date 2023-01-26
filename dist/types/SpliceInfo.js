"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpliceInfo = void 0;
const utils = require("../utils");
class SpliceInfo {
    constructor({ type, duration, tagName, value, }) {
        utils.PARAMCHECK(type);
        utils.CONDITIONALPARAMCHECK([type === 'OUT', duration]);
        utils.CONDITIONALPARAMCHECK([type === 'RAW', tagName]);
        this.type = type;
        this.duration = duration;
        this.tagName = tagName;
        this.value = value;
    }
}
exports.SpliceInfo = SpliceInfo;
exports.default = SpliceInfo;
//# sourceMappingURL=SpliceInfo.js.map