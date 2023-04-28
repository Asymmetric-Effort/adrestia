import Base from './Base';
import {Response} from "express";
import {HttpException} from "../exceptions/httpExceptions";
import Database from "../database/database";

export default class HandleError extends Base {
    constructor(db: Database){
        super(db);
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