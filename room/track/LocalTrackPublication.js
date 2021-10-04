"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TrackPublication_1 = __importDefault(require("./TrackPublication"));
class LocalTrackPublication extends TrackPublication_1.default {
    constructor(kind, ti, track) {
        super(kind, ti.sid, ti.name);
        this.updateInfo(ti);
        this.setTrack(track);
    }
    get isMuted() {
        if (this.track) {
            return this.track.isMuted;
        }
        return super.isMuted;
    }
    /**
     * Mute the track associated with this publication
     */
    mute() {
        var _a;
        (_a = this.track) === null || _a === void 0 ? void 0 : _a.mute();
    }
    /**
     * Unmute track associated with this publication
     */
    unmute() {
        var _a;
        (_a = this.track) === null || _a === void 0 ? void 0 : _a.unmute();
    }
}
exports.default = LocalTrackPublication;
//# sourceMappingURL=LocalTrackPublication.js.map