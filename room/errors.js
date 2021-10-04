"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishDataError = exports.UnexpectedConnectionState = exports.UnsupportedServer = exports.TrackInvalidError = exports.ConnectionError = exports.LivekitError = void 0;
class LivekitError extends Error {
    constructor(code, message) {
        super(message || 'an error has occured');
        this.code = code;
    }
}
exports.LivekitError = LivekitError;
class ConnectionError extends LivekitError {
    constructor(message) {
        super(1, message);
    }
}
exports.ConnectionError = ConnectionError;
class TrackInvalidError extends LivekitError {
    constructor(message) {
        super(20, message || 'Track is invalid');
    }
}
exports.TrackInvalidError = TrackInvalidError;
class UnsupportedServer extends LivekitError {
    constructor(message) {
        super(10, message || 'Unsupported server');
    }
}
exports.UnsupportedServer = UnsupportedServer;
class UnexpectedConnectionState extends LivekitError {
    constructor(message) {
        super(12, message || 'Unexpected connection state');
    }
}
exports.UnexpectedConnectionState = UnexpectedConnectionState;
class PublishDataError extends LivekitError {
    constructor(message) {
        super(13, message || 'Unable to publish data');
    }
}
exports.PublishDataError = PublishDataError;
//# sourceMappingURL=errors.js.map