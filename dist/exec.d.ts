export interface ExecuteResult {
    code: number;
    stdout: string;
    stderr: string;
}
export declare class Execute {
    constructor();
    e(path: string, args: string[], stdin: string | null): Promise<ExecuteResult>;
}
