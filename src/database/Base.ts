import {
    Connection,
    createConnection
} from "typeorm";
import sqlChangeLog from "../model/sqlChangeLog";
import sqlChangeLogTag from "../model/change-tags";
import sqlDependencyList from "../model/sqlDependencyList";
import sqlEntity from "../model/sqlEntity";
import sqlEntityReferences from "../model/sqlEntityReferences";
import sqlEntityType from "../model/sqlEntityType";
import sqlHistoryLog from "../model/sqlHistoryLog";
import sqlNotes from "../model/notes";
import sqlNoteSet from "../model/note-set";
import sqlPerson from "../model/person";
import sqlProperties from "../model/sqlProperties";
import sqlReference from "../model/reference";
import sqlTag from "../model/sqlTag";
import sqlTagSet from "../model/sqlTagSet";
import sqlTeam from "../model/sqlTeam";
import sqlTeamAssociation from "../model/sqlTeamAssociation";
import emitMetric from "../observability/emitMetric";

export default class Base {
    //
    protected connection: Connection;

    public constructor() {
        emitMetric('database.base.constructor', 1, ['status:ok']);
    }

    public async connect(host: string, port: number, user: string,
                         password: string, database: string) {
        try {
            emitMetric('database.base.connect', 1, [
                'status:starting',`dbhost:${host}`,`dbport:${port}`,
                `dbname:${database}`
            ]);
            this.connection = await createConnection({
                type: "postgres",
                host: host,
                port: port,
                username: user,
                password: password,
                database: database,
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
            emitMetric('database.base.connect', 1, ['status:checking']);
            if(this.connection.isConnected) {
                emitMetric('database.base.connect', 1, ['status:ok']);
            }else{
                throw Error('Error connecting to database');
            }
        }catch(e){
            emitMetric('database.base.connect',0,['status:error',`error:${e}`]);
            process.exit(1); //Kill the system.
        }
    }

    async disconnect() {
        await this.connection.close().then(() => {
            emitMetric('database.base.disconnect', 1, ['status:ok']);
        }).catch((e) => {
            emitMetric('database.base.disconnect', 0, ['status:error', `error:${e}`]);
        });
    }
}