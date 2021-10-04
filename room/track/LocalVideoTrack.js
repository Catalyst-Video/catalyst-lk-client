"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel_1 = __importDefault(require("loglevel"));
const livekit_rtc_1 = require("../../proto/livekit_rtc");
const stats_1 = require("../stats");
const LocalTrack_1 = __importDefault(require("./LocalTrack"));
const Track_1 = require("./Track");
// delay before attempting to upgrade
const QUALITY_UPGRADE_DELAY = 60 * 1000;
// avoid downgrading too quickly
const QUALITY_DOWNGRADE_DELAY = 5 * 1000;
const ridOrder = ['f', 'h', 'q'];
class LocalVideoTrack extends LocalTrack_1.default {
    constructor(mediaTrack, name, constraints) {
        super(mediaTrack, Track_1.Track.Kind.Video, name, constraints);
        this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return;
            }
            const stats = yield this.getSenderStats();
            const statsMap = new Map(stats.map((s) => [s.rid, s]));
            if (this.prevStats && this.isSimulcast) {
                this.checkAndUpdateSimulcast(statsMap);
            }
            this.prevStats = statsMap;
            setTimeout(() => {
                this.monitorSender();
            }, stats_1.monitorFrequency);
        });
    }
    get isSimulcast() {
        if (this.sender && this.sender.getParameters().encodings.length > 1) {
            return true;
        }
        return false;
    }
    /* internal */
    startMonitor(signalClient) {
        // only monitor simulcast streams
        if (!this.isSimulcast) {
            return;
        }
        this.signalClient = signalClient;
        setTimeout(() => {
            this.monitorSender();
        }, stats_1.monitorFrequency);
    }
    stop() {
        this.sender = undefined;
        this.mediaStreamTrack.getConstraints();
        super.stop();
    }
    mute() {
        // also stop the track, so that camera indicator is turned off
        this.mediaStreamTrack.stop();
        return super.mute();
    }
    unmute() {
        this.restartTrack();
        return super.unmute();
    }
    getSenderStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return [];
            }
            const items = [];
            const stats = yield this.sender.getStats();
            let sender;
            stats.forEach((v) => {
                if (v.type === 'track'
                    && v.trackIdentifier === this.mediaStreamTrack.id) {
                    sender = v;
                }
            });
            if (!sender) {
                return items;
            }
            // match the outbound-rtp items
            stats.forEach((v) => {
                if (v.type === 'outbound-rtp' && v.trackId === sender.id) {
                    const vs = {
                        type: 'video',
                        streamId: v.id,
                        frameHeight: v.frameHeight,
                        frameWidth: v.frameWidth,
                        firCount: v.firCount,
                        pliCount: v.pliCount,
                        nackCount: v.nackCount,
                        packetsSent: v.packetsSent,
                        framesSent: v.framesSent,
                        timestamp: v.timestamp,
                        rid: v.rid,
                        retransmittedPacketsSent: v.retransmittedPacketsSent,
                        qualityLimitationReason: v.qualityLimitationReason,
                        qualityLimitationResolutionChanges: v.qualityLimitationResolutionChanges,
                    };
                    // locate the appropriate remote-inbound-rtp item
                    const r = stats.get(v.remoteId);
                    if (r) {
                        vs.jitter = r.jitter;
                        vs.packetsLost = r.packetsLost;
                        vs.roundTripTime = r.roundTripTime;
                    }
                    items.push(vs);
                }
            });
            // sort by rid, so that f, h, q is the ordering
            items.sort((a, b) => {
                const ai = ridOrder.indexOf(a.rid);
                const bi = ridOrder.indexOf(b.rid);
                if (ai === bi) {
                    return 0;
                }
                return ai < bi ? -1 : 1;
            });
            return items;
        });
    }
    setPublishingQuality(maxQuality) {
        var _a;
        if (!this.isSimulcast || !this.encodings) {
            return;
        }
        let hasChanged = false;
        const layers = [];
        this.encodings.forEach((encoding) => {
            var _a;
            const quality = videoQualityForRid((_a = encoding.rid) !== null && _a !== void 0 ? _a : '');
            const active = quality <= maxQuality;
            if (active !== encoding.active) {
                hasChanged = true;
                encoding.active = active;
            }
            if (active) {
                layers.push(quality);
            }
        });
        if (!hasChanged || !this.sender || !this.sid) {
            return;
        }
        this.lastQualityChange = new Date().getTime();
        this.lastExplicitQualityChange = new Date().getTime();
        (_a = this.signalClient) === null || _a === void 0 ? void 0 : _a.sendSetSimulcastLayers(this.sid, layers);
        const params = this.sender.getParameters();
        params.encodings = this.encodings;
        loglevel_1.default.debug('setting publishing quality. max quality', maxQuality);
        this.sender.setParameters(params);
    }
    restartTrack(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let constraints;
            if (options) {
                const streamConstraints = LocalTrack_1.default.constraintsForOptions({ video: options });
                if (typeof streamConstraints.video !== 'boolean') {
                    constraints = streamConstraints.video;
                }
            }
            yield this.restart(constraints);
        });
    }
    checkAndUpdateSimulcast(statsMap) {
        var _a, _b;
        if (!this.sender || this.isMuted) {
            return;
        }
        const params = this.sender.getParameters();
        this.encodings = params.encodings;
        let bestEncoding;
        this.encodings.forEach((encoding) => {
            // skip inactive encodings
            if (bestEncoding === undefined && encoding.active) {
                bestEncoding = encoding;
            }
        });
        if (!bestEncoding) {
            return;
        }
        const rid = (_a = bestEncoding.rid) !== null && _a !== void 0 ? _a : '';
        const sendStats = statsMap.get(rid);
        const lastStats = (_b = this.prevStats) === null || _b === void 0 ? void 0 : _b.get(rid);
        if (!sendStats || !lastStats) {
            return;
        }
        const currentQuality = videoQualityForRid(rid);
        // adaptive simulcast algorithm notes (davidzhao)
        // Chrome (and other browsers) will automatically pause the highest layer
        // when it runs into bandwidth limitations. When that happens, it would not
        // be able to send any new frames between the two stats checks.
        //
        // We need to set that layer to inactive intentionally, because chrome tends
        // to flicker, meaning it will attempt to send that layer again shortly
        // afterwards, flip-flopping every few seconds. We want to avoid that.
        //
        // Note: even after bandwidth recovers, the flip-flopping behavior continues
        // this is possibly due to SFU-side PLI generation and imperfect bandwidth estimation
        if (sendStats.qualityLimitationResolutionChanges
            - lastStats.qualityLimitationResolutionChanges > 0) {
            this.lastQualityChange = new Date().getTime();
        }
        // log.debug('frameSent', sendStats.framesSent, 'lastSent', lastStats.framesSent,
        //   'elapsed', sendStats.timestamp - lastStats.timestamp);
        if (sendStats.framesSent - lastStats.framesSent > 0) {
            // frames have been sending ok, consider upgrading quality
            if (currentQuality === livekit_rtc_1.VideoQuality.HIGH || !this.lastQualityChange)
                return;
            const nextQuality = currentQuality + 1;
            if ((new Date()).getTime() - this.lastQualityChange < QUALITY_UPGRADE_DELAY) {
                return;
            }
            loglevel_1.default.debug('upgrading video quality to', nextQuality);
            this.setPublishingQuality(nextQuality);
            return;
        }
        // if we've upgraded or downgraded recently, give it a bit of time before
        // downgrading again
        if (this.lastExplicitQualityChange
            && ((new Date()).getTime() - this.lastExplicitQualityChange) < QUALITY_DOWNGRADE_DELAY) {
            return;
        }
        if (currentQuality === livekit_rtc_1.VideoQuality.UNRECOGNIZED) {
            return;
        }
        if (currentQuality === livekit_rtc_1.VideoQuality.LOW) {
            // already the lowest quality, nothing we can do
            return;
        }
        loglevel_1.default.debug('downgrading video quality to', currentQuality - 1);
        this.setPublishingQuality(currentQuality - 1);
    }
}
exports.default = LocalVideoTrack;
function videoQualityForRid(rid) {
    switch (rid) {
        case 'f':
            return livekit_rtc_1.VideoQuality.HIGH;
        case 'h':
            return livekit_rtc_1.VideoQuality.MEDIUM;
        case 'q':
            return livekit_rtc_1.VideoQuality.LOW;
        default:
            return livekit_rtc_1.VideoQuality.UNRECOGNIZED;
    }
}
//# sourceMappingURL=LocalVideoTrack.js.map