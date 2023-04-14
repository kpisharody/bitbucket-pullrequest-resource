import { Logger } from './logger';
import { SourceConfig, Version, ConcourseResponse, ConcourseFileSystem } from './concourse';
import { BitBucketClient } from './bitbucket';
import { Execute } from './exec';
export declare class InCommand {
    private _logger;
    private _bitBucketClient;
    private _fs;
    private _e;
    constructor(logger: Logger, bitBucketClient: BitBucketClient, fs: ConcourseFileSystem, e: Execute);
    doIt(source: SourceConfig, destination: string, version: Version): Promise<ConcourseResponse>;
}
