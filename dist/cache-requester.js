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
const axios_1 = require("axios");
const cache_1 = require("./cache");
const retry = require("async-retry");
class CacheRequester {
    constructor(logger, cachePath, username, password, fs) {
        this._logger = logger;
        this.basicAuth = { username, password };
        this.cache = new cache_1.PersistentCache(cachePath, fs);
        this._retries = 10;
    }
    retryRequest(url, method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let validStatuses;
            if (method === 'get') {
                validStatuses = [200, 304];
            }
            else if (method === 'post') {
                validStatuses = [200, 201];
            }
            else {
                throw new Error('only get and post are implemented');
            }
            const requestConfig = {
                url,
                method,
                auth: {
                    username: this.basicAuth.username,
                    password: this.basicAuth.password,
                },
                validateStatus: (status) => {
                    return validStatuses.indexOf(status) > -1;
                },
            };
            if (method === 'get') {
                const cached = this.cache.get(url);
                let cachedUrl;
                if (cached) {
                    cachedUrl = JSON.parse(cached);
                    requestConfig.headers = { 'If-None-Match': cachedUrl.etag };
                }
            }
            else if (method === 'post') {
                requestConfig.data = data;
            }
            let attempt = 0;
            const resp = yield retry((bail) => __awaiter(this, void 0, void 0, function* () {
                this._logger.debug(`CacheRequester - ${method} attempt #${attempt}`);
                attempt++;
                const theResp = yield axios_1.default(requestConfig);
                return theResp;
            }), {
                retries: this._retries,
                minTimeout: 1 * 1000,
                maxTimeout: 20 * 1000,
            });
            if (resp == null) {
                throw new Error('response is null, probably should not happen');
            }
            this._logger.debug(`CacheRequester - ${method} - resp.status: ${resp.status}`);
            if (method === 'get') {
                if (resp.status === 200) {
                    this._logger.debug(`CacheRequester: 200 from GET on ${url}`);
                    this.cache.set(url, JSON.stringify({ etag: resp.headers.etag, body: resp.data }));
                    return JSON.stringify(resp.data);
                }
                else if (resp.status === 304) {
                    this._logger.debug(`CacheRequester: 304 from GET on ${url}, using cache for response`);
                    const cachedResp = JSON.parse(this.cache.get(url));
                    return JSON.stringify(cachedResp.body);
                }
                else {
                    throw new Error(`this should not really happen, resp.status === ${resp.status}`);
                }
            }
            else if (method === 'post') {
                if (resp.status === 200) {
                    this._logger.debug(`CacheRequester: 200 from POST on ${url}`);
                    return JSON.stringify(resp.data);
                }
                else if (resp.status === 201) {
                    this._logger.debug(`CacheRequester: 201 from POST on ${url}`);
                    return JSON.stringify(resp.data);
                }
                else {
                    this._logger.debug(`CacheRequester: ${resp.status} from POST on ${url}`);
                    throw new Error(`post: resp.status === ${resp.status}`);
                }
            }
            return '';
        });
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.retryRequest(url, 'get', null);
        });
    }
    post(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.retryRequest(url, 'post', data);
        });
    }
}
exports.CacheRequester = CacheRequester;
//# sourceMappingURL=cache-requester.js.map