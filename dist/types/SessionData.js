"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionData = void 0;
const utils = require("../utils");
class SessionData {
    constructor({ id, value, uri, language }) {
        utils.PARAMCHECK(id, value || uri);
        utils.ASSERT('SessionData cannot have both value and uri, shoud be either.', !(value && uri));
        this.id = id;
        this.value = value;
        this.uri = uri;
        this.language = language;
    }
}
exports.SessionData = SessionData;
exports.default = SessionData;
//# sourceMappingURL=SessionData.js.map