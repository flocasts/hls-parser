"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const utils = require("../utils");
class Data {
    constructor(type) {
        utils.PARAMCHECK(type);
        this.type = type;
    }
}
exports.Data = Data;
exports.default = Data;
//# sourceMappingURL=Data.js.map