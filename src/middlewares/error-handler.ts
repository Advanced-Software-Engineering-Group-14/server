import { NextFunction, Request, Response } from 'express';
import { IErrorResponse } from '../interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, req: Request, res: Response<IErrorResponse>, next: NextFunction) => {
  const message = err.message || 'Something went wrong';
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? '🎈' : err.stack,
  });
};

export default errorHandler;