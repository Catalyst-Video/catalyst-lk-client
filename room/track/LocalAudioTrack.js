"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalTrack_1 = __importDefault(require("./LocalTrack"));
const Track_1 = require("./Track");
class LocalAudioTrack extends LocalTrack_1.default {
    constructor(mediaTrack, name, constraints) {
        super(mediaTrack, Track_1.Track.Kind.Audio, name, constraints);
    }
    restartTrack(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let constraints;
            if (options) {
                const streamConstraints = LocalTrack_1.default.constraintsForOptions({ audio: options });
                if (typeof streamConstraints.audio !== 'boolean') {
                    constraints = streamConstraints.audio;
                }
            }
            yield this.restart(constraints);
        });
    }
}
exports.default = LocalAudioTrack;
//# sourceMappingURL=LocalAudioTrack.js.map