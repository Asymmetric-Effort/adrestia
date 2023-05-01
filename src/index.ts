import express,{Express} from "express";
import ConnectDb from "./database/connect";
import emitMetric from "./observability/emitMetric";
import cors from "cors";
import {getEnvNumber} from "./environment/getEnv";
import apiHealthCheck from "./api/healthcheck";


export default function main() {
    emitMetric("api.start", 1, ['status: ok']);
    ConnectDb(false)
        .then((db) => {
            /*
             * Database is connected.
             */
            emitMetric('api.http.server.starting', 1, ['status:ok'])
            /*
             * Starting web api server.
             */
            const api:Express = express();
            api.use(express.json());
            api.use(cors());

            apiHealthCheck(api, db);

            const api_port = getEnvNumber('APP_PORT')
            api.listen(api_port, () => {
                emitMetric('api.http.server.starting', 1, ['status:ok', `port:${api_port}`])
            });
        })
        .catch((e) => {
            emitMetric("api.start", 1, ['status: failed']);
            throw e;
        });
}
main();