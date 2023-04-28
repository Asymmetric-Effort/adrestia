import express, {Request, Response} from "express";
import Database from './database/database';
import apiHealthCheck from './api/apiHealthCheck';
import apiProperties from './api/apiProperties';
import apiTags from "./api/apiTags";
import emitMetric from "./observability/emitMetric";
import {getEnvNumber, getEnvString} from "./environment/getEnv";
import cors from "cors";

class ServiceCatalog {
    public constructor() {
        const db: Database = new Database();
        db.connect(
            getEnvString('DB_SERVER'),
            getEnvNumber('DB_PORT'),
            getEnvString('DB_USER'),
            getEnvString('DB_PASS'),
            getEnvString('DB_NAME')
        ).then(() => {
            emitMetric('application.init.database', 1, ['status:ok'])
            const app = express();
            app.use(express.json());
            app.use(cors());

            const api_prefix: string = "/api/v1";
            emitMetric('application.init.httpRouter', 1, ['status:initializing','route:healthcheck'])
            {
                const uri: string = `${api_prefix}/health`;
                const api = new apiHealthCheck(db);
                app.put(uri, api.create);
                app.get(uri, api.read);
                app.post(uri, api.update);
                app.delete(uri, api.delete);
            }
            emitMetric('application.init.httpRouter', 1, ['status:initializing','route:properties'])
            {
                const uri: string = `${api_prefix}/properties`;
                const api: apiProperties = new apiProperties(db);
                app.put(uri, api.create);
                app.get(uri, api.read);
                app.post(uri, api.update);
                app.delete(uri, api.delete);
            }
            emitMetric('application.init.httpRouter', 1, ['status:initializing','route:tags'])
            {
                const uri: string = `${api_prefix}/tags`;
                const api: apiTags = new apiTags(db);
                app.put(uri, api.create);
                app.get(uri, api.read);
                app.post(uri, api.update);
                app.delete(uri, api.delete);
            }
            emitMetric('application.init.httpRouter', 1, ['status:ok'])

            emitMetric('application.init.httpServer', 1, ['status:starting'])
            const api_port = getEnvNumber('APP_PORT')
            app.listen(api_port, () => {
                emitMetric('application.init.httpServer', 1, ['status:running', `port:${api_port}`]);
            });
        }).catch((error) => {
            emitMetric('application.init.database', 1, ['status:error', `error:${error}`])
        });
    }
}

/*
 * Run the app
 */
const app: ServiceCatalog = new ServiceCatalog();






