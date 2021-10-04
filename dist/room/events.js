"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackEvent = exports.EngineEvent = exports.ParticipantEvent = exports.RoomEvent = void 0;
/**
 * Events are the primary way LiveKit notifies your application of changes.
 *
 * The following are events emitted by [[Room]], listen to room events like
 *
 * ```typescript
 * room.on(RoomEvent.TrackPublished, (track, publication, participant) => {})
 * ```
 */
var RoomEvent;
(function (RoomEvent) {
    /**
     * When the connection to the server has been interrupted and it's attempting
     * to reconnect.
     */
    RoomEvent["Reconnecting"] = "reconnecting";
    /**
     * Fires when a reconnection has been successful.
     */
    RoomEvent["Reconnected"] = "reconnected";
    /**
     * When disconnected from room. This fires when room.disconnect() is called or
     * when an unrecoverable connection issue had occured
     */
    RoomEvent["Disconnected"] = "disconnected";
    /**
     * When a [[RemoteParticipant]] joins *after* the local
     * participant. It will not emit events for participants that are already
     * in the room
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantConnected"] = "participantConnected";
    /**
     * When a [[RemoteParticipant]] leaves *after* the local
     * participant has joined.
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantDisconnected"] = "participantDisconnected";
    /**
     * When a new track is published to room *after* the local
     * participant has joined. It will not fire for tracks that are already published
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackPublished"] = "trackPublished";
    /**
     * The [[LocalParticipant]] has subscribed to a new track. This event will **always**
     * fire as long as new tracks are ready for use.
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscribed"] = "trackSubscribed";
    /**
     * Could not subscribe to a track
     *
     * args: (track sid, [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    /**
     * A [[RemoteParticipant]] has unpublished a track
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnpublished"] = "trackUnpublished";
    /**
     * A subscribed track is no longer available. Clients should listen to this
     * event and ensure they detach tracks.
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    /**
     * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    RoomEvent["TrackMuted"] = "trackMuted";
    /**
     * A track that was unmuted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    RoomEvent["TrackUnmuted"] = "trackUnmuted";
    /**
     * Active speakers changed. List of speakers are ordered by their audio level.
     * loudest speakers first. This will include the LocalParticipant too.
     *
     * args: (Array<[[Participant]]>)
     */
    RoomEvent["ActiveSpeakersChanged"] = "activeSpeakersChanged";
    /**
     * Participant metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateParticipantMetadata is called to change a participant's
     * state, *all*  participants in the room will fire this event.
     *
     * args: (prevMetadata: string, [[Participant]])
     */
    RoomEvent["MetadataChanged"] = "metadataChanged";
    /**
     * Data received from another participant.
     * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
     * All participants in the room will receive the messages sent to the room.
     *
     * args (payload: Uint8Array, participant: [[Participant]], kind: [[DataPacket_Kind]])
     */
    RoomEvent["DataReceived"] = "dataReceived";
    RoomEvent["AudioPlaybackStatusChanged"] = "audioPlaybackChanged";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
var ParticipantEvent;
(function (ParticipantEvent) {
    ParticipantEvent["TrackPublished"] = "trackPublished";
    ParticipantEvent["TrackSubscribed"] = "trackSubscribed";
    ParticipantEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    ParticipantEvent["TrackUnpublished"] = "trackUnpublished";
    ParticipantEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    ParticipantEvent["TrackMuted"] = "trackMuted";
    ParticipantEvent["TrackUnmuted"] = "trackUnmuted";
    ParticipantEvent["MetadataChanged"] = "metadataChanged";
    ParticipantEvent["DataReceived"] = "dataReceived";
    ParticipantEvent["IsSpeakingChanged"] = "isSpeakingChanged";
})(ParticipantEvent = exports.ParticipantEvent || (exports.ParticipantEvent = {}));
/** @internal */
var EngineEvent;
(function (EngineEvent) {
    EngineEvent["Connected"] = "connected";
    EngineEvent["Disconnected"] = "disconnected";
    EngineEvent["Reconnecting"] = "reconnecting";
    EngineEvent["Reconnected"] = "reconnected";
    EngineEvent["ParticipantUpdate"] = "participantUpdate";
    EngineEvent["MediaTrackAdded"] = "mediaTrackAdded";
    EngineEvent["ActiveSpeakersUpdate"] = "activeSpeakersUpdate";
    EngineEvent["SpeakersChanged"] = "speakersChanged";
    EngineEvent["DataPacketReceived"] = "dataPacketReceived";
    EngineEvent["RemoteMuteChanged"] = "remoteMuteChanged";
})(EngineEvent = exports.EngineEvent || (exports.EngineEvent = {}));
var TrackEvent;
(function (TrackEvent) {
    TrackEvent["Message"] = "message";
    TrackEvent["Muted"] = "muted";
    TrackEvent["Unmuted"] = "unmuted";
    /** @internal */
    TrackEvent["UpdateSettings"] = "updateSettings";
    /** @internal */
    TrackEvent["UpdateSubscription"] = "updateSubscription";
    /** @internal */
    TrackEvent["AudioPlaybackStarted"] = "audioPlaybackStarted";
    /** @internal */
    TrackEvent["AudioPlaybackFailed"] = "audioPlaybackFailed";
})(TrackEvent = exports.TrackEvent || (exports.TrackEvent = {}));
//# sourceMappingURL=events.js.map