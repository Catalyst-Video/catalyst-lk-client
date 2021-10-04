import { Track } from './Track';
export default class RemoteVideoTrack extends Track {
    /** @internal */
    receiver?: RTCRtpReceiver;
    private prevStats?;
    constructor(mediaTrack: MediaStreamTrack, sid: string, receiver?: RTCRtpReceiver);
    /** @internal */
    setMuted(muted: boolean): void;
    stop(): void;
}
