import {
    Api,
} from "./Api";
import {
    Request,
    Response
} from "express";
import httpMetrics from "../observability/httpMetrics";
import emitMetric from "../observability/emitMetric";
import {httpStatus, httpStatusText} from "../http/httpStatus";
import {Connection as DbConnection} from "typeorm";

export default class ApiHealthCheck extends Api {
    constructor(db: DbConnection) {
        super(db);
    }

    @httpMetrics('application.api.healthcheck')
    public read(req: Request, res: Response): void {
        emitMetric('application.api.healthcheck', 1, [`status:starting`]);
        this.ping().then((status) => {
            emitMetric('application.api.healthcheck', 1, [`status:${status}`]);
            res.sendStatus(httpStatus.OK).json({status: httpStatusText.OK});
        }).catch((e) => {
            emitMetric('application.api.healthcheck', 0, ['status:error', `error:${e}}`]);
            res.sendStatus(httpStatus.InternalError).json({status: 'db disconnected', error: `${e}`});
        }).finally();
    }
}