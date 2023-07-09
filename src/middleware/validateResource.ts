import { type NextFunction, type Request, type Response } from 'express';
import { type AnyZodObject } from 'zod';
import logger from '../../logger';

export const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    logger.error(error);
    res.sendStatus(400);
  }
};
