import { ApiError } from './index.js';
import { Request, Response, NextFunction } from 'express';

export const errorHandlerMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  console.log('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};


export const asyncErrorHandler = (fn: Function) => (
req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};