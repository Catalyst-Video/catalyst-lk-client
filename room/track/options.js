"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPresets43 = exports.VideoPresets = exports.AudioPresets = exports.VideoPreset = void 0;
class VideoPreset {
    constructor(width, height, maxBitrate, maxFramerate) {
        this.width = width;
        this.height = height;
        this.encoding = {
            maxBitrate,
            maxFramerate,
        };
    }
    get resolution() {
        return {
            width: { ideal: this.width },
            height: { ideal: this.height },
            frameRate: {
                ideal: this.encoding.maxFramerate,
            },
        };
    }
}
exports.VideoPreset = VideoPreset;
var AudioPresets;
(function (AudioPresets) {
    AudioPresets.telephone = {
        maxBitrate: 12000,
    };
    AudioPresets.speech = {
        maxBitrate: 20000,
    };
    AudioPresets.music = {
        maxBitrate: 32000,
    };
})(AudioPresets = exports.AudioPresets || (exports.AudioPresets = {}));
/**
 * Sane presets for video resolution/encoding
 */
exports.VideoPresets = {
    qvga: new VideoPreset(320, 180, 125000, 15),
    vga: new VideoPreset(640, 360, 400000, 30),
    qhd: new VideoPreset(960, 540, 800000, 30),
    hd: new VideoPreset(1280, 720, 2500000, 30),
    fhd: new VideoPreset(1920, 1080, 4000000, 30),
};
/**
 * Four by three presets
 */
exports.VideoPresets43 = {
    qvga: new VideoPreset(240, 180, 100000, 15),
    vga: new VideoPreset(480, 360, 320000, 30),
    qhd: new VideoPreset(720, 540, 640000, 30),
    hd: new VideoPreset(960, 720, 2000000, 30),
    fhd: new VideoPreset(1440, 1080, 3200000, 30),
};
//# sourceMappingURL=options.js.map