export declare class LivekitError extends Error {
    code: number;
    constructor(code: number, message?: string);
}
export declare class ConnectionError extends LivekitError {
    constructor(message?: string);
}
export declare class TrackInvalidError extends LivekitError {
    constructor(message?: string);
}
export declare class UnsupportedServer extends LivekitError {
    constructor(message?: string);
}
export declare class UnexpectedConnectionState extends LivekitError {
    constructor(message?: string);
}
export declare class PublishDataError extends LivekitError {
    constructor(message?: string);
}
