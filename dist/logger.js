"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Logger {
    constructor() {
        this._logPath = '/tmp/bitbucket-pullrequest.log';
        this._outPath = '/tmp/bitbucket-pullrequest.out';
        this._logLevel = 'ERROR';
    }
    setLogLevel(logLevel) {
        if (logLevel == null) {
            return;
        }
        this._logLevel = logLevel;
    }
    debug(message) {
        const print = this._logLevel === 'DEBUG';
        this.log('DEBUG: ' + message, print);
    }
    info(message) {
        const print = this._logLevel === 'DEBUG' || this._logPath === 'INFO';
        this.log('INFO: ' + message, print);
    }
    error(message) {
        const print = this._logLevel === 'DEBUG' || this._logPath === 'INFO' || this._logPath === 'ERROR';
        this.log('ERROR: ' + message, print);
    }
    log(message, print) {
        fs.appendFileSync(this._logPath, message);
        fs.appendFileSync(this._logPath, '\n');
        if (print) {
            console.error(message);
        }
    }
    output(response) {
        fs.appendFileSync(this._outPath, JSON.stringify(response));
        fs.appendFileSync(this._outPath, '\n');
        console.log(JSON.stringify(response));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map