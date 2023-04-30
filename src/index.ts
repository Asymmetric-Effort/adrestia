import express from "express";
import {
    Connection,
    createConnection
} from "typeorm";
import ApiHealthCheck from './api/apiHealthCheck';
import ApiProperties from './api/ApiProperties';
import apiTags from "./api/apiTags";
import emitMetric from "./observability/emitMetric";
import {getEnvNumber, getEnvString} from "./environment/getEnv";
import cors from "cors";
import sqlChangeLog from "./model/sqlChangeLog";
import sqlChangeLogTag from "./model/change-tags";
import sqlDependencyList from "./model/sqlDependencyList";
import sqlEntity from "./model/sqlEntity";
import sqlEntityReferences from "./model/sqlEntityReferences";
import sqlEntityType from "./model/sqlEntityType";
import sqlHistoryLog from "./model/sqlHistoryLog";
import sqlNotes from "./model/notes";
import sqlNoteSet from "./model/note-set";
import sqlPerson from "./model/person";
import sqlProperties from "./model/SqlProperties";
import sqlReference from "./model/reference";
import sqlTag from "./model/sqlTag";
import sqlTagSet from "./model/sqlTagSet";
import sqlTeam from "./model/sqlTeam";
import sqlTeamAssociation from "./model/sqlTeamAssociation";

const main = (): void => {
    try {
        emitMetric('application.init', 1, ['status:initializing'])
        emitMetric('application.init.database', 1, ['status:initializing'])
        createConnection({
            type: "postgres",
            host: getEnvString('DB_SERVER'),
            port: getEnvNumber('DB_PORT'),
            username: getEnvString('DB_USER'),
            password: getEnvString('DB_PASS'),
            database: getEnvString('DB_NAME'),
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
        }).then((dbConnect: Connection) => {
            emitMetric('application.init.database', 1, ['status:ok'])

            emitMetric('application.init', 1, ['status:db_connected'])

            const app = express();

            app.use(express.json());
            app.use(cors());

            const api_prefix: string = "/api/v1";

            emitMetric('application.init', 1, ['status:routers_initializing'])

            const health = new ApiHealthCheck(dbConnect);
            const properties: ApiProperties = new ApiProperties(dbConnect);
            // const tags: apiTags = new apiTags(dbConnect);
            // const entity: apiEntity = new apiEntity(dbConnect);
            // const entityTypes: apiEntityTypes = new apiEntityTypes(dbConnect);
            // const changeLog: apiChangeLog = new apiChangeLog(dbConnect);

            emitMetric('application.init', 1, ['status:routers_loaded'])
            /*
             *
             */
            emitMetric('application.init.httpRouter', 1, ['status:initializing', 'route:healthcheck'])
            {
                const uri: string = `${api_prefix}/health`;
                app.get(uri, health.read);
            }
            emitMetric('application.init.counters', 1, ['status:initializing', 'route:counters'])
            {
                const uri: string = `${api_prefix}/counters`;
                app.get(`${uri}/properties`, properties.count);
                // app.get(`${uri}/tags`,tags.count);
                // app.get(`${uri}/entity`,entity.count);
                // app.get(`${uri}/entity_type`,entityTypes.count);
                // app.get(`${uri}/changes`,changeLog.count);
            }
            emitMetric('application.init.httpRouter', 1, ['status:initializing', 'route:properties'])
            {
                const uri: string = `${api_prefix}/properties`;

                app.put(uri, properties.create);
                app.get(uri, properties.read);
                app.post(uri, properties.update);
                app.delete(uri, properties.delete);
            }
            // emitMetric('application.init.httpRouter', 1, ['status:initializing', 'route:tags'])
            // {
            //     const uri: string = `${api_prefix}/tags`;
            //     const api: apiTags = new apiTags(db);
            //     app.put(uri, api.create);
            //     app.get(uri, api.read);
            //     app.post(uri, api.update);
            //     app.delete(uri, api.delete);
            // }
            emitMetric('application.init.httpRouter', 1, ['status:ok'])

            emitMetric('application.init.httpServer', 1, ['status:starting'])
            const api_port = getEnvNumber('APP_PORT')
            app.listen(api_port, () => {
                emitMetric('application.init.httpServer', 1, ['status:running', `port:${api_port}`]);
            });
        }).catch((e) => {
            emitMetric('application.init', 1, ['status:error', `error:${e}`])
            throw e;
        }).finally();
    } catch (error) {
        throw Error(`unrecoverable error: ${error}`)
        process.exit(1)
    }
    process.exit(0)
}

// launch app.
main()




