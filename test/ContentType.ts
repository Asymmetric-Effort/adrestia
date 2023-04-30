import request from "supertest";

export const ContentTypeHeader: string = 'content-type';
export const ContentTypeJson: string = 'application/json; charset=utf-8'

export function ContentType(r: request.Response): string {
    return r.headers['content-type'];
}