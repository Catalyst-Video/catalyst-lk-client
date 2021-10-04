/**
 * Options when publishing tracks
 */
export interface TrackPublishOptions {
    /**
     * set a track name
     */
    name?: string;
    /**
     * encoding parameters, if empty, LiveKit will automatically select an appropriate
     * encoding based on bitrate
     */
    videoEncoding?: VideoEncoding;
    /**
     * codec, defaults to vp8
     */
    videoCodec?: VideoCodec;
    /**
     * max audio bitrate, defaults to [[AudioPresets.speech]]
     */
    audioBitrate?: number;
    /**
     * use simulcast, defaults to false.
     * When using simulcast, LiveKit will publish up to three version of the stream at varying qualiti
     */
    simulcast?: boolean;
}
export interface CreateLocalTracksOptions {
    /**
     * audio track options, true to create with defaults. false if audio shouldn't be created
     * default true
     */
    audio?: boolean | CreateAudioTrackOptions;
    /**
     * video track options, true to create with defaults. false if video shouldn't be created
     * default true
     */
    video?: boolean | CreateVideoTrackOptions;
}
export interface CreateLocalTrackOptions {
    /** name of track */
    name?: string;
    /**
     * A ConstrainDOMString object specifying a device ID or an array of device
     * IDs which are acceptable and/or required.
     */
    deviceId?: ConstrainDOMString;
}
export interface CreateVideoTrackOptions extends CreateLocalTrackOptions {
    /**
     * a facing or an array of facings which are acceptable and/or required.
     * [valid options](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode)
     */
    facingMode?: ConstrainDOMString;
    resolution?: VideoResolutionConstraint;
}
export interface CreateScreenTrackOptions {
    /** name of track, defaults to "screen" */
    name?: string;
    /**
     * true to capture audio shared. browser support for audio capturing in
     * screenshare is limited: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#browser_compatibility
     */
    audio?: boolean;
    /** capture resolution, defaults to full HD */
    resolution?: VideoResolutionConstraint;
}
export interface CreateAudioTrackOptions extends CreateLocalTrackOptions {
    /**
     * specifies whether automatic gain control is preferred and/or required
     */
    autoGainControl?: ConstrainBoolean;
    /**
     * the channel count or range of channel counts which are acceptable and/or required
     */
    channelCount?: ConstrainULong;
    /**
     * whether or not echo cancellation is preferred and/or required
     */
    echoCancellation?: ConstrainBoolean;
    /**
     * the latency or range of latencies which are acceptable and/or required.
     */
    latency?: ConstrainDouble;
    /**
     * whether noise suppression is preferred and/or required.
     */
    noiseSuppression?: ConstrainBoolean;
    /**
     * the sample rate or range of sample rates which are acceptable and/or required.
     */
    sampleRate?: ConstrainULong;
    /**
     * sample size or range of sample sizes which are acceptable and/or required.
     */
    sampleSize?: ConstrainULong;
}
/**
 * example
 *
 * ```typescript
 * {
 *   width: { ideal: 960 },
 *   height: { ideal: 540 },
 *   frameRate: {
 *     ideal: 30,
 *     max: 60,
 *   },
 * }
 * ```
 */
export interface VideoResolutionConstraint {
    width: ConstrainULong;
    height: ConstrainULong;
    frameRate?: ConstrainDouble;
}
export interface VideoEncoding {
    maxBitrate: number;
    maxFramerate: number;
}
export declare class VideoPreset {
    encoding: VideoEncoding;
    width: number;
    height: number;
    constructor(width: number, height: number, maxBitrate: number, maxFramerate: number);
    get resolution(): VideoResolutionConstraint;
}
export interface AudioPreset {
    maxBitrate: number;
}
export declare type VideoCodec = 'vp8' | 'h264';
export declare namespace AudioPresets {
    const telephone: AudioPreset;
    const speech: AudioPreset;
    const music: AudioPreset;
}
/**
 * Sane presets for video resolution/encoding
 */
export declare const VideoPresets: {
    qvga: VideoPreset;
    vga: VideoPreset;
    qhd: VideoPreset;
    hd: VideoPreset;
    fhd: VideoPreset;
};
/**
 * Four by three presets
 */
export declare const VideoPresets43: {
    qvga: VideoPreset;
    vga: VideoPreset;
    qhd: VideoPreset;
    hd: VideoPreset;
    fhd: VideoPreset;
};
