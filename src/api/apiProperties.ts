import {
    Request,
    Response
} from "express";
import authenticated from "../security/authenticated";
import httpMetrics from "../observability/httpMetrics";
import {userRole} from "../security/userRoles";
import Database from '../database/database';
import apiBase from "./apiBase";
import sqlProperties from "../model/sqlProperties"
import {
    BadRequest,
    ServerError
} from "../exceptions/httpExceptions";
import {isNull} from "util";

export default class apiProperties extends apiBase {

    constructor(db: Database) {
        super(db);
    }

    @httpMetrics('apiProperties.fetch')
    @authenticated(userRole.Any)
    async fetch(req: Request, res: Response) {
        const result = await this.db.fetch(sqlProperties, req)
            .then((r: object[]): object[] => r)
            .catch((e) => {
                console.log(e);
                return {}
            })
        res.json(result);
        console.log(`returning properties...`)
    }

    @httpMetrics('apiProperties.create')
    @authenticated(userRole.Admin)
    create(req: Request, res: Response) {
        const property = new sqlProperties()
        try {
            property.key = req.body.key?.toString().trim() ?? null;
            property.value = req.body.value?.toString().trim() ?? null;
            property.readonly = req.body.readonly ? (req.body.readonly == 'true') : false;
            if (isNull(property.key)
            ) {
                throw new BadRequest('missing key')
            }
            if (isNull(property.value)) {
                throw new BadRequest('missing value')
            }
            console.log("data validated")
            this.db.create(property).then(() => {
                console.log(`created property ${property.key}`)
                res.send(200).json();
            }).catch((error) => {
                throw new ServerError(`create failed: ${error}`);
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    @httpMetrics('apiProperties.update')
    @authenticated(userRole.Admin)
    update(req: Request, res: Response) {
        try {
            const property = new sqlProperties();
            property.readonly = req.body.readonly ? (req.body.readonly == 'true') : false;
            property.value = req.body.value?.toString().trim() ?? null;
            property.key = req.body.key?.toString().trim() ?? null;
            if (isNull(property.value)) {
                throw new BadRequest('missing value')
            }
            if (isNull(property.key)) {
                throw new BadRequest('missing key')
            }
            console.log("data validated")
            this.db.update(property).then(() => {
                console.log(`created property ${property.key}`)
                res.send(200).json();
            }).catch((error) => {
                throw new ServerError(`create failed: ${error}`);
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    @httpMetrics('apiProperties.delete')
    @authenticated(userRole.Admin)
    delete(req: Request, res: Response) {
        const result = this.db.delete(sqlProperties, 'key', req);
        if (result) {
            res.send(200).json();
        } else {
            res.send(404).json();
        }
    }
}