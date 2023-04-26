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
class CheckCommand {
    constructor(logger, bitBucketClient) {
        this._bitBucketClient = bitBucketClient;
        this._logger = logger;
    }
    doIt(source, version) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.debug('CheckCommand.doIt()');
            const prs = yield this._bitBucketClient.getPullRequests(source.project, source.repository, source.limit);
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
        });
    }
}
exports.CheckCommand = CheckCommand;
//# sourceMappingURL=check.js.map