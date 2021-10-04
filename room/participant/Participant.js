"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const events_2 = require("../events");
const Track_1 = require("../track/Track");
class Participant extends events_1.EventEmitter {
    /** @internal */
    constructor(sid, identity) {
        super();
        /** audio level between 0-1.0, 1 being loudest, 0 being softest */
        this.audioLevel = 0;
        /** if participant is currently speaking */
        this.isSpeaking = false;
        this.sid = sid;
        this.identity = identity;
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
    }
    getTracks() {
        return Array.from(this.tracks.values());
    }
    /** when participant joined the room */
    get joinedAt() {
        if (this.participantInfo) {
            return new Date(this.participantInfo.joinedAt * 1000);
        }
        return new Date();
    }
    /** @internal */
    updateInfo(info) {
        this.identity = info.identity;
        this.sid = info.sid;
        this.setMetadata(info.metadata);
        // set this last so setMetadata can detect changes
        this.participantInfo = info;
    }
    /** @internal */
    setMetadata(md) {
        const changed = !this.participantInfo || this.participantInfo.metadata !== md;
        const prevMetadata = this.metadata;
        this.metadata = md;
        if (changed) {
            this.emit(events_2.ParticipantEvent.MetadataChanged, prevMetadata);
        }
    }
    /** @internal */
    setIsSpeaking(speaking) {
        if (speaking === this.isSpeaking) {
            return;
        }
        this.isSpeaking = speaking;
        if (speaking) {
            this.lastSpokeAt = new Date();
        }
        this.emit(events_2.ParticipantEvent.IsSpeakingChanged, speaking);
    }
    addTrackPublication(publication) {
        // forward publication driven events
        publication.on(events_2.TrackEvent.Muted, () => {
            this.emit(events_2.ParticipantEvent.TrackMuted, publication);
        });
        publication.on(events_2.TrackEvent.Unmuted, () => {
            this.emit(events_2.ParticipantEvent.TrackUnmuted, publication);
        });
        const pub = publication;
        if (pub.track) {
            pub.track.sid = publication.trackSid;
        }
        this.tracks.set(publication.trackSid, publication);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.set(publication.trackSid, publication);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.set(publication.trackSid, publication);
                break;
            default:
                break;
        }
    }
}
exports.default = Participant;
//# sourceMappingURL=Participant.js.map