"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialSegment = void 0;
const Data_1 = require("./Data");
const utils = require("../utils");
class PartialSegment extends Data_1.default {
    constructor({ hint = false, uri, duration, independent, byterange, gap, }) {
        super('part');
        utils.PARAMCHECK(uri);
        this.hint = hint;
        this.uri = uri;
        this.duration = duration;
        this.independent = independent;
        this.duration = duration;
        this.byterange = byterange;
        this.gap = gap;
    }
}
exports.PartialSegment = PartialSegment;
exports.default = PartialSegment;
//# sourceMappingURL=PartialSegment.js.map