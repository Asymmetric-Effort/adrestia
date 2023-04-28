import CryptoJS from 'crypto-js';
import MetricEmitter from './MetricEmitter';
import {NextFunction, Request, Response} from 'express';
import {
    HttpException
} from "../exceptions/httpExceptions";
import {httpStatus} from "../exceptions/httpStatus";

export default function httpMetrics(metric: string): MethodDecorator {
    /*
     * metric emitter decorator function.
     *   - Emits metric at start of http request handling
     *   - Emits metric after operation (successful)
     *   - Emits metric on any error.
     */
    let reqCounter: number = 0;
    const telemetry = new MetricEmitter(metric);
    return function (target: any,
                     propertyKey: string | symbol,
                     descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {

            const url: string = CryptoJS.SHA256(req.url);

            reqCounter++;

            try {
                telemetry.send(reqCounter,['http:start', 'httpStatus:200',`url:${url}`]);

                const httpResponse = originalMethod.call(this, req, res, next);

                telemetry.send( reqCounter,['http:end', 'httpStatus:200',`url:${url}`]);

                return httpResponse;

            } catch (error: any) {
                if(error instanceof HttpException){
                    telemetry.send(reqCounter, ['http:error', `httpStatus:${error.code}`]);
                    return res.status(error.code).json({
                        error: error.name,
                        message: error.message
                    });
                } else {
                    telemetry.send(reqCounter, ['http:error', `httpStatus:uncaughtException`,`error:${error}`]);
                    return res.status(httpStatus.InternalError).json({error: 'uncaughtException', message: error
                    });
                }
            }
        };
        return descriptor;
    };
}
