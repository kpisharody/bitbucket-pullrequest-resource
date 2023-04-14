import { ConcourseFileSystem } from './concourse';
export declare class PersistentCache {
    private cache;
    private cachePath;
    private _fs;
    constructor(path: string, fs: ConcourseFileSystem);
    private parseFile;
    get(k: string): string;
    set(k: string, v: string): void;
}
