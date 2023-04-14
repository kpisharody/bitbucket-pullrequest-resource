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
const child_process_1 = require("child_process");
const streams = require("memory-streams");
class Execute {
    constructor() { }
    e(path, args, stdin) {
        return __awaiter(this, void 0, void 0, function* () {
            const stdoutWriter = new streams.WritableStream();
            const stderrWriter = new streams.WritableStream();
            const child = child_process_1.execFile(path, args);
            if (child == null) {
                throw new Error(`could not get child process from path ${path}, and args ${args}`);
            }
            if (child.stdout == null) {
                throw new Error(`chilld.stdout is null`);
            }
            if (child.stderr == null) {
                throw new Error(`chilld.stderr is null`);
            }
            if (child.stdin == null) {
                throw new Error(`chilld.stdin is null`);
            }
            child.stdout.pipe(stdoutWriter);
            child.stderr.pipe(stderrWriter);
            if (stdin != null) {
                child.stdin.write(stdin);
                child.stdin.end();
            }
            const code = yield new Promise((resolve, reject) => {
                child.on('close', resolve);
            });
            return {
                code,
                stdout: stdoutWriter.toString(),
                stderr: stderrWriter.toString(),
            };
        });
    }
}
exports.Execute = Execute;
//# sourceMappingURL=exec.js.map