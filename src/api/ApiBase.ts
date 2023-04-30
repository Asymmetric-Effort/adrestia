import e, {Request, Response} from "express";
import {httpStatus, httpStatusText} from "../http/httpStatus";
import {Connection as DbConnection} from "typeorm";
import {ContentTypeHeader, ContentTypeJson} from "../http/headers";
import emitMetric from "../observability/emitMetric";


export interface QueryConditions {
    cache: number;
    limit: number;
    offset: number;
    where: string | object;
}


export class ApiBase {
    protected readonly defaultLimit: number = 10;
    protected readonly defaultOffset: number = 0;
    protected readonly maxLimit: number = 1000;

    protected static _useCache: boolean = true;
    protected static readonly _dbCacheDuration: number = 5000;

    protected static db: DbConnection = undefined;

    constructor(db: DbConnection) {
        if (ApiBase.db === undefined) {
            ApiBase.db = db;
        }
        this.ping().then((status) => {
            emitMetric('application.api.db', 1, [`status:db_connected`]);
        }).catch((e) => {
            emitMetric('application.api.db', 0, ['status:error', `error:${e}}`]);
        }).finally();
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /*
     * Ping allows us to check the state of the db connection.
     */
    protected ping(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (ApiBase.db.isConnected) {
                resolve(true);
            } else {
                reject('database is not connected');
            }
        });
    }

    /*
     * Define the default http route handlers.
     */

    public create(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed)
            .setHeader(ContentTypeHeader, ContentTypeJson)
            .json({
                message: httpStatusText.MethodNotAllowed
            });
    }

    public read(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed)
            .setHeader(ContentTypeHeader, ContentTypeJson)
            .json({
                message: httpStatusText.MethodNotAllowed
            });
    }


    public update(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed)
            .setHeader(ContentTypeHeader, ContentTypeJson)
            .json({
                message: httpStatusText.MethodNotAllowed
            });
    }

    public delete(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed)
            .setHeader(ContentTypeHeader, ContentTypeJson)
            .json({
                message: httpStatusText.MethodNotAllowed
            });
    }

    /*
     * Database caching / cache-invalidation logic
     */
    protected getCacheDuration(): Promise<number> {
        //If useCache is false (cache invalidated), return this state and reset to true.
        return new Promise<number>((resolve, reject) => {
            try {
                if (ApiBase._useCache) {
                    resolve(ApiBase._dbCacheDuration);
                } else {
                    ApiBase._useCache = true;
                    resolve(0);
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    protected invalidateCache() {
        ApiBase._useCache = false;
    }

    /*
     * Simple database utilities
     */
    protected getLimit(req: e.Request): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if ('limit' in req.body) {
                req.body.limit.toNumber().then(
                    (n: number) => {
                        if (n < 1) throw Error('limit must be >=1');
                        if (n > this.maxLimit) throw Error(`limit must be <=${this.maxLimit}`);
                        resolve(n);
                    }).catch((e) => {
                    reject(e)
                });
            } else {
                resolve(this.defaultLimit);
            }
        })
    }

    protected getOffset(req: e.Request): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if ('offset' in req.body) {
                req.body.offset.toNumber().then(
                    (n: number) => {
                        if (n < 0) throw Error('limit must be >=0');
                        resolve(n);
                    }).catch((e) => {
                    reject(e)
                });
            } else {
                resolve(0);
            }
        });
    }

    protected getQuery(req: e.Request): Promise<object | string> {
        return new Promise<object | string>((resolve, reject) => {
            if ('query' in req.body) {
                const query: object = {}
                const keys: string[] = Object.keys(req.query)
                if (keys.length == 0) {
                    return null;
                } else {
                    keys.forEach((thisColumn) => {
                        query[thisColumn] = req.query[thisColumn];
                    });
                    resolve(query);
                }
            } else {
                resolve("");
            }
        });
    }

    protected async getQueryConditions(req: e.Request): Promise<QueryConditions> {
        return new Promise<QueryConditions>(async (resolve, reject) => {
            try {
                const conditions: QueryConditions = {
                    cache: await this.getCacheDuration()
                        .then((r: number) => {
                            return r;
                        }).catch((e) => {
                            throw e;
                        }),
                    limit: await this.getLimit(req)
                        .then((r: number) => {
                            return r;
                        }).catch((e) => {
                            throw e;
                        }),
                    offset: await this.getOffset(req)
                        .then((r: number) => {
                            return r;
                        }).catch((e) => {
                            throw e;
                        }),
                    where: await this.getQuery(req)
                        .then((query: object | null) => {
                            return query;
                        }).catch((e) => {
                            throw e;
                        })
                };
                resolve(conditions);
            } catch (e) {
                reject(e);
            }
        })
    }
}
