import {NotAuthenticated} from "./httpExceptions";

export enum httpStatus {
    OK = 200,
    BadRequest = 400,
    NotAuthenticated = 401,
    Unauthorized = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    InternalError = 500
}

export enum httpStatusText {
    OK = "OK",
    BadRequest = "BadRequest",
    NotAuthenticated = "NotAuthenticated",
    Unauthorized = "Unauthorized",
    NotFound = "NotFound",
    MethodNotAllowed = "MethodNotAllowed",
    InternalError = "InternalError"
}