import { ConnectOptions } from './options';
import Room from './room/Room';
import LocalAudioTrack from './room/track/LocalAudioTrack';
import LocalTrack from './room/track/LocalTrack';
import LocalVideoTrack from './room/track/LocalVideoTrack';
import { CreateAudioTrackOptions, CreateLocalTracksOptions, CreateScreenTrackOptions, CreateVideoTrackOptions } from './room/track/options';
export { version } from './version';
/**
 * Connects to a LiveKit room
 *
 * ```typescript
 * connect('wss://myhost.livekit.io', token, {
 *   // publish audio and video tracks on joining
 *   audio: true,
 *   video: {
 *     resolution: VideoPresets.hd,
 *     facingMode: {
 *       ideal: "user",
 *     }
 *   }
 * })
 * ```
 * @param url URL to LiveKit server
 * @param token AccessToken, a JWT token that includes authentication and room details
 * @param options
 */
export declare function connect(url: string, token: string, options?: ConnectOptions): Promise<Room>;
/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
 * @param options
 */
export declare function createLocalVideoTrack(options?: CreateVideoTrackOptions): Promise<LocalVideoTrack>;
export declare function createLocalAudioTrack(options?: CreateAudioTrackOptions): Promise<LocalAudioTrack>;
/**
 * Creates a screen capture tracks with getDisplayMedia().
 * A LocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
 */
export declare function createLocalScreenTracks(options?: CreateScreenTrackOptions): Promise<Array<LocalTrack>>;
/**
 * creates a local video and audio track at the same time
 * @param options
 */
export declare function createLocalTracks(options?: CreateLocalTracksOptions): Promise<Array<LocalTrack>>;
