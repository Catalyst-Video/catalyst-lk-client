/// <reference types="node" />
import { EventEmitter } from 'events';
import { SignalClient, SignalOptions } from '../api/SignalClient';
import LocalParticipant from './participant/LocalParticipant';
import Participant from './participant/Participant';
import RemoteParticipant from './participant/RemoteParticipant';
import RTCEngine from './RTCEngine';
export declare enum RoomState {
    Disconnected = "disconnected",
    Connected = "connected",
    Reconnecting = "reconnecting"
}
/**
 * In LiveKit, a room is the logical grouping for a list of participants.
 * Participants in a room can publish tracks, and subscribe to others' tracks.
 *
 * a Room fires [[RoomEvent | RoomEvents]].
 *
 * @noInheritDoc
 */
declare class Room extends EventEmitter {
    state: RoomState;
    /** map of sid: [[RemoteParticipant]] */
    participants: Map<string, RemoteParticipant>;
    /**
     * list of participants that are actively speaking. when this changes
     * a [[RoomEvent.ActiveSpeakersChanged]] event is fired
     */
    activeSpeakers: Participant[];
    /** @internal */
    engine: RTCEngine;
    /** server assigned unique room id */
    sid: string;
    /** user assigned name, derived from JWT token */
    name: string;
    /** the current participant */
    localParticipant: LocalParticipant;
    private audioEnabled;
    private audioContext?;
    /** @internal */
    constructor(client: SignalClient, config?: RTCConfiguration);
    /** @internal */
    connect: (url: string, token: string, opts?: SignalOptions | undefined) => Promise<Room>;
    /**
     * Browsers have different policies regarding audio playback. Most requiring
     * some form of user interaction (click/tap/etc).
     * In those cases, audio will be silent until a click/tap triggering one of the following
     * - `startAudio`
     * - `getUserMedia`
     */
    startAudio(): Promise<void>;
    /**
     * Returns true if audio playback is enabled
     */
    get canPlaybackAudio(): boolean;
    /**
     * disconnects the room, emits [[RoomEvent.Disconnected]]
     */
    disconnect: () => void;
    private onTrackAdded;
    private handleDisconnect;
    private handleParticipantUpdates;
    private handleParticipantDisconnected;
    private handleActiveSpeakersUpdate;
    private handleSpeakersChanged;
    private handleDataPacket;
    private handleAudioPlaybackStarted;
    private handleAudioPlaybackFailed;
    private acquireAudioContext;
    private getOrCreateParticipant;
    /** @internal */
    emit(event: string | symbol, ...args: any[]): boolean;
}
export default Room;
