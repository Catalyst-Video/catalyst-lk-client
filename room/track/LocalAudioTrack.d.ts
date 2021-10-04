import LocalTrack from './LocalTrack';
import { CreateAudioTrackOptions } from './options';
export default class LocalAudioTrack extends LocalTrack {
    sender?: RTCRtpSender;
    constructor(mediaTrack: MediaStreamTrack, name?: string, constraints?: MediaTrackConstraints);
    restartTrack(options?: CreateAudioTrackOptions): Promise<void>;
}
