import { type Response, type Request, type NextFunction } from 'express';
import UserModel from '../model/user.model';
import { type CreateUserInput } from '../schema/user.schema';
import { isEmpty } from 'lodash';
import { createUser } from '../services/user.service';
import logger from '../../logger';

export const createUserHandler = async (
  req: Request<unknown, unknown, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!isEmpty(user)) {
    return res.status(400).json({ message: 'User already exists, please login' });
  }
  try {
    const newUser = await createUser({ email, name, password });
    return res.status(200).json({ data: newUser });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
