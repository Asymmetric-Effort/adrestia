import Database from "../database/database";
import {Request, Response} from "express";
import {httpStatus, httpStatusText} from "../exceptions/httpStatus";
import {isNull} from "util";

export default class Base {
    protected static db: Database = null;

    constructor(db: Database) {
        if(isNull(Base.db)){
            Base.db = db;
        }
        this.fetch = this.fetch.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public fetch(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed).json({
            message:httpStatusText.MethodNotAllowed});
    }

    public create(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed).json({
            message:httpStatusText.MethodNotAllowed});
    }

    public update(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed).json({
            message:httpStatusText.MethodNotAllowed});
    }

    public delete(req: Request, res: Response): void {
        res.send(httpStatus.MethodNotAllowed).json({
            message:httpStatusText.MethodNotAllowed});
    }

}