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
class OutCommand {
    constructor(logger, bitBucketClient, fs) {
        this._bitBucketClient = bitBucketClient;
        this._logger = logger;
        this._fs = fs;
    }
    doIt(source, destination, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.debug('OutCommand.doIt()');
            const buildUrl = `${process.env.ATC_EXTERNAL_URL}/builds/${process.env.BUILD_ID}`;
            const baseUrl = process.env.ATC_EXTERNAL_URL;
            const team = process.env.BUILD_TEAM_NAME;
            const pipeline = process.env.BUILD_PIPELINE_NAME;
            const job = process.env.BUILD_JOB_NAME;
            const build = process.env.BUILD_NAME;
            const jobUrl = `${baseUrl}/teams/${team}/pipelines/${pipeline}/jobs/${job}/builds/${build}`;
            const state = {
                state: params.state,
                key: params.name,
                name: `${params.name}-${process.env.BUILD_ID}`,
                url: jobUrl,
                description: params.description,
            };
            const pullRequestInfo = JSON.parse(this._fs.readFileSync(`${destination}/${params.path}/pull-request-info`).toString());
            yield this._bitBucketClient.postBuildStatus(source.project, source.repository, pullRequestInfo.commit, state);
            const concourseResponse = {
                version: pullRequestInfo.concourse.version,
                metadata: [
                    { name: 'title', value: pullRequestInfo.title },
                    { name: 'url', value: pullRequestInfo.url },
                    { name: 'author', value: pullRequestInfo.author.fullname },
                    { name: 'commit', value: pullRequestInfo.commit },
                    { name: 'feature-branch', value: pullRequestInfo.feature_branch },
                    { name: 'upstream-branch', value: pullRequestInfo.upstream_branch },
                    { name: 'pullrequest updated', value: pullRequestInfo.updated_at },
                ],
            };
            return concourseResponse;
        });
    }
}
exports.OutCommand = OutCommand;
//# sourceMappingURL=out.js.map