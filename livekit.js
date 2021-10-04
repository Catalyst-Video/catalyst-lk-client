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
exports.createLocalTracks = exports.createLocalScreenTracks = exports.createLocalAudioTrack = exports.createLocalVideoTrack = exports.connect = exports.version = void 0;
const loglevel_1 = __importDefault(require("loglevel"));
const SignalClient_1 = require("./api/SignalClient");
const options_1 = require("./options");
const errors_1 = require("./room/errors");
const Room_1 = __importDefault(require("./room/Room"));
const LocalAudioTrack_1 = __importDefault(require("./room/track/LocalAudioTrack"));
const LocalTrack_1 = __importDefault(require("./room/track/LocalTrack"));
const LocalVideoTrack_1 = __importDefault(require("./room/track/LocalVideoTrack"));
const options_2 = require("./room/track/options");
const Track_1 = require("./room/track/Track");
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
/**
 * Connects to a LiveKit room
 *
 * ```typescript
 * connect('wss://myhost.livekit.io', token, {
 *   // publish audio and video tracks on joining
 *   audio: true,
 *   video: {
 *     resolution: VideoPresets.hd,
 *     facingMode: {
 *       ideal: "user",
 *     }
 *   }
 * })
 * ```
 * @param url URL to LiveKit server
 * @param token AccessToken, a JWT token that includes authentication and room details
 * @param options
 */
function connect(url, token, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // set defaults
        options || (options = {});
        options.logLevel || (options.logLevel = options_1.LogLevel.info);
        if (options.audio === undefined)
            options.audio = false;
        if (options.video === undefined)
            options.video = false;
        loglevel_1.default.setLevel(options.logLevel);
        const config = (_a = options.rtcConfig) !== null && _a !== void 0 ? _a : {};
        if (options.iceServers) {
            config.iceServers = options.iceServers;
        }
        const client = new SignalClient_1.WSSignalClient();
        const room = new Room_1.default(client, config);
        // connect to room
        yield room.connect(url, token, {
            autoSubscribe: options === null || options === void 0 ? void 0 : options.autoSubscribe,
        });
        // add tracks if available
        let { tracks } = options;
        if (!tracks) {
            if (options.audio || options.video) {
                tracks = yield createLocalTracks({
                    audio: options.audio,
                    video: options.video,
                });
            }
        }
        if (tracks) {
            for (let i = 0; i < tracks.length; i += 1) {
                const track = tracks[i];
                // translate publish options
                const trackOptions = {};
                if (track.kind === Track_1.Track.Kind.Video.toString()
                    || track.kind === Track_1.Track.Kind.Video) {
                    trackOptions.videoCodec = options === null || options === void 0 ? void 0 : options.videoCodec;
                    trackOptions.videoEncoding = options === null || options === void 0 ? void 0 : options.videoEncoding;
                    trackOptions.simulcast = options === null || options === void 0 ? void 0 : options.simulcast;
                }
                else if (track.kind === Track_1.Track.Kind.Audio.toString()
                    || track.kind === Track_1.Track.Kind.Audio) {
                    trackOptions.audioBitrate = options.audioBitrate;
                }
                yield room.localParticipant.publishTrack(track, trackOptions);
            }
        }
        return room;
    });
}
exports.connect = connect;
/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
 * @param options
 */
function createLocalVideoTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: false,
            video: options,
        });
        return tracks[0];
    });
}
exports.createLocalVideoTrack = createLocalVideoTrack;
function createLocalAudioTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: options,
            video: false,
        });
        return tracks[0];
    });
}
exports.createLocalAudioTrack = createLocalAudioTrack;
/**
 * Creates a screen capture tracks with getDisplayMedia().
 * A LocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
 */
function createLocalScreenTracks(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (options === undefined) {
            options = {};
        }
        if (options.name === undefined) {
            options.name = 'screen';
        }
        if (options.resolution === undefined) {
            options.resolution = options_2.VideoPresets.fhd.resolution;
        }
        // typescript definition is missing getDisplayMedia: https://github.com/microsoft/TypeScript/issues/33232
        // @ts-ignore
        const stream = yield navigator.mediaDevices.getDisplayMedia({
            audio: (_a = options.audio) !== null && _a !== void 0 ? _a : false,
            video: {
                width: options.resolution.width,
                height: options.resolution.height,
            },
        });
        const tracks = stream.getVideoTracks();
        if (tracks.length === 0) {
            throw new errors_1.TrackInvalidError('no video track found');
        }
        const localTracks = [
            new LocalVideoTrack_1.default(tracks[0], options.name),
        ];
        if (stream.getAudioTracks().length > 0) {
            localTracks.push(new LocalAudioTrack_1.default(stream.getAudioTracks()[0], options.name));
        }
        return localTracks;
    });
}
exports.createLocalScreenTracks = createLocalScreenTracks;
/**
 * creates a local video and audio track at the same time
 * @param options
 */
function createLocalTracks(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options)
            options = {};
        if (options.audio === undefined)
            options.audio = {};
        const constraints = LocalTrack_1.default.constraintsForOptions(options);
        const stream = yield navigator.mediaDevices.getUserMedia(constraints);
        return stream.getTracks().map((mediaStreamTrack) => {
            const isAudio = mediaStreamTrack.kind === 'audio';
            let trackOptions = isAudio ? options.audio : options.video;
            if (typeof trackOptions === 'boolean' || !trackOptions) {
                trackOptions = {};
            }
            let trackConstraints;
            const conOrBool = isAudio ? constraints.audio : constraints.video;
            if (typeof conOrBool !== 'boolean') {
                trackConstraints = conOrBool;
            }
            return createLocalTrack(mediaStreamTrack, trackOptions === null || trackOptions === void 0 ? void 0 : trackOptions.name, trackConstraints);
        });
    });
}
exports.createLocalTracks = createLocalTracks;
/** @internal */
function createLocalTrack(mediaStreamTrack, name, constraints) {
    switch (mediaStreamTrack.kind) {
        case 'audio':
            return new LocalAudioTrack_1.default(mediaStreamTrack, name, constraints);
        case 'video':
            return new LocalVideoTrack_1.default(mediaStreamTrack, name, constraints);
        default:
            throw new errors_1.TrackInvalidError(`unsupported track type: ${mediaStreamTrack.kind}`);
    }
}
//# sourceMappingURL=livekit.js.map