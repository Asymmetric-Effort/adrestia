import { Request, Response, NextFunction } from 'express';

export default function authorized(role: string): MethodDecorator {
    function permissionCheck(userName: string, requiredRole: string): boolean {
        return true;
    }

    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(req: Request, res: Response, next: NextFunction) {
            //ToDo: this needs to get the role from the user's JWT

            // const thisUser:string = req.headers.authenticatedUser;
            // if((permissionCheck(thisUser,role)) || (permissionCheck(thisUser, 'admin')) ){
                return originalMethod.call(this, req, res, next);
            // }else{
            //     return res.status(403).json({ message: 'You are not authorized to access this resource.' });
            // }
        }

        return descriptor;
    }
}
