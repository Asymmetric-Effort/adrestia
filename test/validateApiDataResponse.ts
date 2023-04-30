import request from "supertest";
import {ContentType, ContentTypeJson} from "./ContentType";
import {apiPropertyRecord} from '../src/api/apiDataResponse'

export default function validateApiDataResponse(r: request.Response,
                                 expectedCount: number,
                                 expectedResult: apiPropertyRecord[],
                                 expectedError: string) {
    expect(ContentType(r)).toBe(ContentTypeJson);
    expect(r.body).toHaveProperty('count');
    expect(r.body).toHaveProperty('result');
    expect(r.body).toHaveProperty('error');
    expect(r.body.count).toEqual(expectedCount);
    expect(r.body.result).toBeInstanceOf(Array)
    expect(r.body.result.length).toEqual(expectedResult.length);
    expect(r.body.result.length).toEqual(r.body.count)
    expect(r.body.error).toEqual(expectedError);
    if(r.body.result.length > 0){
        r.body.result.forEach((o,i,a)=>{
            expect(o).toHaveProperty('key')
            expect(o).toHaveProperty('value')
            expect(o).toHaveProperty('readonly')
            expect(o.key).toEqual(expectedResult[i].key)
            expect(o.value).toEqual(expectedResult[i].value)
            expect(o.readonly).toEqual(expectedResult[i].readonly)
        })
    }
}