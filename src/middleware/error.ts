import { type NextFunction, type Request, type Response, type ErrorRequestHandler } from 'express';
import isEqual from 'lodash/isEqual';
import ErrorResponse from '../utils/errorResponse';
import { isEmpty } from 'lodash';

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // mongo cast error
  if (isEqual(err?.name, 'CastError')) {
    const castErrorPath = (err as { path: string })?.path;
    error = new ErrorResponse(`${castErrorPath} is invalid`, 400);
  }

  // yup errors
  if (!isEmpty(err?.errors)) {
    const errorMessage = err?.errors?.map((error: any) => error?.message)?.join(',');
    error = new ErrorResponse(errorMessage, 400);
  }

  return res.status(error?.statusCode || 500).json({ data: [], error: error?.message || 'Server Error' });
};
