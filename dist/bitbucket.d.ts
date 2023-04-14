import { Logger } from './logger';
import { ConcourseFileSystem } from './concourse';
interface Commit {
    date: string;
}
export interface PullRequestState {
    state: string;
    key: string;
    name: string;
    description?: string;
    url: string;
}
export interface PullRequestResponse {
    id: string;
    description: string;
    author: {
        username: string;
        display_name: string;
    };
    title: string;
    links: {
        html: {
            href: string;
        };
    };
    destination: {
        branch: {
            name: string;
        };
    };
    created_on: string;
    updated_on: string;
}
interface PullRequestsResponse {
    values: [{
        id: string;
        destination: {
            branch: {
                name: string;
            };
            commit: {
                hash: string;
                links: {
                    self: {
                        href: string;
                    };
                };
            };
        };
        source: {
            branch: {
                name: string;
            };
            commit: {
                hash: string;
                links: {
                    self: {
                        href: string;
                    };
                };
            };
        };
    }];
}
export interface PullRequest {
    id: string;
    branch: string;
    commit: string;
    date: string;
}
export declare class BitBucketClient {
    private _password;
    private _username;
    private _cacheRequester;
    private _logger;
    constructor(logger: Logger, username: string, password: string, fs: ConcourseFileSystem);
    getPullRequestsResponse(project: string, repository: string, limit: number): Promise<PullRequestsResponse>;
    getPullRequests(project: string, repository: string, limit: number): Promise<PullRequest[]>;
    getPullRequest(project: string, repository: string, id: string): Promise<PullRequestResponse>;
    postBuildStatus(project: string, repository: string, commit: string, state: PullRequestState): Promise<PullRequestResponse>;
    getCommit(project: string, repository: string, commit: string): Promise<Commit>;
}
export {};
