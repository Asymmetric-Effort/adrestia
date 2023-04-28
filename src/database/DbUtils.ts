import Base from "./Base";
import e from "express";
import {BadRequest, InternalError} from "../exceptions/httpExceptions";

export default class DbUtils extends Base {
    protected readonly defaultLimit: number = 10;
    protected readonly defaultOffset: number = 0;
    protected readonly maxLimit: number = 1000;
    protected readonly dbCacheMs: number = 5000;

    public constructor() {
        super();
    }

    public ping(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                if(this.connection.isConnected) {
                    resolve(true);
                }else{
                    throw Error('database is not connected')
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    protected getLimit(req: e.Request): number {
        if ('limit' in req.body) {
            const limit = req.body.limit;
            if (typeof limit === "number") {
                if (limit < 1) {
                    throw new BadRequest('limit must be >=1');
                }
                if (limit >= this.maxLimit) {
                    throw new BadRequest('limit must be < 1000.  Use pagination.');
                }
                return limit
            } else {
                throw new BadRequest(`limit expects number 1-${this.maxLimit}`)
            }
        } else {
            return this.defaultLimit;
        }
    }

    protected getOffset(req: e.Request): number {
        if ('offset' in req.body) {
            const offset = req.body.offset;
            if (typeof offset === "number") {
                if (offset < 0) {
                    throw new BadRequest(`offset must be >=0 (got: ${offset})`);
                }
                if (offset >= this.maxLimit) {
                    throw new BadRequest('offset must be < 1000.  Use pagination.');
                }
                return offset;
            } else {
                throw new BadRequest('offset must be a positive number');
            }
        } else {
            return this.defaultOffset;
        }
    }

    protected getQuery(req: e.Request): object | null {
        if ('query' in req.body) {
            const query: object = {}
            const keys: string[] = Object.keys(req.query)
            if (keys.length == 0) {
                return null;
            } else {
                keys.forEach((thisColumn, i, a) => {
                    query[thisColumn] = req.query[thisColumn];
                });
                return query;
            }
        } else {
            return null;
        }
    }
}
