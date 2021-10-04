/// <reference types="node" />
import { EventEmitter } from 'events';
import { TrackType } from '../../proto/livekit_models';
export declare class Track extends EventEmitter {
    kind: Track.Kind;
    name: string;
    mediaStreamTrack: MediaStreamTrack;
    attachedElements: HTMLMediaElement[];
    isMuted: boolean;
    /**
     * sid is set after track is published to server, or if it's a remote track
     */
    sid?: Track.SID;
    protected constructor(mediaTrack: MediaStreamTrack, kind: Track.Kind, name?: string);
    attach(): HTMLMediaElement;
    attach(element: HTMLMediaElement): HTMLMediaElement;
    detach(): HTMLMediaElement[];
    detach(element: HTMLMediaElement): HTMLMediaElement;
    stop(): void;
    private recycleElement;
}
/** @internal */
export declare function attachToElement(track: MediaStreamTrack, element: HTMLMediaElement): void;
/** @internal */
export declare function detachTrack(track: MediaStreamTrack, element: HTMLMediaElement): void;
export declare namespace Track {
    enum Kind {
        Audio = "audio",
        Video = "video",
        Unknown = "unknown"
    }
    type SID = string;
    type Priority = 'low' | 'standard' | 'high';
    interface Dimensions {
        width: number;
        height: number;
    }
    /** @internal */
    function kindToProto(k: Kind): TrackType;
    /** @internal */
    function kindFromProto(t: TrackType): Kind | undefined;
}
