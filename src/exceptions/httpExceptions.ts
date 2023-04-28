export class HttpException extends Error {
    public name = 'undefined';
    public code: number = 500; //Default to server error.
    constructor(message: string) {
        super(message);
    }
}

export class BadRequest extends HttpException {
    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
        this.code = 400;
    }
}

export class NotAuthenticated extends HttpException {
    constructor(message: string) {
        super(message);
        this.name = "NotAuthenticated";
        this.code = 401;
    }
}

export class Unauthorized extends HttpException {
    constructor(message: string) {
        super(message);
        this.name = "Unauthorized";
        this.code = 403;
    }
}

export class NotFound extends HttpException {
    constructor(message: string) {
        super(message);
        this.name = "NotFound";
        this.code = 404;
    }
}


export class ServerError extends HttpException {
    constructor(message: string) {
        super(message);
        this.name = "ServerError";
        this.code = 500;
    }
}
