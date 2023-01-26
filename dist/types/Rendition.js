"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rendition = void 0;
const utils = require("../utils");
class Rendition {
    constructor({ type, uri, groupId, language, assocLanguage, name, isDefault, autoselect, forced, instreamId, characteristics, channels, playlist, }) {
        utils.PARAMCHECK(type, groupId, name);
        utils.CONDITIONALASSERT([type === 'SUBTITLES', uri], [type === 'CLOSED-CAPTIONS', instreamId], [type === 'CLOSED-CAPTIONS', !uri], [forced, type === 'SUBTITLES']);
        this.type = type;
        this.uri = uri;
        this.groupId = groupId;
        this.language = language;
        this.assocLanguage = assocLanguage;
        this.name = name;
        this.isDefault = isDefault;
        this.autoselect = autoselect;
        this.forced = forced;
        this.instreamId = instreamId;
        this.characteristics = characteristics;
        this.channels = channels;
        this.playlist = playlist;
    }
}
exports.Rendition = Rendition;
exports.default = Rendition;
//# sourceMappingURL=Rendition.js.map