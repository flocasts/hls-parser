"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRange = void 0;
const utils = require("../utils");
class DateRange {
    constructor({ id, classId, start, end, duration, plannedDuration, endOnNext, attributes = {}, }) {
        utils.PARAMCHECK(id);
        utils.CONDITIONALPARAMCHECK([endOnNext === true, classId]);
        utils.CONDITIONALASSERT([end, start], [end, start <= end], [duration, duration >= 0], [plannedDuration, plannedDuration >= 0]);
        this.id = id;
        this.classId = classId;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.plannedDuration = plannedDuration;
        this.endOnNext = endOnNext;
        this.attributes = attributes;
    }
}
exports.DateRange = DateRange;
exports.default = DateRange;
//# sourceMappingURL=DateRange.js.map