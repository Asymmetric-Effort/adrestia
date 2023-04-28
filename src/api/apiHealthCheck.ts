import Api from "./Api";
import {
    Request,
    Response
} from "express";
import Database from '../database/database';
import httpMetrics from "../observability/httpMetrics";
import emitMetric from "../observability/emitMetric";
import {httpStatus} from "../exceptions/httpStatus";

export default class apiHealthCheck extends Api {
    constructor(db: Database) {
        super(db);
        apiHealthCheck.db.ping().then((status)=>{
            emitMetric('application.api.healthcheck',1,[`status:${status}`]);
        }).catch((error)=>{
            emitMetric('application.api.healthcheck',0,['status:error',`error:${error}}`]);
        }).finally();
    }

    @httpMetrics('application.api.healthcheck')
    public read(req: Request, res: Response): void {
        emitMetric('application.api.healthcheck', 1, [`status:starting`]);
        apiHealthCheck.db.ping().then((status) => {
            emitMetric('application.api.healthcheck', 1, [`status:${status}`]);
            res.send(httpStatus.OK).json();
        }).catch((e) => {
            emitMetric('application.api.healthcheck', 0, ['status:error', `error:${e}}`]);
        }).finally();
    }
}