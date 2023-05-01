import {
    Connection,
    createConnection
} from "typeorm";
import {
    SqlChangeLog,
    SqlChangeTag,
    SqlDependencyList,
    SqlEntity,
    SqlEntityReferences,
    SqlEntityType,
    SqlHistoryLog,
    SqlNotes,
    SqlNoteSet,
    SqlProperties,
    SqlPerson,
    SqlReference,
    SqlTag,
    SqlTagSet,
    SqlTeam,
    SqlTeamAssociation
} from './model';
import {getEnvNumber, getEnvString} from "../environment/getEnv";
import emitMetric from "../observability/emitMetric";

export default async function ConnectDb(synchronize: boolean = false): Promise<Connection> {
    return new Promise<Connection>(async (resolve, reject) => {
        const host: string = getEnvString('DB_SERVER');
        const port: number = getEnvNumber('DB_PORT');
        const username: string = getEnvString('DB_USER');
        const password: string = getEnvString('DB_PASS');
        const database: string = getEnvString('DB_NAME');

        emitMetric('database.base.connect', 1,
            ['status:starting', `dbhost:${host}`, `dbport:${port}`, `dbname:${database}`]);

        await createConnection({
            type: "postgres",
            host: host,
            port: port,
            username: username,
            password: password,
            database: database,
            entities: [
                SqlChangeLog,
                SqlChangeTag,
                SqlDependencyList,
                SqlEntity,
                SqlEntityReferences,
                SqlEntityType,
                SqlHistoryLog,
                SqlNotes,
                SqlNoteSet,
                SqlPerson,
                SqlProperties,
                SqlReference,
                SqlTag,
                SqlTagSet,
                SqlTeam,
                SqlTeamAssociation
            ],
            synchronize: synchronize,
        }).then((connection) => {
            emitMetric('database.base.connect', 1,
                ['status:connected', `dbhost:${host}`, `dbport:${port}`, `dbname:${database}`]);
            if (connection.isConnected) {
                emitMetric('database.base.connect', 1,
                    ['status:ping_ok', `dbhost:${host}`, `dbport:${port}`, `dbname:${database}`]);
            } else {
                emitMetric('database.base.connect', 1,
                    ['status:ping_failed', `dbhost:${host}`, `dbport:${port}`, `dbname:${database}`]);
                reject('ping failure');
            }
            resolve(connection);
        }).catch((e) => {
            emitMetric('database.base.connect', 1,
                ['status:error', `dbhost:${host}`, `dbport:${port}`, `dbname:${database}`]);
            reject(e);
        });
    });
}