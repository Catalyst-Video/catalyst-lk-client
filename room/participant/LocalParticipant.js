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
const errors_1 = require("../errors");
const events_1 = require("../events");
const LocalAudioTrack_1 = __importDefault(require("../track/LocalAudioTrack"));
const LocalTrackPublication_1 = __importDefault(require("../track/LocalTrackPublication"));
const LocalVideoTrack_1 = __importDefault(require("../track/LocalVideoTrack"));
const options_1 = require("../track/options");
const Track_1 = require("../track/Track");
const Participant_1 = __importDefault(require("./Participant"));
const RemoteParticipant_1 = __importDefault(require("./RemoteParticipant"));
class LocalParticipant extends Participant_1.default {
    /** @internal */
    constructor(sid, identity, engine) {
        super(sid, identity);
        /** @internal */
        this.onTrackUnmuted = (track) => {
            this.onTrackMuted(track, false);
        };
        // when the local track changes in mute status, we'll notify server as such
        /** @internal */
        this.onTrackMuted = (track, muted) => {
            if (muted === undefined) {
                muted = true;
            }
            if (!track.sid) {
                loglevel_1.default.error('could not update mute status for unpublished track', track);
                return;
            }
            this.engine.updateMuteStatus(track.sid, muted);
        };
        this.presets169 = [
            options_1.VideoPresets.qvga,
            options_1.VideoPresets.vga,
            options_1.VideoPresets.qhd,
            options_1.VideoPresets.hd,
            options_1.VideoPresets.fhd,
        ];
        this.presets43 = [
            options_1.VideoPresets43.qvga,
            options_1.VideoPresets43.vga,
            options_1.VideoPresets43.qhd,
            options_1.VideoPresets43.hd,
            options_1.VideoPresets43.fhd,
        ];
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
        this.engine = engine;
        this.engine.on(events_1.EngineEvent.RemoteMuteChanged, (trackSid, muted) => {
            const pub = this.tracks.get(trackSid);
            if (!pub || !pub.track) {
                return;
            }
            if (muted) {
                pub.mute();
            }
            else {
                pub.unmute();
            }
        });
    }
    /**
     * Publish a new track to the room
     * @param track
     * @param options
     */
    publishTrack(track, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // convert raw media track into audio or video track
            if (track instanceof MediaStreamTrack) {
                switch (track.kind) {
                    case 'audio':
                        track = new LocalAudioTrack_1.default(track, options === null || options === void 0 ? void 0 : options.name);
                        break;
                    case 'video':
                        track = new LocalVideoTrack_1.default(track, options === null || options === void 0 ? void 0 : options.name);
                        break;
                    default:
                        throw new errors_1.TrackInvalidError(`unsupported MediaStreamTrack kind ${track.kind}`);
                }
            }
            // is it already published? if so skip
            let existingPublication;
            this.tracks.forEach((publication) => {
                if (!publication.track) {
                    return;
                }
                if (publication.track === track) {
                    existingPublication = publication;
                }
            });
            if (existingPublication)
                return existingPublication;
            // handle track actions
            track.on(events_1.TrackEvent.Muted, this.onTrackMuted);
            track.on(events_1.TrackEvent.Unmuted, this.onTrackUnmuted);
            track.mediaStreamTrack.addEventListener('ended', () => {
                this.unpublishTrack(track);
            });
            // get local track id for use during publishing
            const cid = track.mediaStreamTrack.id;
            // create track publication from track
            const req = livekit_rtc_1.AddTrackRequest.fromPartial({
                cid,
                name: track.name,
                type: Track_1.Track.kindToProto(track.kind),
                muted: track.isMuted,
            });
            if (track.dimensions) {
                req.width = track.dimensions.width;
                req.height = track.dimensions.height;
            }
            const ti = yield this.engine.addTrack(req);
            const publication = new LocalTrackPublication_1.default(track.kind, ti, track);
            track.sid = ti.sid;
            let encodings;
            // for video
            if (track.kind === Track_1.Track.Kind.Video) {
                // TODO: support react native, which doesn't expose getSettings
                const settings = track.mediaStreamTrack.getSettings();
                encodings = this.computeVideoEncodings(settings.width, settings.height, options);
            }
            else if (track.kind === Track_1.Track.Kind.Audio && (options === null || options === void 0 ? void 0 : options.audioBitrate)) {
                encodings = [
                    {
                        maxBitrate: options === null || options === void 0 ? void 0 : options.audioBitrate,
                    },
                ];
            }
            if (!this.engine.publisher) {
                throw new errors_1.UnexpectedConnectionState('publisher is closed');
            }
            loglevel_1.default.debug('publishing with encodings', encodings);
            const transceiverInit = { direction: 'sendonly' };
            if (encodings) {
                transceiverInit.sendEncodings = encodings;
            }
            const transceiver = this.engine.publisher.pc.addTransceiver(track.mediaStreamTrack, transceiverInit);
            this.engine.negotiate();
            // store RTPSender
            track.sender = transceiver.sender;
            if (track instanceof LocalVideoTrack_1.default) {
                track.startMonitor(this.engine.client);
            }
            if (options === null || options === void 0 ? void 0 : options.videoCodec) {
                this.setPreferredCodec(transceiver, track.kind, options.videoCodec);
            }
            this.addTrackPublication(publication);
            // send event for publication
            this.emit(events_1.ParticipantEvent.TrackPublished, publication);
            return publication;
        });
    }
    unpublishTrack(track) {
        // look through all published tracks to find the right ones
        const publication = this.getPublicationForTrack(track);
        loglevel_1.default.debug('unpublishTrack', 'unpublishing track', track);
        if (!publication) {
            loglevel_1.default.warn('unpublishTrack', 'track was not unpublished because no publication was found', track);
            return null;
        }
        if (track instanceof LocalAudioTrack_1.default || track instanceof LocalVideoTrack_1.default) {
            track.removeListener(events_1.TrackEvent.Muted, this.onTrackMuted);
            track.removeListener(events_1.TrackEvent.Unmuted, this.onTrackUnmuted);
        }
        track.stop();
        let mediaStreamTrack;
        if (track instanceof MediaStreamTrack) {
            mediaStreamTrack = track;
        }
        else {
            mediaStreamTrack = track.mediaStreamTrack;
        }
        if (this.engine.publisher) {
            const senders = this.engine.publisher.pc.getSenders();
            senders.forEach((sender) => {
                var _a;
                if (sender.track === mediaStreamTrack) {
                    try {
                        (_a = this.engine.publisher) === null || _a === void 0 ? void 0 : _a.pc.removeTrack(sender);
                        this.engine.negotiate();
                    }
                    catch (e) {
                        loglevel_1.default.warn('unpublishTrack', 'failed to remove track', e);
                    }
                }
            });
        }
        // remove from our maps
        this.tracks.delete(publication.trackSid);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.delete(publication.trackSid);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.delete(publication.trackSid);
                break;
            default:
                break;
        }
        return publication;
    }
    unpublishTracks(tracks) {
        const publications = [];
        tracks.forEach((track) => {
            const pub = this.unpublishTrack(track);
            if (pub) {
                publications.push(pub);
            }
        });
        return publications;
    }
    get publisherMetrics() {
        return null;
    }
    /**
     * Publish a new data payload to the room. Data will be forwarded to each
     * participant in the room if the destination argument is empty
     *
     * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
     * @param kind whether to send this as reliable or lossy.
     * For data that you need delivery guarantee (such as chat messages), use Reliable.
     * For data that should arrive as quickly as possible, but you are ok with dropped
     * packets, use Lossy.
     * @param destination the participants who will receive the message
     */
    publishData(data, kind, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const dest = [];
            if (destination !== undefined) {
                destination.forEach((val) => {
                    if (val instanceof RemoteParticipant_1.default) {
                        dest.push(val.sid);
                    }
                    else {
                        dest.push(val);
                    }
                });
            }
            const packet = {
                kind,
                user: {
                    participantSid: this.sid,
                    payload: data,
                    destinationSids: dest,
                },
            };
            yield this.engine.sendDataPacket(packet, kind);
        });
    }
    getPublicationForTrack(track) {
        let publication;
        this.tracks.forEach((pub) => {
            const localTrack = pub.track;
            if (!localTrack) {
                return;
            }
            // this looks overly complicated due to this object tree
            if (track instanceof MediaStreamTrack) {
                if (localTrack instanceof LocalAudioTrack_1.default
                    || localTrack instanceof LocalVideoTrack_1.default) {
                    if (localTrack.mediaStreamTrack === track) {
                        publication = pub;
                    }
                }
            }
            else if (track === localTrack) {
                publication = pub;
            }
        });
        return publication;
    }
    setPreferredCodec(transceiver, kind, videoCodec) {
        if (!('getCapabilities' in RTCRtpSender)) {
            return;
        }
        const cap = RTCRtpSender.getCapabilities(kind);
        if (!cap)
            return;
        const selected = cap.codecs.find((c) => {
            const codec = c.mimeType.toLowerCase();
            const matchesVideoCodec = codec === `video/${videoCodec}`;
            // for h264 codecs that have sdpFmtpLine available, use only if the
            // profile-level-id is 42e01f for cross-browser compatibility
            if (videoCodec === 'h264' && c.sdpFmtpLine) {
                return matchesVideoCodec && c.sdpFmtpLine.includes('profile-level-id=42e01f');
            }
            return matchesVideoCodec || codec === 'audio/opus';
        });
        if (selected && 'setCodecPreferences' in transceiver) {
            // @ts-ignore
            transceiver.setCodecPreferences([selected]);
        }
    }
    computeVideoEncodings(width, height, options) {
        let encodings;
        let videoEncoding = options === null || options === void 0 ? void 0 : options.videoEncoding;
        if ((!videoEncoding && !(options === null || options === void 0 ? void 0 : options.simulcast)) || !width || !height) {
            // don't set encoding when we are not simulcasting and user isn't restricting
            // encoding parameters
            return undefined;
        }
        if (!videoEncoding) {
            // find the right encoding based on width/height
            videoEncoding = this.determineAppropriateEncoding(width, height);
            loglevel_1.default.debug('using video encoding', videoEncoding);
        }
        if (options === null || options === void 0 ? void 0 : options.simulcast) {
            encodings = [
                {
                    rid: 'f',
                    maxBitrate: videoEncoding.maxBitrate,
                    /* @ts-ignore */
                    maxFramerate: videoEncoding.maxFramerate,
                },
            ];
            const presets = this.presetsForResolution(width, height);
            const midPreset = presets[1];
            const lowPreset = presets[0];
            // if resolution is high enough, we would send both h and q res..
            // otherwise only send h
            if (width >= 960) {
                encodings.push({
                    rid: 'h',
                    scaleResolutionDownBy: height / midPreset.height,
                    maxBitrate: midPreset.encoding.maxBitrate,
                    /* @ts-ignore */
                    maxFramerate: midPreset.encoding.maxFramerate,
                });
                encodings.push({
                    rid: 'q',
                    scaleResolutionDownBy: height / lowPreset.height,
                    maxBitrate: lowPreset.encoding.maxBitrate,
                    /* @ts-ignore */
                    maxFramerate: lowPreset.encoding.maxFramerate,
                });
            }
            else {
                encodings.push({
                    rid: 'h',
                    scaleResolutionDownBy: height / lowPreset.height,
                    maxBitrate: lowPreset.encoding.maxBitrate,
                    /* @ts-ignore */
                    maxFramerate: lowPreset.encoding.maxFramerate,
                });
            }
        }
        else {
            encodings = [videoEncoding];
        }
        return encodings;
    }
    determineAppropriateEncoding(width, height) {
        const presets = this.presetsForResolution(width, height);
        let { encoding } = presets[0];
        for (let i = 0; i < presets.length; i += 1) {
            const preset = presets[i];
            if (width >= preset.width && height >= preset.height) {
                encoding = preset.encoding;
            }
        }
        return encoding;
    }
    presetsForResolution(width, height) {
        const aspect = width / height;
        if (Math.abs(aspect - 16.0 / 9) < Math.abs(aspect - 4.0 / 3)) {
            return this.presets169;
        }
        return this.presets43;
    }
}
exports.default = LocalParticipant;
//# sourceMappingURL=LocalParticipant.js.map