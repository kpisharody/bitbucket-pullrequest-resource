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
class InCommand {
    constructor(logger, bitBucketClient, fs, e) {
        this._bitBucketClient = bitBucketClient;
        this._logger = logger;
        this._fs = fs;
        this._e = e;
    }
    doIt(source, destination, version) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.debug('InCommand.doIt(source, destination, version)');
            this._logger.debug(`InCommand.doIt() - source: ${JSON.stringify(source)}`);
            this._logger.debug(`InCommand.doIt() - destination: ${JSON.stringify(destination)}`);
            this._logger.debug(`InCommand.doIt() - version: ${JSON.stringify(version)}`);
            const pr = yield this._bitBucketClient.getPullRequest(source.project, source.repository, version.id);
            const gitPayload = {
                source: {
                    uri: source.git.uri,
                    branch: version.branch,
                    private_key: source.git.private_key,
                },
                version: {
                    ref: version.commit,
                },
            };
            const executeResult = yield this._e.e('/opt/git-resource/in', [destination], JSON.stringify(gitPayload));
            if (executeResult.code !== 0) {
                throw new Error(`git resource exited with code: ${executeResult.code}`);
            }
            this._logger.debug(`in - git resource stderr: ${executeResult.stderr}`);
            this._logger.debug(`in - git resource stdout: ${executeResult.stdout}`);
            const pullRequestInfo = {
                id: pr.id,
                description: pr.description,
                author: {
                    name: pr.author.username,
                    fullname: pr.author.display_name,
                },
                commit: version.commit,
                feature_branch: version.branch,
                title: pr.title,
                upstream_branch: pr.destination.branch.name,
                url: pr.links.html.href,
                updated_at: pr.created_on,
                concourse: {
                    version,
                },
            };
            this._fs.appendFileSync(`${destination}/.git/info/exclude`, 'pull-request-info');
            this._fs.writeFileSync(`${destination}/pull-request-info`, JSON.stringify(pullRequestInfo));
            const concourseResponse = {
                version,
                metadata: [
                    { name: 'title', value: pr.title },
                    { name: 'url', value: pr.links.html.href },
                    { name: 'author', value: pr.author.display_name },
                    { name: 'commit', value: version.commit },
                    { name: 'feature-branch', value: version.branch },
                    { name: 'upstream-branch', value: pr.destination.branch.name },
                    { name: 'pullrequest updated', value: pr.updated_on },
                ],
            };
            return concourseResponse;
        });
    }
}
exports.InCommand = InCommand;
//# sourceMappingURL=in.js.map