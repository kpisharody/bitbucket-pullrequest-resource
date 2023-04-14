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
Object.defineProperty(exports, "__esModule", { value: true });
const cache_requester_1 = require("./cache-requester");
class BitBucketClient {
    constructor(logger, username, password, fs) {
        this._logger = logger;
        this._username = username;
        this._password = password;
        this._cacheRequester = new cache_requester_1.CacheRequester(this._logger, '/tmp/bitbucketclient.json', this._username, this._password, fs);
    }
    getPullRequestsResponse(project, repository, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (limit == null) {
                limit = 100;
            }
            const uri = `https://bitbucket.org/api/2.0/repositories/${project}/${repository}/pullrequests?limit=${limit}&state=OPEN`;
            const prs = yield this._cacheRequester.get(uri);
            return JSON.parse(prs);
        });
    }
    getPullRequests(project, repository, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const prs = yield this.getPullRequestsResponse(project, repository, limit);
            const result = [];
            for (const pr of prs.values) {
                const commitUrl = pr.source.commit.links.self.href.replace('https://bitbucket.org/!api', 'https://bitbucket.org/api');
                this._logger.debug(`BitBucketClient.getPullRequests() - commitUrl: ${commitUrl}`);
                const commit = JSON.parse(yield this._cacheRequester.get(commitUrl));
                result.push({
                    id: String(pr.id),
                    branch: pr.destination.branch.name,
                    commit: pr.source.commit.hash,
                    date: commit.date,
                });
            }
            return result;
        });
    }
    getPullRequest(project, repository, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `https://bitbucket.org/api/2.0/repositories/${project}/${repository}/pullrequests/${id}`;
            const pr = yield this._cacheRequester.get(uri);
            return JSON.parse(pr);
        });
    }
    postBuildStatus(project, repository, commit, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `https://bitbucket.org/api/2.0/repositories/${project}/${repository}/commit/${commit}/statuses/build`;
            const respBody = yield this._cacheRequester.post(uri, state);
            this._logger.debug(`BitBucketClient: postBuildStatus, respBody: ${respBody}`);
            return JSON.parse(respBody);
        });
    }
    getCommit(project, repository, commit) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `https://bitbucket.org/api/2.0/repositories/${project}/${repository}/commit/${commit}`;
            return JSON.parse(yield this._cacheRequester.get(uri));
        });
    }
}
exports.BitBucketClient = BitBucketClient;
//# sourceMappingURL=bitbucket.js.map