import { type NextFunction, type Request, type Response } from 'express';
import isEmpty from 'lodash/isEmpty';
import { type AuthenticateUserInput } from '../schema/auth.schema';

export const authenticateUserHandler = async (
  req: Request<unknown, unknown, AuthenticateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const authenticatedUser = req.user;
  if (isEmpty(authenticatedUser)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  return res.status(200).json({ data: authenticatedUser });
};

export const logoutUserHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logOut({}, function (err) {
      if (err) {
        res.status(500).json({ message: err.message });
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
  res.status(200).json({ isAuthenticated: req.isAuthenticated() });
};
