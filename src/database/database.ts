import "reflect-metadata";
import {
    getRepository,
    Repository
} from "typeorm";
import {BadRequest, ServerError} from "../exceptions/httpExceptions";
import e from "express";
import {isNull} from "util";
import DbUtils from "./DbUtils";


export default class Database extends DbUtils {
    public constructor() {
        super();
    }

    public async fetch(tbl: any, req: e.Request): Promise<object[]> {
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
        console.log("Sending Query to db")
        await repo.find(conditions).then((r): void => {
            result = r;
        }).catch((e) => {
            console.log(`Db Query error: ${e}`);
            result = [];
        });
        console.log(result);
        return result;
    }

    public async create(tbl: any): Promise<any> {
        console.log("inserting record to database")
        return await this.connection.manager.save(tbl);
    }

    public async update(tbl: any): Promise<any> {
        console.log("update record in database");
        return await this.connection.manager.save(tbl);
    }

    public delete(tbl: any, column:string, req: e.Request): boolean {
        console.log("delete record in database");
        if (column in req.body) {
            const repo: Repository<(typeof tbl)> = getRepository(tbl);
            const key = req.body[column];
            repo.delete({key})
                .then((r)=>{
                    return (r.affected > 0);
                })
                .catch((e)=>{
                    console.log(`delete error: ${e}`)
                    throw new ServerError(e);
                });
        } else {
            throw new BadRequest(`missing key(${column}): ${JSON.stringify(req.body)}`);
        }
        return false;
    }
}
