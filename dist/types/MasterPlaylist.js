"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterPlaylist = void 0;
const Playlist_1 = require("./Playlist");
class MasterPlaylist extends Playlist_1.default {
    constructor(params = {}) {
        params.isMasterPlaylist = true;
        super(params);
        const { variants = [], currentVariant, sessionDataList = [], sessionKeyList = [] } = params;
        this.variants = variants;
        this.currentVariant = currentVariant;
        this.sessionDataList = sessionDataList;
        this.sessionKeyList = sessionKeyList;
    }
}
exports.MasterPlaylist = MasterPlaylist;
exports.default = MasterPlaylist;
//# sourceMappingURL=MasterPlaylist.js.map