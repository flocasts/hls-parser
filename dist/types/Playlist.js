"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const Data_1 = require("./Data");
const utils = require("../utils");
class Playlist extends Data_1.default {
    constructor({ isMasterPlaylist, uri, version, independentSegments = false, start, source, }) {
        super('playlist');
        utils.PARAMCHECK(isMasterPlaylist);
        this.isMasterPlaylist = isMasterPlaylist;
        this.uri = uri;
        this.version = version;
        this.independentSegments = independentSegments;
        this.start = start;
        this.source = source;
    }
}
exports.Playlist = Playlist;
exports.default = Playlist;
//# sourceMappingURL=Playlist.js.map