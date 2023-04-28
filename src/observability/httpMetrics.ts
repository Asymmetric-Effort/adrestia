import CryptoJS from 'crypto-js';
import MetricEmitter from './MetricEmitter';
import {NextFunction, Request, Response} from 'express';
import {
    HttpException
} from "../exceptions/httpExceptions";

export default function httpMetrics(metric: string): MethodDecorator {
    /*
     * metric emitter decorator function.
     *   - Emits metric at start of http request handling
     *   - Emits metric after operation (successful)
     *   - Emits metric on any error.
     */
    const telemetry = new MetricEmitter(metric);
    return function (target: any,
                     propertyKey: string | symbol,
                     descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request,
                                     res: Response,
                                     next: NextFunction) {

            const url: string = CryptoJS.SHA256(req.url);
            try {
                telemetry.send(Date.now().valueOf(), ['http:start', 'httpStatus:200']);

                const httpResponse = originalMethod.call(this, req, res, next);

                telemetry.send(Date.now().valueOf(), ['http:end', 'httpStatus:200']);

                return httpResponse;

            } catch (error: any) {
                if(error instanceof HttpException){
                    telemetry.send(
                        Date.now().valueOf(),
                        ['http:error', `httpStatus:${error.code}`]);
                    return res.status(error.code).json({
                        error: error.name,
                        message: error.message
                    });
                } else {
                    return res.status(500).json({
                        error: 'unknownError',
                        message: error
                    });
                }
            }
        };
        return descriptor;
    };
}
