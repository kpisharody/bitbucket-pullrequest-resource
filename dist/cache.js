"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
class PersistentCache {
    constructor(path, fs) {
        this.cachePath = path;
        this._fs = fs;
        if (!this._fs.existsSync(this.cachePath)) {
            this._fs.writeFileSync(this.cachePath, class_transformer_1.serialize(new Map()));
        }
        this.cache = this.parseFile();
    }
    parseFile() {
        const result = new Map();
        const j = JSON.parse(this._fs.readFileSync(this.cachePath).toString());
        for (const key of Object.keys(j)) {
            result.set(key, j[key]);
        }
        return result;
    }
    get(k) {
        this.cache = this.parseFile();
        const result = this.cache.get(k);
        if (result) {
            return result;
        }
        return '';
    }
    set(k, v) {
        this.cache.set(k, v);
        this._fs.writeFileSync(this.cachePath, class_transformer_1.serialize(this.cache));
    }
}
exports.PersistentCache = PersistentCache;
//# sourceMappingURL=cache.js.map