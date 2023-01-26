"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaInitializationSection = void 0;
const utils = require("../utils");
class MediaInitializationSection {
    constructor({ hint = false, uri, mimeType, byterange, }) {
        utils.PARAMCHECK(uri);
        this.hint = hint;
        this.uri = uri;
        this.mimeType = mimeType;
        this.byterange = byterange;
    }
}
exports.MediaInitializationSection = MediaInitializationSection;
exports.default = MediaInitializationSection;
//# sourceMappingURL=MediaInitializationSection.js.map