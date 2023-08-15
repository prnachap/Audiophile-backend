import { type NextFunction, type Request, type Response } from 'express';
import isEmpty from 'lodash/isEmpty';
import { type AuthenticateUserInput } from '../schema/auth.schema';
import ErrorResponse from '../utils/errorResponse';
import { MESSAGES } from '../constants/messages';

export const authenticateUserHandler = async (
  req: Request<unknown, unknown, AuthenticateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const authenticatedUser = req.user;
  if (isEmpty(authenticatedUser)) {
    next(new ErrorResponse(MESSAGES.INVALID_EMAIL_PASSWORD, 401));
    return;
  }
  return res.status(200).json({ data: authenticatedUser });
};

export const logoutUserHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logOut({}, function (err) {
      if (err) {
        next(err);
      }
    });
  } catch (error: any) {
    next(error);
  }
  res.status(200).json({ isAuthenticated: req.isAuthenticated() });
};
