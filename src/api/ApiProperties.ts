import {
    Request,
    Response
} from "express";
import {
    Api,
} from "./Api";
import {
    apiPropertyRecord,
    apiDataResponse
} from "./apiDataResponse";
import {
    ContentTypeHeader,
    ContentTypeJson
} from "../http/headers";
import {
    Connection as DbConnection,
    Repository,
    getRepository
} from "typeorm";
import authenticated from "../security/authenticated";
import httpMetrics from "../observability/httpMetrics";
import {userRole} from "../security/userRoles";
import SqlProperties from "../model/SqlProperties"
import emitMetric from "../observability/emitMetric";
import {httpStatus, httpStatusText} from "../http/httpStatus";
import {QueryConditions} from "./ApiBase";


export default class ApiProperties extends Api {
    constructor(db: DbConnection) {
        super(db);
    }

    @httpMetrics('application.api.Properties.count')
    @authenticated(userRole.Any)
    public async count(req: Request, res: Response) {
        /*
         * Return a count of properties (and optional error).  count == -1 if error.
         */
        ApiProperties.db.manager.count(SqlProperties)
            .then((c: number) => {
                emitMetric('application.api.properties.count', c, ['status:ok']);
                res.setHeader(ContentTypeHeader, ContentTypeJson)
                    .sendStatus(httpStatus.OK)
                    .json({
                        count: c,
                        error: ''
                    });
            })
            .catch((e) => {
                const c = -1; // -1 count means an error happened.
                emitMetric('application.api.properties.count', c, ['status:error', `error:${e}`]);
                res.setHeader(ContentTypeHeader, ContentTypeJson)
                    .sendStatus(httpStatus.InternalError)
                    .json({
                        count: c,
                        error: 'an error occurred fetching count'
                    });
            });
    }

    @httpMetrics('application.api.Properties.create')
    @authenticated(userRole.Admin)
    public async create(req: Request, res: Response) {
        /*
         * Given the following request object (JSON), create a corresponding property record--
         *  {
         *      key: <string>
         *      value: <string>
         *      readonly: <boolean>
         *  }
         * and return the following response:
         * {
         *    status: ok,
         *    error: ''
         * }
         */
        await this.getRequestProperty(req)
            .then((property: SqlProperties) => {
                Api.db.manager.save(property).then((r: SqlProperties) => {
                    emitMetric('application.api.properties.create', 1, ['status:ok']);
                    res.setHeader(ContentTypeHeader, ContentTypeJson)
                        .sendStatus(httpStatus.OK)
                        .json({
                            status: httpStatusText.OK,
                            error: ''
                        });
                }).catch((e) => {
                    throw Error('Error saving record to db');
                });
            }).catch((e) => {
            emitMetric('application.api.properties.create', 0, ['status:error', `error:${e}`]);
            res.setHeader(ContentTypeHeader, ContentTypeJson)
                .sendStatus(httpStatus.InternalError)
                .json({
                    status: 'error',
                    error: 'property create failed'
                });
        });
    }

    @httpMetrics('application.api.Properties.read')
    @authenticated(userRole.Any)
    public async read(req: Request, res: Response) {
        /*
         * Given a JSON query (as follows) return the matching records, count and any error--
         *      {
         *          "query":{"key":"testProperty1"}
         *          "limit":<number>,
         *          "offset":<number>
         *      }
         * The result looks like...
         * {
         *     "status": "ok",
         *     "count":<number>,
         *     "result:[...list of objects...],
         *     "error: <string>
         */
        await this.getQueryConditions(req)
            .then((conditions: QueryConditions) => {
                const repo: Repository<SqlProperties> = getRepository(SqlProperties);
                repo.find(conditions).then((result: any[]): void => {
                    emitMetric('application.api.Properties.read',result.length,['status:ok']);
                    res.setHeader(ContentTypeHeader, ContentTypeJson)
                        .sendStatus(httpStatus.OK)
                        .json({
                            status: httpStatusText.OK,
                            count: result.length,
                            result: result,
                            error: ''
                        });
                }).catch((e) => {
                    emitMetric('application.api.Properties.read',0,['status:error',`error:${e}`]);
                    res.setHeader(ContentTypeHeader, ContentTypeJson)
                        .sendStatus(httpStatus.BadRequest)
                        .json({
                            status: httpStatusText.BadRequest,
                            count: 0,
                            result: [],
                            error: e
                        });
                });
            });
    }

    @httpMetrics('application.api.Properties.update')
    @authenticated(userRole.Admin)
    public update(req: Request, res: Response) {
        /*
         * Update a new key-value property record (if not read-only)
         */
        const data: apiDataResponse = new apiDataResponse();
        const property: SqlProperties = new SqlProperties();

        property.key = this.getValidString(req, 'key', true);
        property.value = this.getValidString(req, 'value', true);
        property.readonly = this.getValidBoolean(req, 'readonly', false, false);

        const criteria: object = {
            "key": `${property.key}`,
            "readonly": false
        }
        console.log(`criteria (pre): ${JSON.stringify(criteria)}`)

        console.log("property:" + JSON.stringify(property));

        ApiProperties.db.update(SqlProperties, criteria, property)
            .then(() => {
                data.update();
            }).catch((error) => {
            res.status(httpStatus.InternalError);
            data.update([], `create failed: ${error}`);
        });
        data.send(res);
    }

    @httpMetrics('application.api.Properties.delete')
    @authenticated(userRole.Admin)
    public delete(req: Request, res: Response) {
        /*
         * Delete a new key-value property record.
         */
        const data: apiDataResponse = new apiDataResponse();
        ApiProperties.db.delete(SqlProperties, 'key', req)
            .then((r: number) => {
                data.count = r;
                emitMetric('application.api.Properties.delete', r, ['operation:delete', 'status:ok']);
            })
            .catch((e) => {
                data.update([], e);
                emitMetric('application.api.Properties.delete', 0, ['operation:delete', 'status:error', `error:${e}`]);
            });
        data.send(res);
    }
}