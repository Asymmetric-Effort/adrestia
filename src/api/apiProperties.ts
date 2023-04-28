import {
    Request,
    Response
} from "express";
import authenticated from "../security/authenticated";
import httpMetrics from "../observability/httpMetrics";
import {userRole} from "../security/userRoles";
import Database from '../database/database';
import Api from "./Api";
import sqlProperties from "../model/sqlProperties"
import {
    BadRequest,
    InternalError
} from "../exceptions/httpExceptions";
import {isNull} from "util";

export default class apiProperties extends Api {

    constructor(db: Database) {
        super(db);
    }

    @httpMetrics('application.api.Properties.create')
    @authenticated(userRole.Admin)
    create(req: Request, res: Response) {
        /*
         * Create a new key-value property record.
         */
        const property = new sqlProperties()
        try {
            property.key = this.getValidString(req, 'key', true);
            property.value = this.getValidString(req, 'value', true);
            property.readonly = this.getValidBoolean(req, 'readonly', false, false);
            apiProperties.db.create(property).then(() => {
                res.send(200).json();
            }).catch((error) => {
                throw new InternalError(`create failed: ${error}`);
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    @httpMetrics('application.api.Properties.read')
    @authenticated(userRole.Any)
    async read(req: Request, res: Response) {
        /*
         * Return a set of key-value property records.
         */
        const result = await apiProperties.db.read(sqlProperties, req)
            .then((r: object[]): object[] => r)
            .catch((e) => {
                console.log(e);
                return {}
            })
        res.json(result);
    }
    @httpMetrics('application.api.Properties.update')
    @authenticated(userRole.Admin)
    update(req: Request, res: Response) {
        /*
         * Update a new key-value property record (if not read-only)
         */
        try {
            const property = new sqlProperties();
            property.key = this.getValidString(req,'key',true);
            property.value = this.getValidString(req,'value',true);
            property.readonly = this.getValidBoolean(req,'readonly',false,false);
            if (isNull(property.value)) {
                throw new BadRequest('missing value')
            }
            if (isNull(property.key)) {
                throw new BadRequest('missing key')
            }
            apiProperties.db.update(property).then(() => {
                res.send(200).json();
            }).catch((error) => {
                throw new InternalError(`create failed: ${error}`);
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    @httpMetrics('application.api.Properties.delete')
    @authenticated(userRole.Admin)
    delete(req: Request, res: Response) {
        /*
         * Delete a new key-value property record.
         */
        const result: number = apiProperties.db.delete(sqlProperties, 'key', req);
        if (result > 0) {
            res.send(200).json();
        } else {
            res.send(404).json();
        }
    }
}