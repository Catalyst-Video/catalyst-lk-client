import { CreateLocalTracksOptions } from './options';
import { Track } from './Track';
export default class LocalTrack extends Track {
    /** @internal */
    sender?: RTCRtpSender;
    protected constraints: MediaTrackConstraints;
    protected constructor(mediaTrack: MediaStreamTrack, kind: Track.Kind, name?: string, constraints?: MediaTrackConstraints);
    get id(): string;
    get dimensions(): Track.Dimensions | undefined;
    static constraintsForOptions(options: CreateLocalTracksOptions): MediaStreamConstraints;
    mute(): LocalTrack;
    unmute(): LocalTrack;
    protected restart(constraints?: MediaTrackConstraints): Promise<LocalTrack>;
    protected setTrackMuted(muted: boolean): void;
}
