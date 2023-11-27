import { NextFunction, Request, Response } from 'express';
import { createError } from '../utils';
import { TokenPayload } from '../helpers/token';

declare module 'express-serve-static-core' {
    interface Request {
        user: TokenPayload;
        PayLoad: any
    }
}

export default function verifyManager(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    try {
        if (user.type === "ADMIN" || user.type === "SUDO") {
            next();
        } else {
            return next(createError(403, 'You are not authorized to perform this action'));
        }
    } catch (error) {
        next(error);
    }
}