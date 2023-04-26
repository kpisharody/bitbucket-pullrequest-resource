import { Logger } from './logger';
import { ConcourseRequest, SourceConfig, Version } from './concourse';
import { BitBucketClient, PullRequest } from './bitbucket';
import getStdin from "get-stdin";

export class CheckCommand {
    private _logger: Logger;
    private _bitBucketClient: BitBucketClient;

    constructor(logger: Logger, bitBucketClient: BitBucketClient) {
        this._bitBucketClient = bitBucketClient;
        this._logger = logger;
    }

    async doIt(source: SourceConfig, version: Version | undefined): Promise<PullRequest[]> {
        this._logger.debug('CheckCommand.doIt()');
        const prs: PullRequest[] = await this._bitBucketClient.getPullRequests(
            source.project,
            source.repository,
            source.limit,
        );
        let pullRequests = prs.filter(value => value.branch == source.branch);
        if (version != null) {
            console.log("Version ");
            console.log(version.branch);
            pullRequests.push(version);
        }

        return pullRequests
            .sort((n1, n2) => {
            if (n1.date > n2.date) {
                return 1;
            }
            if (n1.date < n2.date) {
                return -1;
            }
            return 0;
        });
    }
}
