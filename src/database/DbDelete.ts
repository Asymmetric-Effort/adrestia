import DbUpdate from "./DbUpdate";
import e from "express";
import {getRepository, Repository} from "typeorm";
import {BadRequest, InternalError} from "../http/httpExceptions";
import emitMetric from "../observability/emitMetric";

export default class DbDelete extends DbUpdate {
    public constructor() {
        super();
    }
    public async delete(tbl: any, column: string, req: e.Request): Promise<number> {
        const repo: Repository<typeof tbl> = getRepository(tbl);
        if (!this.hasColumn(req.body,column)){
            throw new Error(`missing key(${column}): ${JSON.stringify(req.body)}`);
        }
        if (column in req.body) {
            const repo: Repository<(typeof tbl)> = getRepository(tbl);
            const key = req.body[column];
            return await repo.delete({key})
                .then((r) => {
                    emitMetric('application.database', r.affected, ['operation:delete', 'status:ok']);
                    this.invalidateCache();
                    return r.affected;
                })
                .catch((e) => {
                    emitMetric('application.database', 0, ['operation:delete', 'status:ok', `error:${e}`]);
                    throw new InternalError(e);
                });
        } else {
            throw new BadRequest(`missing key(${column}): ${JSON.stringify(req.body)}`);
        }
        return 0;
    }
}