import Database from './../database';
import {Request, Response} from "express";
import {BadRequest, HttpException} from "../exceptions/httpExceptions";

export default class apiBase {
    protected db: Database;

    constructor(db: Database) {
        console.log("apiHealthCheck: initializing");
        this.db = db;

        this.fetch = this.fetch.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public fetch(req: Request, res: Response): void {
        res.send(405).json();
    }

    public create(req: Request, res: Response): void {
        res.send(405).json({message: 'method not implemented'});
    }

    public update(req: Request, res: Response): void {
        res.send(405).json({message: 'method not implemented'});
    }

    public delete(req: Request, res: Response): void {
        res.send(405).json({message: 'method not implemented'});
    }

    protected handleError(res: Response, error: Error) {
        console.log(`Handling error: ${error}`)
        if (error instanceof HttpException) {
            return res.status(error.code).json({
                error: error.name,
                message: error.message
            })
        } else {
            return res.status(500).json({
                error: 'unknownError',
                message: error
            });
        }
    }


}