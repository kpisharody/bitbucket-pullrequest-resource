import { Logger } from './logger';
import { SourceConfig, Params, ConcourseResponse, ConcourseFileSystem } from './concourse';
import { BitBucketClient } from './bitbucket';
export declare class OutCommand {
    private _logger;
    private _bitBucketClient;
    private _fs;
    constructor(logger: Logger, bitBucketClient: BitBucketClient, fs: ConcourseFileSystem);
    doIt(source: SourceConfig, destination: string, params: Params): Promise<ConcourseResponse>;
}
