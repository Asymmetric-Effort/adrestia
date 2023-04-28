import DbCreate from "./DbCreate";
import e from "express";
import {getRepository, Repository} from "typeorm";
import {isNull} from "util";
import emitMetric from "../observability/emitMetric";

export default class DbRead extends DbCreate {
    public constructor() {
        super();
    }


    public async read(tbl: any, req: e.Request): Promise<object[]> {
        let result: object[] = []
        const repo: Repository<(typeof tbl)> = getRepository(tbl);
        const query = this.getQuery(req);
        const conditions = {
            cache: this.dbCacheMs,
            limit: this.getLimit(req),
            offset: this.getOffset(req),
        }
        if (!isNull(query)) {
            conditions["where"] = query;
        }
        await repo.find(conditions).then((r): void => {
            result = r;
            emitMetric('application.database',r.length,['operation:read','status:ok']);
        }).catch((e) => {
            result = [];
            emitMetric('application.database',0,['operation:read','status:ok',`error:${e}`]);
        });
        return result;
    }
}