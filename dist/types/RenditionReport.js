"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenditionReport = void 0;
const utils = require("../utils");
class RenditionReport {
    constructor({ uri, lastMSN, lastPart, }) {
        utils.PARAMCHECK(uri);
        this.uri = uri;
        this.lastMSN = lastMSN;
        this.lastPart = lastPart;
    }
}
exports.RenditionReport = RenditionReport;
exports.default = RenditionReport;
//# sourceMappingURL=RenditionReport.js.map