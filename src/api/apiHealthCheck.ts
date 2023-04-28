import {Request, Response} from "express";
import Database from '../database/database';
import apiBase from "./apiBase";
import httpMetrics from "../observability/httpMetrics";

export default class apiHealthCheck extends apiBase {
    protected db: Database;
    constructor(db: Database) {
        super(db);
        console.log("apiHealthCheck: initializing");
        if (this.db.ping()) {
            console.log("apiHealthCheck: ok");
        }else{
            throw Error('apiHealthCheck: failed (db)')
        }
    }

    @httpMetrics('healthcheck')
    fetch(req: Request, res: Response): void {
        console.log("fetch properties");
        if (this.db.ping()) {
            console.log({api: 'health', status: 'ok'})
            res.send(200);
        } else {
            console.log({api: 'health', status: 'fail'})
            res.send(500);
        }
    }
}