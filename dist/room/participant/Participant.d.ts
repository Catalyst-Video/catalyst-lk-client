/// <reference types="node" />
import { EventEmitter } from 'events';
import { ParticipantInfo } from '../../proto/livekit_models';
import TrackPublication from '../track/TrackPublication';
export declare type AudioTrackMap = {
    [key: string]: TrackPublication;
};
export declare type VideoTrackMap = {
    [key: string]: TrackPublication;
};
export default class Participant extends EventEmitter {
    protected participantInfo?: ParticipantInfo;
    audioTracks: Map<string, TrackPublication>;
    videoTracks: Map<string, TrackPublication>;
    /** map of track sid => all published tracks */
    tracks: Map<string, TrackPublication>;
    /** audio level between 0-1.0, 1 being loudest, 0 being softest */
    audioLevel: number;
    /** if participant is currently speaking */
    isSpeaking: boolean;
    /** server assigned unique id */
    sid: string;
    /** client assigned identity, encoded in JWT token */
    identity: string;
    /** client metadata, opaque to livekit */
    metadata?: string;
    lastSpokeAt?: Date | undefined;
    /** @internal */
    constructor(sid: string, identity: string);
    getTracks(): TrackPublication[];
    /** when participant joined the room */
    get joinedAt(): Date | undefined;
    /** @internal */
    updateInfo(info: ParticipantInfo): void;
    /** @internal */
    setMetadata(md: string): void;
    /** @internal */
    setIsSpeaking(speaking: boolean): void;
    protected addTrackPublication(publication: TrackPublication): void;
}
