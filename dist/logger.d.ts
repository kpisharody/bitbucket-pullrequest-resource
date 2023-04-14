export declare class Logger {
    private _logPath;
    private _outPath;
    private _logLevel;
    constructor();
    setLogLevel(logLevel: string | undefined): void;
    debug(message: string): void;
    info(message: string): void;
    error(message: string): void;
    private log;
    output(response: any): void;
}
