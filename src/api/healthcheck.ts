import {Express, Request, Response} from "express";
import emitMetric from "../observability/emitMetric";
import {Connection} from "typeorm";

export default function apiHealthCheck(api: Express, db: Connection) {

    const api_prefix: string = "/api/v1";
    const url: string = `${api_prefix}/health`;

    api.get(url, (req: Request, res: Response): void => {

        if (db.isConnected) {

            emitMetric('api.healthcheck.ok', 1, ['status:ok'])
            res.status(200)
                .setHeader('content-type', 'application/json; charset=utf-8')
                .send({status: 'ok'});

        } else {

            emitMetric('api.healthcheck.ok', 1, ['status:error'])
            res.status(500)
                .setHeader('content-type', 'application/json; charset=utf-8')
                .send({status: 'db_failed'});

        }
    });
}