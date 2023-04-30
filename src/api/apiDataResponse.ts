import {Response} from "express";

export interface apiPropertyRecord {
    key: string,
    value: any,
    readonly: boolean
}

export class apiDataResponse {
    private _count: number;
    private _result: apiPropertyRecord[];
    private _error: string;

    constructor() {
        this._count = 0;
        this._result = [];
        this._error = '';
    }

    public set count(v: number) {
        this._count = v;
        this._result = [];
        this._error = '';
    }

    public update(result: apiPropertyRecord[] = [], error: string = '') {
        this._count = result.length;
        this._result = result;
        this._error = error;
    }

    public send(res: Response) {
        res.send({
            count: this._count,
            result: this._result,
            error: this._error
        })
    }
}

export class apiCountResponse {
    private _count: number;
    private _error: string;

    constructor() {
        this._count = -1;
        this._error = '';
    }

    public update(result: number, error: string = '') {
        this._count = result;
        this._error = error;
    }

    public send(res: Response) {
        res.send({
            count: this._count,
            error: this._error
        })
    }
}
