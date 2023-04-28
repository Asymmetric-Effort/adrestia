import e from "express";
import {BadRequest} from "../exceptions/httpExceptions";
import {isNull} from "util";
import HandleError from './HandleError';
import Database from "../database/database";

export default class Api extends HandleError {
    constructor(db: Database) {
        super(db);
    }

    protected getValidString(req: e.Request, propName: string, required: boolean, defaultValue: string = ''): string {
        const v = (propName in req.body) ? req.body[propName] : null;
        if (isNull(v)) {
            if (required) {
                throw new BadRequest(`missing ${propName} value (string)`)
            } else {
                return defaultValue;
            }
        } else {
            return v;
        }
    }

    protected getValidBoolean(req: e.Request, propName: string, required: boolean, defaultValue: boolean = false): boolean {
        const v = (propName in req.body) ? req.body[propName] : null;
        if (isNull(v)) {
            if (required) {
                throw new BadRequest(`missing ${propName} value (boolean)`)
            } else {
                return defaultValue;
            }
        } else {
            if (typeof v === 'boolean') {
                return v;
            } else {
                throw new BadRequest(`bad input ${propName} expects boolean`)
            }
        }
    }
}