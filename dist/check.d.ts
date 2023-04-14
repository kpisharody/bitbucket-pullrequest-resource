import { Logger } from './logger';
import { SourceConfig, Version } from './concourse';
import { BitBucketClient, PullRequest } from './bitbucket';
export declare class CheckCommand {
    private _logger;
    private _bitBucketClient;
    constructor(logger: Logger, bitBucketClient: BitBucketClient);
    doIt(source: SourceConfig, version: Version | undefined): Promise<PullRequest[]>;
}
