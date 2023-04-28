import "reflect-metadata";
import {
    Connection,
    createConnection,
    getRepository,
    Repository,
    DeleteResult
} from "typeorm";
import sqlPerson from './model/person';
import sqlTeam from './model/sqlTeam';
import sqlTag from './model/sqlTag';
import sqlTagSet from './model/sqlTagSet';
import sqlChangeLog from './model/sqlChangeLog';
import sqlChangeLogTag from './model/change-tags';
import sqlDependencyList from "./model/sqlDependencyList";
import sqlEntityType from "./model/sqlEntityType";
import sqlEntity from "./model/sqlEntity";
import sqlEntityReferences from "./model/sqlEntityReferences";
import sqlReference from "./model/reference";
import sqlTeamAssociation from "./model/sqlTeamAssociation";
import sqlHistoryLog from "./model/sqlHistoryLog";
import sqlNotes from "./model/notes";
import sqlNoteSet from "./model/note-set";
import sqlProperties from "./model/sqlProperties";
import {BadRequest, ServerError} from "./exceptions/httpExceptions";
import e from "express";
import {isNull} from "util";


export default class Database {
    //
    private readonly defaultLimit: number = 10;
    private readonly defaultOffset: number = 0;
    private readonly maxLimit: number = 1000;
    private readonly dbCacheMs: number = 5000;
    //
    private connection: Connection;

    public constructor() {
        console.log("Database class initializing")
    }

    public async connect() {
        console.log("creating connection...")
        this.connection = await createConnection({
            type: "postgres",
            host: "192.168.3.190",
            port: 5432,
            username: "adrestia",
            password: "password",
            database: "postgres",
            entities: [
                sqlChangeLog,
                sqlChangeLogTag,
                sqlDependencyList,
                sqlEntity,
                sqlEntityReferences,
                sqlEntityType,
                sqlHistoryLog,
                sqlNotes,
                sqlNoteSet,
                sqlPerson,
                sqlProperties,
                sqlReference,
                sqlTag,
                sqlTagSet,
                sqlTeam,
                sqlTeamAssociation
            ],
            synchronize: true,
        });
        console.log("database connection ok.")
    }

    async disconnect() {
        await this.connection.close();
    }

    ping(): boolean {
        return this.connection.isConnected;
    }

    protected getLimit(req: e.Request): number {
        console.log('getLimit() start');
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
        console.log('getOffset() start');
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
