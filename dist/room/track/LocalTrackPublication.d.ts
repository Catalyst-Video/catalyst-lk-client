import { TrackInfo } from '../../proto/livekit_models';
import LocalTrack from './LocalTrack';
import { Track } from './Track';
import TrackPublication from './TrackPublication';
export default class LocalTrackPublication extends TrackPublication {
    priority?: Track.Priority;
    track?: LocalTrack;
    constructor(kind: Track.Kind, ti: TrackInfo, track?: LocalTrack);
    get isMuted(): boolean;
    /**
     * Mute the track associated with this publication
     */
    mute(): void;
    /**
     * Unmute track associated with this publication
     */
    unmute(): void;
}
