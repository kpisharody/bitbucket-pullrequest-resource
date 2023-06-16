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
const fs = require("fs");
const getStdin = require("get-stdin");
const commandLineArgs = require("command-line-args");
const logger_1 = require("./logger");
const bitbucket_1 = require("./bitbucket");
const check_1 = require("./check");
const in_1 = require("./in");
const out_1 = require("./out");
const exec_1 = require("./exec");
const process = require("process");
const logger = new logger_1.Logger();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const stdin = yield getStdin();
        const concourseRequest = JSON.parse(stdin);
        logger.setLogLevel(concourseRequest.source.log_level);
        const t0 = Date.now();
        logger.debug('main()');
        logger.debug(`cwd: ${process.cwd()}`);
        fs.readdirSync(process.cwd()).forEach(file => {
            logger.debug(`file: ${file}`);
        });
        const mainDefinitions = [{ name: 'command', defaultOption: true }];
        const mainOptions = commandLineArgs(mainDefinitions, {
            stopAtFirstUnknown: true,
        });
        let argv = mainOptions._unknown || [];
        const bitBucketClient = new bitbucket_1.BitBucketClient(logger, concourseRequest.source.username, concourseRequest.source.password, fs);
        const execute = new exec_1.Execute();
        logger.error('stdin: ' + stdin);
        let commandOutput;
        switch (mainOptions.command) {
            case 'check': {
                const checkCommand = new check_1.CheckCommand(logger, bitBucketClient);
                commandOutput = yield checkCommand.doIt(concourseRequest.source, concourseRequest.version);
                break;
            }
            case 'in': {
                const inDefinitions = [{ name: 'destination', defaultOption: true }];
                const inOptions = commandLineArgs(inDefinitions, {
                    argv,
                    stopAtFirstUnknown: true,
                });
                argv = inOptions._unknown || [];
                const inCommand = new in_1.InCommand(logger, bitBucketClient, fs, execute);
                process.stderr.write("Concourse check out response" + concourseRequest);
                commandOutput = yield inCommand.doIt(concourseRequest.source, inOptions.destination, concourseRequest.version);
                break;
            }
            case 'out': {
                const outDefinitions = [{ name: 'destination', defaultOption: true }];
                const outOptions = commandLineArgs(outDefinitions, {
                    argv,
                    stopAtFirstUnknown: true,
                });
                argv = outOptions._unknown || [];
                const outCommand = new out_1.OutCommand(logger, bitBucketClient, fs);
                commandOutput = yield outCommand.doIt(concourseRequest.source, outOptions.destination, concourseRequest.params);
                break;
            }
            default: {
                throw new Error('must be either check, in or out');
            }
        }
        logger.debug(`output: ${JSON.stringify(commandOutput)}`);
        logger.output(commandOutput);
        const t1 = Date.now();
        logger.debug('main took ' + (t1 - t0) + ' milliseconds.');
    });
}
main()
    .then()
    .catch(err => {
    logger.error('failed: ' + err);
    logger.error('stacktrace: ' + err.stack);
    process.exit(1);
});
//# sourceMappingURL=index.js.map