"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachTrack = exports.attachToElement = exports.Track = void 0;
const events_1 = require("events");
const livekit_models_1 = require("../../proto/livekit_models");
const events_2 = require("../events");
// keep old audio elements when detached, we would re-use them since on iOS
// Safari tracks which audio elements have been "blessed" by the user.
const recycledElements = [];
class Track extends events_1.EventEmitter {
    constructor(mediaTrack, kind, name) {
        super();
        this.attachedElements = [];
        this.isMuted = false;
        this.kind = kind;
        this.mediaStreamTrack = mediaTrack;
        this.name = name || '';
    }
    attach(element) {
        let elementType = 'audio';
        if (this.kind === Track.Kind.Video) {
            elementType = 'video';
        }
        if (!element) {
            if (elementType === 'audio') {
                recycledElements.forEach((e) => {
                    if (e.parentElement === null && !element) {
                        element = e;
                    }
                });
                if (element) {
                    // remove it from pool
                    recycledElements.splice(recycledElements.indexOf(element), 1);
                }
            }
            if (!element) {
                element = document.createElement(elementType);
            }
        }
        if (element instanceof HTMLVideoElement) {
            element.playsInline = true;
            element.autoplay = true;
        }
        // already attached
        if (this.attachedElements.includes(element)) {
            return element;
        }
        attachToElement(this.mediaStreamTrack, element);
        this.attachedElements.push(element);
        if (element instanceof HTMLAudioElement) {
            // manually play audio to detect audio playback status
            element.play()
                .then(() => {
                this.emit(events_2.TrackEvent.AudioPlaybackStarted);
            })
                .catch((e) => {
                this.emit(events_2.TrackEvent.AudioPlaybackFailed, e);
            });
        }
        return element;
    }
    detach(element) {
        // detach from a single element
        if (element) {
            detachTrack(this.mediaStreamTrack, element);
            const idx = this.attachedElements.indexOf(element);
            if (idx >= 0) {
                this.attachedElements.splice(idx, 1);
                this.recycleElement(element);
            }
            return element;
        }
        const detached = [];
        this.attachedElements.forEach((elm) => {
            detachTrack(this.mediaStreamTrack, elm);
            detached.push(elm);
            this.recycleElement(elm);
        });
        // remove all tracks
        this.attachedElements = [];
        return detached;
    }
    stop() {
        this.mediaStreamTrack.stop();
    }
    recycleElement(element) {
        if (element instanceof HTMLAudioElement) {
            // we only need to re-use a single element
            let shouldCache = true;
            element.pause();
            recycledElements.forEach((e) => {
                if (!e.parentElement) {
                    shouldCache = false;
                }
            });
            if (shouldCache) {
                recycledElements.push(element);
            }
        }
    }
}
exports.Track = Track;
/** @internal */
function attachToElement(track, element) {
    let mediaStream;
    if (element.srcObject instanceof MediaStream) {
        mediaStream = element.srcObject;
    }
    else {
        mediaStream = new MediaStream();
        element.srcObject = mediaStream;
    }
    // remove existing tracks of same type from stream
    let existingTracks;
    if (track.kind === 'audio') {
        existingTracks = mediaStream.getAudioTracks();
    }
    else {
        existingTracks = mediaStream.getVideoTracks();
    }
    existingTracks.forEach((et) => {
        mediaStream.removeTrack(et);
    });
    mediaStream.addTrack(track);
}
exports.attachToElement = attachToElement;
/** @internal */
function detachTrack(track, element) {
    if (element.srcObject instanceof MediaStream) {
        const mediaStream = element.srcObject;
        mediaStream.removeTrack(track);
        element.srcObject = null;
    }
}
exports.detachTrack = detachTrack;
(function (Track) {
    let Kind;
    (function (Kind) {
        Kind["Audio"] = "audio";
        Kind["Video"] = "video";
        Kind["Unknown"] = "unknown";
    })(Kind = Track.Kind || (Track.Kind = {}));
    /** @internal */
    function kindToProto(k) {
        switch (k) {
            case Kind.Audio:
                return livekit_models_1.TrackType.AUDIO;
            case Kind.Video:
                return livekit_models_1.TrackType.VIDEO;
            default:
                return livekit_models_1.TrackType.UNRECOGNIZED;
        }
    }
    Track.kindToProto = kindToProto;
    /** @internal */
    function kindFromProto(t) {
        switch (t) {
            case livekit_models_1.TrackType.AUDIO:
                return Kind.Audio;
            case livekit_models_1.TrackType.VIDEO:
                return Kind.Video;
            default:
                return Kind.Unknown;
        }
    }
    Track.kindFromProto = kindFromProto;
})(Track = exports.Track || (exports.Track = {}));
//# sourceMappingURL=Track.js.map