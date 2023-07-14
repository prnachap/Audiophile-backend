import { type NextFunction, type Request, type Response } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not Authenticated' });
  }
  next();
};
