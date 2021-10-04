import 'webrtc-adapter';
import { ParticipantInfo, SpeakerInfo } from '../proto/livekit_models';
import { AddTrackRequest, JoinResponse, SignalRequest, SignalTarget, TrackPublishedResponse, UpdateSubscription, UpdateTrackSettings, VideoQuality } from '../proto/livekit_rtc';
import { Track } from '../room/track/Track';
interface ConnectOpts {
    autoSubscribe?: boolean;
    /** internal */
    reconnect?: boolean;
}
export interface SignalOptions {
    autoSubscribe?: boolean;
}
/**
 * RTCClient is the signaling layer of WebRTC, it's LiveKit's signaling protocol
 * so that it
 */
export interface SignalClient {
    join(url: string, token: string, opts?: SignalOptions): Promise<JoinResponse>;
    reconnect(url: string, token: string): Promise<void>;
    sendOffer(offer: RTCSessionDescriptionInit): void;
    sendAnswer(answer: RTCSessionDescriptionInit): void;
    sendIceCandidate(candidate: RTCIceCandidateInit, target: SignalTarget): void;
    sendMuteTrack(trackSid: string, muted: boolean): void;
    sendAddTrack(req: AddTrackRequest): void;
    sendUpdateTrackSettings(settings: UpdateTrackSettings): void;
    sendUpdateSubscription(sub: UpdateSubscription): void;
    sendSetSimulcastLayers(sid: Track.SID, layers: VideoQuality[]): void;
    sendLeave(): void;
    close(): void;
    readonly isConnected: boolean;
    onClose?: (reason: string) => void;
    onAnswer?: (sd: RTCSessionDescriptionInit) => void;
    onOffer?: (sd: RTCSessionDescriptionInit) => void;
    onTrickle?: (sd: RTCIceCandidateInit, target: SignalTarget) => void;
    onParticipantUpdate?: (updates: ParticipantInfo[]) => void;
    onLocalTrackPublished?: (res: TrackPublishedResponse) => void;
    onSpeakersChanged?: (res: SpeakerInfo[]) => void;
    onRemoteMuteChanged?: (trackSid: string, muted: boolean) => void;
    onLeave?: () => void;
}
export declare class WSSignalClient {
    isConnected: boolean;
    useJSON: boolean;
    onClose?: (reason: string) => void;
    onAnswer?: (sd: RTCSessionDescriptionInit) => void;
    onOffer?: (sd: RTCSessionDescriptionInit) => void;
    onTrickle?: (sd: RTCIceCandidateInit, target: SignalTarget) => void;
    onParticipantUpdate?: (updates: ParticipantInfo[]) => void;
    onLocalTrackPublished?: (res: TrackPublishedResponse) => void;
    onNegotiateRequested?: () => void;
    onSpeakersChanged?: (res: SpeakerInfo[]) => void;
    onRemoteMuteChanged?: (trackSid: string, muted: boolean) => void;
    onLeave?: () => void;
    ws?: WebSocket;
    constructor(useJSON?: boolean);
    join(url: string, token: string, opts?: SignalOptions): Promise<JoinResponse>;
    reconnect(url: string, token: string): Promise<void>;
    connect(url: string, token: string, opts: ConnectOpts): Promise<JoinResponse | void>;
    close(): void;
    sendOffer(offer: RTCSessionDescriptionInit): void;
    sendAnswer(answer: RTCSessionDescriptionInit): void;
    sendIceCandidate(candidate: RTCIceCandidateInit, target: SignalTarget): void;
    sendMuteTrack(trackSid: string, muted: boolean): void;
    sendAddTrack(req: AddTrackRequest): void;
    sendUpdateTrackSettings(settings: UpdateTrackSettings): void;
    sendUpdateSubscription(sub: UpdateSubscription): void;
    sendSetSimulcastLayers(sid: Track.SID, layers: VideoQuality[]): void;
    sendLeave(): void;
    sendRequest(req: SignalRequest): void;
    private handleSignalResponse;
    private handleWSError;
}
export {};
