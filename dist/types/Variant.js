"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
const utils = require("../utils");
class Variant {
    constructor({ uri, isIFrameOnly = false, bandwidth, averageBandwidth, score, codecs, resolution, frameRate, hdcpLevel, allowedCpc, videoRange, stableVariantId, audio = [], video = [], subtitles = [], closedCaptions = [], currentRenditions = { audio: 0, video: 0, subtitles: 0, closedCaptions: 0 }, playlist, }) {
        utils.PARAMCHECK(uri, bandwidth);
        this.uri = uri;
        this.isIFrameOnly = isIFrameOnly;
        this.bandwidth = bandwidth;
        this.averageBandwidth = averageBandwidth;
        this.score = score;
        this.codecs = codecs;
        this.resolution = resolution;
        this.frameRate = frameRate;
        this.hdcpLevel = hdcpLevel;
        this.allowedCpc = allowedCpc;
        this.videoRange = videoRange;
        this.stableVariantId = stableVariantId;
        this.audio = audio;
        this.video = video;
        this.subtitles = subtitles;
        this.closedCaptions = closedCaptions;
        this.currentRenditions = currentRenditions;
        this.playlist = playlist;
    }
}
exports.Variant = Variant;
exports.default = Variant;
//# sourceMappingURL=Variant.js.map