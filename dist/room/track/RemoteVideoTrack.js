"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
const Track_1 = require("./Track");
class RemoteVideoTrack extends Track_1.Track {
    constructor(mediaTrack, sid, receiver) {
        super(mediaTrack, Track_1.Track.Kind.Video);
        // override id to parsed ID
        this.sid = sid;
        this.receiver = receiver;
    }
    /** @internal */
    setMuted(muted) {
        if (this.isMuted !== muted) {
            this.isMuted = muted;
            this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
        }
        this.attachedElements.forEach((element) => {
            // detach or attach
            if (muted) {
                Track_1.detachTrack(this.mediaStreamTrack, element);
            }
            else {
                Track_1.attachToElement(this.mediaStreamTrack, element);
            }
        });
    }
    stop() {
        super.stop();
    }
}
exports.default = RemoteVideoTrack;
//# sourceMappingURL=RemoteVideoTrack.js.map