"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Segment = void 0;
const Data_1 = require("./Data");
class Segment extends Data_1.default {
    constructor({ duration, uri, mimeType, data, title, byterange, discontinuity = false, mediaSequenceNumber = 0, discontinuitySequence = 0, key, map, programDateTime, dateRange, markers = [], parts = [], }) {
        super('segment');
        this.duration = duration;
        this.uri = uri;
        this.mimeType = mimeType;
        this.data = data;
        this.title = title;
        this.byterange = byterange;
        this.discontinuity = discontinuity;
        this.mediaSequenceNumber = mediaSequenceNumber;
        this.discontinuitySequence = discontinuitySequence;
        this.key = key || null;
        this.map = map || null;
        this.programDateTime = programDateTime;
        this.dateRange = dateRange;
        this.markers = markers;
        this.parts = parts;
    }
    get endTime() {
        if (!this.programDateTime) {
            return null;
        }
        else {
            const millis = this.programDateTime.getTime() + this.duration * 1000;
            return new Date(millis);
        }
    }
}
exports.Segment = Segment;
exports.default = Segment;
//# sourceMappingURL=Segment.js.map