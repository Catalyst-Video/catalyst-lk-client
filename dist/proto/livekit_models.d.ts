import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "livekit";
export declare enum TrackType {
    AUDIO = 0,
    VIDEO = 1,
    DATA = 2,
    UNRECOGNIZED = -1
}
export declare function trackTypeFromJSON(object: any): TrackType;
export declare function trackTypeToJSON(object: TrackType): string;
export interface Room {
    sid: string;
    name: string;
    emptyTimeout: number;
    maxParticipants: number;
    creationTime: number;
    turnPassword: string;
    enabledCodecs: Codec[];
}
export interface Codec {
    mime: string;
    fmtpLine: string;
}
export interface ParticipantInfo {
    sid: string;
    identity: string;
    state: ParticipantInfo_State;
    tracks: TrackInfo[];
    metadata: string;
    /** timestamp when participant joined room, in seconds */
    joinedAt: number;
    /** hidden participant (used for recording) */
    hidden: boolean;
}
export declare enum ParticipantInfo_State {
    /** JOINING - websocket' connected, but not offered yet */
    JOINING = 0,
    /** JOINED - server received client offer */
    JOINED = 1,
    /** ACTIVE - ICE connectivity established */
    ACTIVE = 2,
    /** DISCONNECTED - WS disconnected */
    DISCONNECTED = 3,
    UNRECOGNIZED = -1
}
export declare function participantInfo_StateFromJSON(object: any): ParticipantInfo_State;
export declare function participantInfo_StateToJSON(object: ParticipantInfo_State): string;
export interface TrackInfo {
    sid: string;
    type: TrackType;
    name: string;
    muted: boolean;
    /**
     * original width of video (unset for audio)
     * clients may receive a lower resolution version with simulcast
     */
    width: number;
    /** original height of video (unset for audio) */
    height: number;
    /** true if track is simulcasted */
    simulcast: boolean;
}
/** new DataPacket API */
export interface DataPacket {
    kind: DataPacket_Kind;
    user?: UserPacket | undefined;
    speaker?: ActiveSpeakerUpdate | undefined;
}
export declare enum DataPacket_Kind {
    RELIABLE = 0,
    LOSSY = 1,
    UNRECOGNIZED = -1
}
export declare function dataPacket_KindFromJSON(object: any): DataPacket_Kind;
export declare function dataPacket_KindToJSON(object: DataPacket_Kind): string;
export interface ActiveSpeakerUpdate {
    speakers: SpeakerInfo[];
}
export interface SpeakerInfo {
    sid: string;
    /** audio level, 0-1.0, 1 is loudest */
    level: number;
    /** true if speaker is currently active */
    active: boolean;
}
export interface UserPacket {
    /** participant ID of user that sent the message */
    participantSid: string;
    /** user defined payload */
    payload: Uint8Array;
    /** the ID of the participants who will receive the message (the message will be sent to all the people in the room if this variable is empty) */
    destinationSids: string[];
}
export declare const Room: {
    encode(message: Room, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Room;
    fromJSON(object: any): Room;
    toJSON(message: Room): unknown;
    fromPartial(object: DeepPartial<Room>): Room;
};
export declare const Codec: {
    encode(message: Codec, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Codec;
    fromJSON(object: any): Codec;
    toJSON(message: Codec): unknown;
    fromPartial(object: DeepPartial<Codec>): Codec;
};
export declare const ParticipantInfo: {
    encode(message: ParticipantInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): ParticipantInfo;
    fromJSON(object: any): ParticipantInfo;
    toJSON(message: ParticipantInfo): unknown;
    fromPartial(object: DeepPartial<ParticipantInfo>): ParticipantInfo;
};
export declare const TrackInfo: {
    encode(message: TrackInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): TrackInfo;
    fromJSON(object: any): TrackInfo;
    toJSON(message: TrackInfo): unknown;
    fromPartial(object: DeepPartial<TrackInfo>): TrackInfo;
};
export declare const DataPacket: {
    encode(message: DataPacket, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DataPacket;
    fromJSON(object: any): DataPacket;
    toJSON(message: DataPacket): unknown;
    fromPartial(object: DeepPartial<DataPacket>): DataPacket;
};
export declare const ActiveSpeakerUpdate: {
    encode(message: ActiveSpeakerUpdate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): ActiveSpeakerUpdate;
    fromJSON(object: any): ActiveSpeakerUpdate;
    toJSON(message: ActiveSpeakerUpdate): unknown;
    fromPartial(object: DeepPartial<ActiveSpeakerUpdate>): ActiveSpeakerUpdate;
};
export declare const SpeakerInfo: {
    encode(message: SpeakerInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): SpeakerInfo;
    fromJSON(object: any): SpeakerInfo;
    toJSON(message: SpeakerInfo): unknown;
    fromPartial(object: DeepPartial<SpeakerInfo>): SpeakerInfo;
};
export declare const UserPacket: {
    encode(message: UserPacket, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): UserPacket;
    fromJSON(object: any): UserPacket;
    toJSON(message: UserPacket): unknown;
    fromPartial(object: DeepPartial<UserPacket>): UserPacket;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
