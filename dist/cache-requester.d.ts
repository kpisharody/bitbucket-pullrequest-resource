import { Logger } from './logger';
import { ConcourseFileSystem } from './concourse';
export declare class CacheRequester {
    private _logger;
    private cache;
    private basicAuth;
    private _retries;
    constructor(logger: Logger, cachePath: string, username: string, password: string, fs: ConcourseFileSystem);
    private retryRequest;
    get(url: string): Promise<string>;
    post(url: string, data: any): Promise<string>;
}
