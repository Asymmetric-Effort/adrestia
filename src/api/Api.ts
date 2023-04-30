import e, {Request} from "express";
import SqlProperties from "../model/SqlProperties";
import {ApiBase} from "./ApiBase";
import {Connection as DbConnection} from "typeorm";


export class Api extends ApiBase {
    constructor(db: DbConnection) {
        super(db);
    }

    protected async getRequestProperty(req: Request): Promise<SqlProperties> {
        /*
         * given a request, return the SQL Properties record containing
         * the corresponding key, value and readonly attribute.
         */
        return new Promise<SqlProperties>(async (resolve, reject) => {
            try {
                const property: SqlProperties = new SqlProperties();
                property.key = await this.getValidString(req, 'key', true)
                    .then((r: string) => {
                        return r;
                    })
                    .catch((e) => {
                        throw Error(`Invalid input (key: string): ${e};`);
                    });
                property.value = await this.getValidString(req, 'value', true)
                    .then((r: string) => {
                        return r;
                    })
                    .catch((e) => {
                        throw Error(`Invalid input (value: string): ${e};`);
                    });
                property.readonly = await this.getValidBoolean(req, 'readonly', false, false)
                    .then((r: boolean) => {
                        return r;
                    })
                    .catch((e) => {
                        throw Error(`Invalid input (readonly: boolean): ${e};`);
                    });
                resolve(property);
            } catch (e) {
                reject(e);
            }
        });
    }

    protected getValidString(req: e.Request, propName: string, required: boolean,
                             defaultValue: string = ''): Promise<string> {
        /*
         * Guarantee that the given property name (propName) exists as a string
         * in the http request and extract its value as the resulting promise.
         */
        return new Promise<string>((resolve, reject) => {
            if (propName in req.body) {
                resolve(req.body[propName]);
            } else {
                if (required) {
                    reject(`missing ${propName}`);
                } else {
                    resolve(defaultValue);
                }
            }
        })
    }

    protected getValidBoolean(req: e.Request, propName: string, required: boolean,
                              defaultValue: boolean = false): Promise<boolean> {
        /*
         * Guarantee that the given property name (propName) exists as a boolean in
         * the http request and extract its value as the resulting promise.
         */
        return new Promise<boolean>((resolve, reject) => {
            if (propName in req.body) {
                const value: string = req.body[propName].toLowerCase().trim();
                if (value in ['true', 'false']) {
                    resolve(value == 'true');
                } else {
                    reject(`${propName} expects boolean`);
                }
            } else {
                if (required) {
                    reject(`missing ${propName}`);
                } else {
                    resolve(defaultValue);
                }
            }
        });
    }

}/* end of class */