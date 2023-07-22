import config from 'config';
import { type NextFunction, type Request, type Response } from 'express';
import isEqual from 'lodash/isEqual';
import lte from 'lodash/lte';
import isEmpty from 'lodash/isEmpty';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../logger';
import UserModel from '../model/user.model';
import {
  type CreateUserInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type UserVerificationInput,
  type sendVerificationInput,
} from '../schema/user.schema';
import { createUser } from '../services/user.service';
import { getPasswordResetMail, getVerficationEmail } from '../utils/emailTemplates';
import { sendEmail } from '../utils/sendEmail';

const supportEmail = config.get<string>('userEmail');
const clientURL = config.get<string>('clientRedirectUrl');

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

export const sendVerificationHandler = async (
  req: Request<unknown, unknown, sendVerificationInput>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (isEmpty(user)) {
      return res.status(400).json({ message: 'user not found' });
    }
    const token = uuidv4();
    user.verificationCode = token;
    user.verificiationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const verificationURL = `http://localhost:5000/api/v1/users/verify-user/${token}/${user?.id as string}`;

    await sendEmail({
      to: user.email,
      from: supportEmail,
      subject: 'Account Verification',
      html: getVerficationEmail({ name: user.name, verificationURL }),
    });

    res.status(200).json({ message: 'verification email sent' });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const userVerificationHandler = async (
  req: Request<UserVerificationInput>,
  res: Response,
  next: NextFunction
) => {
  const { userId, verificationId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    const currentDate = Date.now();

    if (isEmpty(user)) {
      return res.status(200).json({ message: 'user not found' });
    }
    if (!isEqual(verificationId, user.verificationCode)) {
      return res.status(200).json({ message: 'Invalid Token Id' });
    }

    if (lte(user.verificiationTokenExpiry, currentDate)) {
      return res.status(200).json({ message: 'Token has expired' });
    }
    user.verified = true;
    await user.save();
    res.status(200).redirect(clientURL);
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordHandler = async (
  req: Request<unknown, unknown, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const message = 'The reset password contained in the email sent to the user';
  try {
    const user = await UserModel.findOne({ email });
    if (isEmpty(user)) {
      return res.status(200).json({ message: 'email not registered' });
    }
    if (!user.verified) {
      return res.status(200).json({ meassge: 'user not verified' });
    }
    const token = uuidv4();
    user.verificationCode = token;
    user.passwordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendEmail({
      from: supportEmail,
      to: email,
      subject: 'Password Reset Token',
      html: getPasswordResetMail({ name: user.name, token }),
    });
    res.status(200).json({ message });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (
  req: Request<unknown, unknown, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, token } = req.body;

    const user = await UserModel.findOne({ email });
    const currentDate = Date.now();
    if (isEmpty(user)) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    if (!isEqual(user.verificationCode, token)) {
      return res.status(200).json({ message: 'Invalid token' });
    }
    if (lte(user.passwordTokenExpiry, currentDate)) {
      return res.status(200).json({ message: 'Token expired' });
    }
    user.password = password;
    await user.save();
    return res.status(200).json({ message: 'password changed' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
};
