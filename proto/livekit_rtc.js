"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeakersChanged = exports.ICEServer = exports.LeaveRequest = exports.UpdateTrackSettings = exports.UpdateSubscription = exports.ParticipantUpdate = exports.SessionDescription = exports.TrackPublishedResponse = exports.JoinResponse = exports.SetSimulcastLayers = exports.MuteTrackRequest = exports.TrickleRequest = exports.AddTrackRequest = exports.SignalResponse = exports.SignalRequest = exports.videoQualityToJSON = exports.videoQualityFromJSON = exports.VideoQuality = exports.signalTargetToJSON = exports.signalTargetFromJSON = exports.SignalTarget = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const livekit_models_1 = require("./livekit_models");
exports.protobufPackage = "livekit";
var SignalTarget;
(function (SignalTarget) {
    SignalTarget[SignalTarget["PUBLISHER"] = 0] = "PUBLISHER";
    SignalTarget[SignalTarget["SUBSCRIBER"] = 1] = "SUBSCRIBER";
    SignalTarget[SignalTarget["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignalTarget = exports.SignalTarget || (exports.SignalTarget = {}));
function signalTargetFromJSON(object) {
    switch (object) {
        case 0:
        case "PUBLISHER":
            return SignalTarget.PUBLISHER;
        case 1:
        case "SUBSCRIBER":
            return SignalTarget.SUBSCRIBER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SignalTarget.UNRECOGNIZED;
    }
}
exports.signalTargetFromJSON = signalTargetFromJSON;
function signalTargetToJSON(object) {
    switch (object) {
        case SignalTarget.PUBLISHER:
            return "PUBLISHER";
        case SignalTarget.SUBSCRIBER:
            return "SUBSCRIBER";
        default:
            return "UNKNOWN";
    }
}
exports.signalTargetToJSON = signalTargetToJSON;
var VideoQuality;
(function (VideoQuality) {
    VideoQuality[VideoQuality["LOW"] = 0] = "LOW";
    VideoQuality[VideoQuality["MEDIUM"] = 1] = "MEDIUM";
    VideoQuality[VideoQuality["HIGH"] = 2] = "HIGH";
    VideoQuality[VideoQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VideoQuality = exports.VideoQuality || (exports.VideoQuality = {}));
function videoQualityFromJSON(object) {
    switch (object) {
        case 0:
        case "LOW":
            return VideoQuality.LOW;
        case 1:
        case "MEDIUM":
            return VideoQuality.MEDIUM;
        case 2:
        case "HIGH":
            return VideoQuality.HIGH;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VideoQuality.UNRECOGNIZED;
    }
}
exports.videoQualityFromJSON = videoQualityFromJSON;
function videoQualityToJSON(object) {
    switch (object) {
        case VideoQuality.LOW:
            return "LOW";
        case VideoQuality.MEDIUM:
            return "MEDIUM";
        case VideoQuality.HIGH:
            return "HIGH";
        default:
            return "UNKNOWN";
    }
}
exports.videoQualityToJSON = videoQualityToJSON;
const baseSignalRequest = {};
exports.SignalRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(26).fork()).ldelim();
        }
        if (message.addTrack !== undefined) {
            exports.AddTrackRequest.encode(message.addTrack, writer.uint32(34).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscription !== undefined) {
            exports.UpdateSubscription.encode(message.subscription, writer.uint32(50).fork()).ldelim();
        }
        if (message.trackSetting !== undefined) {
            exports.UpdateTrackSettings.encode(message.trackSetting, writer.uint32(58).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        if (message.simulcast !== undefined) {
            exports.SetSimulcastLayers.encode(message.simulcast, writer.uint32(74).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.addTrack = exports.AddTrackRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.subscription = exports.UpdateSubscription.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.trackSetting = exports.UpdateTrackSettings.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.simulcast = exports.SetSimulcastLayers.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromJSON(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromJSON(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromJSON(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.simulcast !== undefined && object.simulcast !== null) {
            message.simulcast = exports.SetSimulcastLayers.fromJSON(object.simulcast);
        }
        else {
            message.simulcast = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.addTrack !== undefined &&
            (obj.addTrack = message.addTrack
                ? exports.AddTrackRequest.toJSON(message.addTrack)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.subscription !== undefined &&
            (obj.subscription = message.subscription
                ? exports.UpdateSubscription.toJSON(message.subscription)
                : undefined);
        message.trackSetting !== undefined &&
            (obj.trackSetting = message.trackSetting
                ? exports.UpdateTrackSettings.toJSON(message.trackSetting)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        message.simulcast !== undefined &&
            (obj.simulcast = message.simulcast
                ? exports.SetSimulcastLayers.toJSON(message.simulcast)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromPartial(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromPartial(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromPartial(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.simulcast !== undefined && object.simulcast !== null) {
            message.simulcast = exports.SetSimulcastLayers.fromPartial(object.simulcast);
        }
        else {
            message.simulcast = undefined;
        }
        return message;
    },
};
const baseSignalResponse = {};
exports.SignalResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.join !== undefined) {
            exports.JoinResponse.encode(message.join, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(26).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(34).fork()).ldelim();
        }
        if (message.update !== undefined) {
            exports.ParticipantUpdate.encode(message.update, writer.uint32(42).fork()).ldelim();
        }
        if (message.trackPublished !== undefined) {
            exports.TrackPublishedResponse.encode(message.trackPublished, writer.uint32(50).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(74).fork()).ldelim();
        }
        if (message.speakersChanged !== undefined) {
            exports.SpeakersChanged.encode(message.speakersChanged, writer.uint32(82).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.join = exports.JoinResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.update = exports.ParticipantUpdate.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.trackPublished = exports.TrackPublishedResponse.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.speakersChanged = exports.SpeakersChanged.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromJSON(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromJSON(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromJSON(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.speakersChanged !== undefined &&
            object.speakersChanged !== null) {
            message.speakersChanged = exports.SpeakersChanged.fromJSON(object.speakersChanged);
        }
        else {
            message.speakersChanged = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.join !== undefined &&
            (obj.join = message.join ? exports.JoinResponse.toJSON(message.join) : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.update !== undefined &&
            (obj.update = message.update
                ? exports.ParticipantUpdate.toJSON(message.update)
                : undefined);
        message.trackPublished !== undefined &&
            (obj.trackPublished = message.trackPublished
                ? exports.TrackPublishedResponse.toJSON(message.trackPublished)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.speakersChanged !== undefined &&
            (obj.speakersChanged = message.speakersChanged
                ? exports.SpeakersChanged.toJSON(message.speakersChanged)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromPartial(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromPartial(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromPartial(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.speakersChanged !== undefined &&
            object.speakersChanged !== null) {
            message.speakersChanged = exports.SpeakersChanged.fromPartial(object.speakersChanged);
        }
        else {
            message.speakersChanged = undefined;
        }
        return message;
    },
};
const baseAddTrackRequest = {
    cid: "",
    name: "",
    type: 0,
    width: 0,
    height: 0,
    muted: false,
};
exports.AddTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== "") {
            writer.uint32(10).string(message.cid);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.type !== 0) {
            writer.uint32(24).int32(message.type);
        }
        if (message.width !== 0) {
            writer.uint32(32).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(40).uint32(message.height);
        }
        if (message.muted === true) {
            writer.uint32(48).bool(message.muted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAddTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.type = reader.int32();
                    break;
                case 4:
                    message.width = reader.uint32();
                    break;
                case 5:
                    message.height = reader.uint32();
                    break;
                case 6:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAddTrackRequest);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = livekit_models_1.trackTypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.name !== undefined && (obj.name = message.name);
        message.type !== undefined && (obj.type = livekit_models_1.trackTypeToJSON(message.type));
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseAddTrackRequest);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = object.cid;
        }
        else {
            message.cid = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = object.width;
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = 0;
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = object.muted;
        }
        else {
            message.muted = false;
        }
        return message;
    },
};
const baseTrickleRequest = { candidateInit: "", target: 0 };
exports.TrickleRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.candidateInit !== "") {
            writer.uint32(10).string(message.candidateInit);
        }
        if (message.target !== 0) {
            writer.uint32(16).int32(message.target);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrickleRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.candidateInit = reader.string();
                    break;
                case 2:
                    message.target = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrickleRequest);
        if (object.candidateInit !== undefined && object.candidateInit !== null) {
            message.candidateInit = String(object.candidateInit);
        }
        else {
            message.candidateInit = "";
        }
        if (object.target !== undefined && object.target !== null) {
            message.target = signalTargetFromJSON(object.target);
        }
        else {
            message.target = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.candidateInit !== undefined &&
            (obj.candidateInit = message.candidateInit);
        message.target !== undefined &&
            (obj.target = signalTargetToJSON(message.target));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseTrickleRequest);
        if (object.candidateInit !== undefined && object.candidateInit !== null) {
            message.candidateInit = object.candidateInit;
        }
        else {
            message.candidateInit = "";
        }
        if (object.target !== undefined && object.target !== null) {
            message.target = object.target;
        }
        else {
            message.target = 0;
        }
        return message;
    },
};
const baseMuteTrackRequest = { sid: "", muted: false };
exports.MuteTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.muted === true) {
            writer.uint32(16).bool(message.muted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMuteTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMuteTrackRequest);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMuteTrackRequest);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = object.sid;
        }
        else {
            message.sid = "";
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = object.muted;
        }
        else {
            message.muted = false;
        }
        return message;
    },
};
const baseSetSimulcastLayers = { trackSid: "", layers: 0 };
exports.SetSimulcastLayers = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.trackSid !== "") {
            writer.uint32(10).string(message.trackSid);
        }
        writer.uint32(18).fork();
        for (const v of message.layers) {
            writer.int32(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSetSimulcastLayers);
        message.layers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSid = reader.string();
                    break;
                case 2:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.layers.push(reader.int32());
                        }
                    }
                    else {
                        message.layers.push(reader.int32());
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSetSimulcastLayers);
        message.layers = [];
        if (object.trackSid !== undefined && object.trackSid !== null) {
            message.trackSid = String(object.trackSid);
        }
        else {
            message.trackSid = "";
        }
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(videoQualityFromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.trackSid !== undefined && (obj.trackSid = message.trackSid);
        if (message.layers) {
            obj.layers = message.layers.map((e) => videoQualityToJSON(e));
        }
        else {
            obj.layers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSetSimulcastLayers);
        message.layers = [];
        if (object.trackSid !== undefined && object.trackSid !== null) {
            message.trackSid = object.trackSid;
        }
        else {
            message.trackSid = "";
        }
        if (object.layers !== undefined && object.layers !== null) {
            for (const e of object.layers) {
                message.layers.push(e);
            }
        }
        return message;
    },
};
const baseJoinResponse = {
    serverVersion: "",
    subscriberPrimary: false,
};
exports.JoinResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        if (message.participant !== undefined) {
            livekit_models_1.ParticipantInfo.encode(message.participant, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.otherParticipants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.serverVersion !== "") {
            writer.uint32(34).string(message.serverVersion);
        }
        for (const v of message.iceServers) {
            exports.ICEServer.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscriberPrimary === true) {
            writer.uint32(48).bool(message.subscriberPrimary);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.participant = livekit_models_1.ParticipantInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.otherParticipants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.serverVersion = reader.string();
                    break;
                case 5:
                    message.iceServers.push(exports.ICEServer.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.subscriberPrimary = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromJSON(object.participant);
        }
        else {
            message.participant = undefined;
        }
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        if (object.serverVersion !== undefined && object.serverVersion !== null) {
            message.serverVersion = String(object.serverVersion);
        }
        else {
            message.serverVersion = "";
        }
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromJSON(e));
            }
        }
        if (object.subscriberPrimary !== undefined &&
            object.subscriberPrimary !== null) {
            message.subscriberPrimary = Boolean(object.subscriberPrimary);
        }
        else {
            message.subscriberPrimary = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined &&
            (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        message.participant !== undefined &&
            (obj.participant = message.participant
                ? livekit_models_1.ParticipantInfo.toJSON(message.participant)
                : undefined);
        if (message.otherParticipants) {
            obj.otherParticipants = message.otherParticipants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.otherParticipants = [];
        }
        message.serverVersion !== undefined &&
            (obj.serverVersion = message.serverVersion);
        if (message.iceServers) {
            obj.iceServers = message.iceServers.map((e) => e ? exports.ICEServer.toJSON(e) : undefined);
        }
        else {
            obj.iceServers = [];
        }
        message.subscriberPrimary !== undefined &&
            (obj.subscriberPrimary = message.subscriberPrimary);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromPartial(object.participant);
        }
        else {
            message.participant = undefined;
        }
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        if (object.serverVersion !== undefined && object.serverVersion !== null) {
            message.serverVersion = object.serverVersion;
        }
        else {
            message.serverVersion = "";
        }
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromPartial(e));
            }
        }
        if (object.subscriberPrimary !== undefined &&
            object.subscriberPrimary !== null) {
            message.subscriberPrimary = object.subscriberPrimary;
        }
        else {
            message.subscriberPrimary = false;
        }
        return message;
    },
};
const baseTrackPublishedResponse = { cid: "" };
exports.TrackPublishedResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== "") {
            writer.uint32(10).string(message.cid);
        }
        if (message.track !== undefined) {
            livekit_models_1.TrackInfo.encode(message.track, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackPublishedResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.track = livekit_models_1.TrackInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackPublishedResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = "";
        }
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromJSON(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.track !== undefined &&
            (obj.track = message.track ? livekit_models_1.TrackInfo.toJSON(message.track) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseTrackPublishedResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = object.cid;
        }
        else {
            message.cid = "";
        }
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromPartial(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
};
const baseSessionDescription = { type: "", sdp: "" };
exports.SessionDescription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.sdp !== "") {
            writer.uint32(18).string(message.sdp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSessionDescription);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSessionDescription);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.sdp !== undefined && object.sdp !== null) {
            message.sdp = String(object.sdp);
        }
        else {
            message.sdp = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.sdp !== undefined && (obj.sdp = message.sdp);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSessionDescription);
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = "";
        }
        if (object.sdp !== undefined && object.sdp !== null) {
            message.sdp = object.sdp;
        }
        else {
            message.sdp = "";
        }
        return message;
    },
};
const baseParticipantUpdate = {};
exports.ParticipantUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.participants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.participants) {
            obj.participants = message.participants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.participants = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseUpdateSubscription = { trackSids: "", subscribe: false };
exports.UpdateSubscription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.subscribe === true) {
            writer.uint32(16).bool(message.subscribe);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 2:
                    message.subscribe = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.subscribe !== undefined && object.subscribe !== null) {
            message.subscribe = Boolean(object.subscribe);
        }
        else {
            message.subscribe = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.subscribe !== undefined && (obj.subscribe = message.subscribe);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        if (object.subscribe !== undefined && object.subscribe !== null) {
            message.subscribe = object.subscribe;
        }
        else {
            message.subscribe = false;
        }
        return message;
    },
};
const baseUpdateTrackSettings = {
    trackSids: "",
    disabled: false,
    quality: 0,
};
exports.UpdateTrackSettings = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.disabled === true) {
            writer.uint32(24).bool(message.disabled);
        }
        if (message.quality !== 0) {
            writer.uint32(32).int32(message.quality);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 3:
                    message.disabled = reader.bool();
                    break;
                case 4:
                    message.quality = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.disabled !== undefined && object.disabled !== null) {
            message.disabled = Boolean(object.disabled);
        }
        else {
            message.disabled = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.disabled !== undefined && (obj.disabled = message.disabled);
        message.quality !== undefined &&
            (obj.quality = videoQualityToJSON(message.quality));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        if (object.disabled !== undefined && object.disabled !== null) {
            message.disabled = object.disabled;
        }
        else {
            message.disabled = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = object.quality;
        }
        else {
            message.quality = 0;
        }
        return message;
    },
};
const baseLeaveRequest = { canReconnect: false };
exports.LeaveRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.canReconnect === true) {
            writer.uint32(8).bool(message.canReconnect);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLeaveRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.canReconnect = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLeaveRequest);
        if (object.canReconnect !== undefined && object.canReconnect !== null) {
            message.canReconnect = Boolean(object.canReconnect);
        }
        else {
            message.canReconnect = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.canReconnect !== undefined &&
            (obj.canReconnect = message.canReconnect);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLeaveRequest);
        if (object.canReconnect !== undefined && object.canReconnect !== null) {
            message.canReconnect = object.canReconnect;
        }
        else {
            message.canReconnect = false;
        }
        return message;
    },
};
const baseICEServer = { urls: "", username: "", credential: "" };
exports.ICEServer = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.urls) {
            writer.uint32(10).string(v);
        }
        if (message.username !== "") {
            writer.uint32(18).string(message.username);
        }
        if (message.credential !== "") {
            writer.uint32(26).string(message.credential);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.urls.push(reader.string());
                    break;
                case 2:
                    message.username = reader.string();
                    break;
                case 3:
                    message.credential = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(String(e));
            }
        }
        if (object.username !== undefined && object.username !== null) {
            message.username = String(object.username);
        }
        else {
            message.username = "";
        }
        if (object.credential !== undefined && object.credential !== null) {
            message.credential = String(object.credential);
        }
        else {
            message.credential = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.urls) {
            obj.urls = message.urls.map((e) => e);
        }
        else {
            obj.urls = [];
        }
        message.username !== undefined && (obj.username = message.username);
        message.credential !== undefined && (obj.credential = message.credential);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(e);
            }
        }
        if (object.username !== undefined && object.username !== null) {
            message.username = object.username;
        }
        else {
            message.username = "";
        }
        if (object.credential !== undefined && object.credential !== null) {
            message.credential = object.credential;
        }
        else {
            message.credential = "";
        }
        return message;
    },
};
const baseSpeakersChanged = {};
exports.SpeakersChanged = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.speakers) {
            livekit_models_1.SpeakerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.speakers.push(livekit_models_1.SpeakerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(livekit_models_1.SpeakerInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.speakers) {
            obj.speakers = message.speakers.map((e) => e ? livekit_models_1.SpeakerInfo.toJSON(e) : undefined);
        }
        else {
            obj.speakers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(livekit_models_1.SpeakerInfo.fromPartial(e));
            }
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=livekit_rtc.js.map