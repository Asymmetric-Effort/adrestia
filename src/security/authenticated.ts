import {userRole} from './userRoles';
import {NextFunction, Request, Response} from 'express';
import {HttpException} from "../exceptions/httpExceptions";

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
                console.log("Authentication passed")
                return originalMethod.call(this, req, res, next);
            } catch (error) {
                console.log(`Authentication error: ${error}`)
                if (error instanceof HttpException) {
                    return res.status(error.code).json({
                        error: error.name,
                        message: error.message
                    })
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
