import {httpStatus, httpStatusText} from "./httpStatus";
import emitMetric from "../observability/emitMetric";

export class HttpException extends Error {
    private readonly _name: httpStatusText;
    private readonly _code: httpStatus;

    constructor(message: string, name: httpStatusText, code: httpStatus) {
        super(message);
        this._name = name;
        this._code = code;
        emitMetric(
            'http.exception',
            1,
            [
                `status:${this._code}`,
                `name:${this._name}`,
                `message:'${this.message}'`
            ]);
    }

    public get name(): string {
        return this._name;
    }

    public get code(): httpStatus {
        return this._code;
    }

}

export class BadRequest extends HttpException {
    constructor(message: string) {
        super(message, httpStatusText.BadRequest, httpStatus.BadRequest);
    }
}

export class NotAuthenticated extends HttpException {
    constructor(message: string) {
        super(message, httpStatusText.NotAuthenticated, httpStatus.NotAuthenticated);
    }
}

export class Unauthorized extends HttpException {
    constructor(message: string) {
        super(message, httpStatusText.Unauthorized, httpStatus.Unauthorized);
    }
}

export class NotFound extends HttpException {
    constructor(message: string) {
        super(message, httpStatusText.NotFound, httpStatus.NotFound);
    }
}

export class MethodNotAllowed extends HttpException {
    constructor(message: string) {
        super(message, httpStatusText.MethodNotAllowed, httpStatus.MethodNotAllowed);
    }
}

export class InternalError extends HttpException {
    constructor(message: string) {
        super(message, httpStatusText.InternalError, httpStatus.InternalError);
    }
}
