"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefetchSegment = void 0;
const Data_1 = require("./Data");
const utils = require("../utils");
class PrefetchSegment extends Data_1.default {
    constructor({ uri, discontinuity, mediaSequenceNumber = 0, discontinuitySequence = 0, key, }) {
        super('prefetch');
        utils.PARAMCHECK(uri);
        this.uri = uri;
        this.discontinuity = discontinuity;
        this.mediaSequenceNumber = mediaSequenceNumber;
        this.discontinuitySequence = discontinuitySequence;
        this.key = key;
    }
}
exports.PrefetchSegment = PrefetchSegment;
exports.default = PrefetchSegment;
//# sourceMappingURL=PrefetchSegment.js.map