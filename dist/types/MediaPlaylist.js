"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPlaylist = void 0;
const Playlist_1 = require("./Playlist");
class MediaPlaylist extends Playlist_1.default {
    constructor(params = {}) {
        params.isMasterPlaylist = false;
        super(params);
        const { targetDuration, mediaSequenceBase = 0, discontinuitySequenceBase = 0, endlist = false, playlistType, isIFrame, segments = [], prefetchSegments = [], lowLatencyCompatibility, partTargetDuration, renditionReports = [], skip = 0, hash, } = params;
        this.targetDuration = targetDuration;
        this.mediaSequenceBase = mediaSequenceBase;
        this.discontinuitySequenceBase = discontinuitySequenceBase;
        this.endlist = endlist;
        this.playlistType = playlistType;
        this.isIFrame = isIFrame;
        this.segments = segments;
        this.prefetchSegments = prefetchSegments;
        this.lowLatencyCompatibility = lowLatencyCompatibility;
        this.partTargetDuration = partTargetDuration;
        this.renditionReports = renditionReports;
        this.skip = skip;
        this.hash = hash;
    }
}
exports.MediaPlaylist = MediaPlaylist;
exports.default = MediaPlaylist;
//# sourceMappingURL=MediaPlaylist.js.map