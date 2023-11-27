import { NextFunction, Request, Response } from 'express';
import { createError } from '../utils';
import { TokenPayload, __validateAuthToken } from '../helpers/token';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user: TokenPayload;
        PayLoad: any
    }
}

export default async function verifyAccess(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
          return next(createError(403, 'Authorization header is required'));
        }
    
        const token = authorization.split(' ')[1];
    
        if (!token) {
          return next(createError(403, 'There is no token attached to header'));
        }
    
        const decoded  = await __validateAuthToken(token) ;
    
        
        req.user = decoded;
        next();
    
      } catch (error) {
        next(error);
      }
}