import {userRole} from './userRoles';
import {NextFunction, Request, Response} from 'express';
import {HttpException} from "../exceptions/httpExceptions";
import emitMetric from "../observability/emitMetric";
import {httpStatus} from "../exceptions/httpStatus";

export default function authenticated(role: userRole): MethodDecorator {
    /*
     * - Verify the RS-256 JWT token from the request.  (on error, return http/401)
     * - Extract the username and any roles from the JWT token. (on error, return http/401)
     * - Confirm the user has the claimed role. (on error, return http/403)
     * - Finally, proceed with the request if no error occurred.
     */
    function userHasRole(scopes: string[]): boolean {
        return (role === userRole.Any) || (scopes.indexOf(role.toString()) > -1);
    }

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {

            try {
                // Get the authorization header...
                // const authHeader = req.headers.authorization;
                // if (!authHeader) throw new NotAuthenticated('Missing Authorization header');
                // const token = authHeader.split(' ')[1];

                // Verify and decode the JWT...
                // const decodedToken = jwtPromised.verify(token, jwtPublicKey, {algorithms: ['RS256']});

                // Extract the user's name, email and scopes from the decoded token...
                // req.email: string = decodedToken.email;
                // req.name: string = decodedToken.name;
                // const scopes: string[] = decodedToken.scope.split(' ');

                // check that the user has the role within the JWT claims...
                // if (!userHasRole(scopes)){
                //     throw new Unauthorized(`user does not have required role (${role})`)
                // }
                emitMetric('application.security.authentication',1,['status:ok'])
                return originalMethod.call(this, req, res, next);
            } catch (e) {
                emitMetric('application.security.authentication',1,['status:error',`error:${e}`])
                console.log(`Authentication error: ${e}`)
                if (e instanceof HttpException) {
                    return res.status(e.code).json({
                        error: e.name,
                        message: e.message
                    })
                } else {
                    return res.status(httpStatus.InternalError).json({
                        error: 'unhandledError',
                        message: e
                    });
                }
            }
        };
        return descriptor;
    };
}
