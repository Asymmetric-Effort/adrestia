import request from 'supertest';
import validateApiDataResponse from './validateApiDataResponse';
import {apiPropertyRecord} from '../src/api/apiDataResponse'

import {
    ContentType,
    ContentTypeHeader,
    ContentTypeJson
} from "./ContentType";

describe('Test Properties API (CRUD Operations)', () => {
    const apiServer: string = 'http://127.0.0.1:3000';
    const url: string = `/api/v1/properties`;

    const httpOk = 200;
    const httpBadRequest = 400;

    const emptyString: string = '';
    const emptyArray: apiPropertyRecord[] = [];

    const errorLimitExceeds1000: string = "limit must be < 1000.  Use pagination."

    describe('Verify HTTP/GET will validate inputs', () => {
        it('expects GET with limit >=1000 will return HTTP/400', async () => {
            const query: object = {
                limit: 1000,
                offset: 0,
                query: {
                    "key": "%"
                }
            }

            await request(apiServer)
                .get(url)
                .set(ContentTypeHeader, ContentTypeJson)
                .send(query)
                .expect(httpBadRequest)
                .then((r) => {
                    expect(ContentType(r)).toBe(ContentTypeJson);
                    expect(r.body).toHaveProperty('count');
                    expect(r.body).toHaveProperty('result');
                    expect(r.body).toHaveProperty('error');
                    expect(r.body.count).toEqual(0);
                    expect(r.body.result).toBeInstanceOf(Array)
                    expect(r.body.result.length).toEqual(0);
                    expect(r.body.result.length).toEqual(r.body.count);
                    expect(r.body.error).toEqual(errorLimitExceeds1000);
                }).catch((e) => {
                    throw e;
                })
        });
        //
        // it('expects GET will return HTTP/200 with an empty request', async () => {
        //     const query: object = {}
        //     await request(apiServer)
        //         .get(url)
        //         .set(ContentTypeHeader, ContentTypeJson)
        //         .send(query)
        //         .expect(httpOk)
        //         .then((r) => {
        //             validateApiDataResponse(r, 0, emptyArray, emptyString);
        //         }).catch((e) => {
        //             throw e;
        //         });
        // });
        //
        // it('expects GET to return an empty property set', async () => {
        //     const query: object = {
        //         limit: 999,
        //         offset: 0,
        //         query: {
        //             "key": "%"
        //         }
        //     }
        //     await request(apiServer)
        //         .get(url)
        //         .set(ContentTypeHeader, ContentTypeJson)
        //         .send(query)
        //         .expect(httpOk)
        //         .then((r) => {
        //             validateApiDataResponse(r, 0, emptyArray, emptyString);
        //         }).catch((e) => {
        //             throw e;
        //         });
        // });
    });

    describe("Create, Read, Update and delete a single record", () => {
        const actual: object = {
            "key": "testProperty1",
            "value": "testValue1",
            "readonly": false
        };
        it('expects we can create a record', async () => {
            /*
             * expect--
             *
             *      {
             *          count: <number>
             *      }
             *
             *   --or--
             *
             *      {
             *          count: 0,
             *          error: <string>
             *      }
             */
            await request(apiServer)
                .put(url)
                .set(ContentTypeHeader, ContentTypeJson)
                .send(actual)
                .expect(httpOk)
                .then((r) => {
                    validateApiDataResponse(r, 1, emptyArray, emptyString);

                    expect(ContentType(r)).toBe(ContentTypeJson);
                    expect(r.body).toHaveProperty('count');
                    if('error' in r.body) {
                        expect(r.body.count).toEqual(0);
                    }else{
                        expect(r.body.count).toEqual(1);
                    }
                }).catch((e) => {
                    throw e;
                });
        });
        // it('expects we can verify the record was created', async () => {
        //     await request(apiServer)
        //         .get(url)
        //         .set(ContentTypeHeader, ContentTypeJson)
        //         .send({"key": "testProperty1"})
        //         .expect(httpOk)
        //         .then((r) => {
        //             validateApiDataResponse(r, expected.count, expected.result, expected.error);
        //             expect(r.body.result[0].readonly).toBe(false)
        //         }).catch((e) => {
        //             throw e;
        //         });
        // });
        // -- passes up to this point --
        // it('expects we can delete the record we created', async () => {
        //     await request(apiServer)
        //         .delete(url)
        //         .set(ContentTypeHeader, ContentTypeJson)
        //         .send({"key": "testProperty1"})
        //         .expect(httpOk)
        //         .then((r) => {
        //             console.log('----');
        //             console.log("deleted count: "+r.body.count);
        //             console.log('----');
        //             validateApiDataResponse(r, expected.count, expected.result, expected.error);
        //         }).catch((e) => {
        //             throw e;
        //         });
        // });
        // ---

        //     it('expects POST will update the created record when readonly is false', async () => {
        //         const query: object = {
        //             key: "testProperty1",
        //             value: "testValue2",
        //             readonly: true
        //         }
        //         const expected = {
        //             count: 0,
        //             result: [],
        //             error: ""
        //         }
        //         await request(apiServer)
        //             .post(url)
        //             .set(ContentTypeHeader, ContentTypeJson)
        //             .send(query)
        //             .expect(200)
        //             .then((r) => {
        //                 validateApiDataResponse(r, expected.count, expected.result, expected.error);
        //             })
        //     });
        //
        //     it('expects GET will confirm the update', async () => {
        //         const query: object = {}
        //         const expected = {
        //             "count": 1,
        //             "result": [
        //                 {
        //                     "key": "testProperty1",
        //                     "value": "testValue2",
        //                     "readonly": true
        //                 }
        //             ],
        //             "error": ""
        //         }
        //         await request(apiServer)
        //             .get(url)
        //             .set(ContentTypeHeader, ContentTypeJson)
        //             .send(query)
        //             .expect(httpOk)
        //             .then((r) => {
        //                 validateApiDataResponse(r, expected.count, expected.result, expected.error);
        //             }).catch((e) => {
        //                 throw e;
        //             });
    });

    //     it.skip('expects POST will not update created record when readonly is true', async()=>{
    //
    //     });
    //
    //     it.skip('expects GET will confirm readonly update failed', async()=>{
    //         await request(apiServer)
    //             .post(url)
    //             .set('Content-Type', 'application/json; charset=utf-8')
    //             .send({
    //                 "key": "testProperty1",
    //                 "value": "testValue2",
    //                 "readonly": false
    //             })
    //             .expect(200)
    //             .then((r) => {
    //                 expect(ContentType(r)).toBe(expectedContentType);
    //                 expect(r.body.status.toLowerCase()).toBe("ok");
    //             })
    //     });
    //
    //     it('expects DELETE will delete a created record', async()=>{
    //
    //     });
    // });
    // describe("Create Multiple Records and read a subset using wildcard, then delete all", ()=>{
    //     it('creates a set of records',async()=>{
    //
    //     });
    //     it('reads a subset of records using wildcard', async()=>{
    //
    //     });
    //     it('deletes all the records using wildcard', async()=>{
    //
    //     });
    //     it('reads a zero-record result', async()=>{
    //
    //     });
    // });
});
