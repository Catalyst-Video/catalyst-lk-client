import { DataPacket_Kind } from '../../proto/livekit_models';
import RTCEngine from '../RTCEngine';
import LocalTrack from '../track/LocalTrack';
import LocalTrackPublication from '../track/LocalTrackPublication';
import { TrackPublishOptions } from '../track/options';
import Participant from './Participant';
import RemoteParticipant from './RemoteParticipant';
export default class LocalParticipant extends Participant {
    private engine;
    audioTracks: Map<string, LocalTrackPublication>;
    videoTracks: Map<string, LocalTrackPublication>;
    /** map of track sid => all published tracks */
    tracks: Map<string, LocalTrackPublication>;
    /** @internal */
    constructor(sid: string, identity: string, engine: RTCEngine);
    /**
     * Publish a new track to the room
     * @param track
     * @param options
     */
    publishTrack(track: LocalTrack | MediaStreamTrack, options?: TrackPublishOptions): Promise<LocalTrackPublication>;
    unpublishTrack(track: LocalTrack | MediaStreamTrack): LocalTrackPublication | null;
    unpublishTracks(tracks: LocalTrack[] | MediaStreamTrack[]): LocalTrackPublication[];
    get publisherMetrics(): any;
    /**
     * Publish a new data payload to the room. Data will be forwarded to each
     * participant in the room if the destination argument is empty
     *
     * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
     * @param kind whether to send this as reliable or lossy.
     * For data that you need delivery guarantee (such as chat messages), use Reliable.
     * For data that should arrive as quickly as possible, but you are ok with dropped
     * packets, use Lossy.
     * @param destination the participants who will receive the message
     */
    publishData(data: Uint8Array, kind: DataPacket_Kind, destination?: RemoteParticipant[] | string[]): Promise<void>;
    /** @internal */
    onTrackUnmuted: (track: LocalTrack) => void;
    /** @internal */
    onTrackMuted: (track: LocalTrack, muted?: boolean | undefined) => void;
    private getPublicationForTrack;
    private setPreferredCodec;
    private computeVideoEncodings;
    private presets169;
    private presets43;
    private determineAppropriateEncoding;
    private presetsForResolution;
}
