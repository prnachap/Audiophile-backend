import config from 'config';
import { type NextFunction, type Request, type Response } from 'express';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import lte from 'lodash/lte';
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
import { createUser, findOneByEmail } from '../services/user.service';
import { getPasswordResetMail, getVerficationEmail } from '../utils/emailTemplates';
import ErrorResponse from '../utils/errorResponse';
import { sendEmail } from '../utils/sendEmail';
import { MESSAGES } from '../constants/messages';

const supportEmail = config.get<string>('userEmail');
const clientURL = config.get<string>('clientRedirectUrl');

export const createUserHandler = async (
  req: Request<unknown, unknown, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;
  const user = await findOneByEmail(email);
  if (!isEmpty(user)) {
    next(new ErrorResponse(MESSAGES.USER_ALREADY_EXISTS, 400));
    return;
  }
  try {
    const newUser = await createUser({ email, name, password });
    return res.status(200).json({ data: newUser });
  } catch (error) {
    logger.error(error);
    next(error);
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
      next(new ErrorResponse(MESSAGES.USER_NOT_FOUND, 400));
      return;
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

    res.status(200).json({ data: MESSAGES.VERIFICATION_EMAIL_SENT });
  } catch (error: any) {
    logger.error(error);
    next(error);
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
      next(new ErrorResponse(MESSAGES.USER_NOT_FOUND, 400));
      return;
    }
    if (!isEqual(verificationId, user.verificationCode)) {
      next(new ErrorResponse(MESSAGES.INVALID_TOKEN, 400));
      return;
    }

    if (lte(user.verificiationTokenExpiry, currentDate)) {
      next(new ErrorResponse(MESSAGES.TOKEN_EXPIRED, 200));
      return;
    }
    user.verified = true;
    await user.save();
    res.status(200).redirect(clientURL);
  } catch (error: any) {
    logger.error(error);
    next(error);
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
      next(new ErrorResponse(MESSAGES.EMAIL_NOT_REGISTERED, 400));
      return;
    }
    if (!user.verified) {
      next(new ErrorResponse(MESSAGES.USER_NOT_VERIFIED, 400));
      return;
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
    res.status(200).json({ data: message });
  } catch (error: any) {
    logger.error(error);
    next(error);
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
      next(new ErrorResponse(MESSAGES.INVALID_USER, 400));
      return;
    }
    if (!isEqual(user.verificationCode, token)) {
      next(new ErrorResponse(MESSAGES.INVALID_TOKEN, 400));
      return;
    }
    if (lte(user.passwordTokenExpiry, currentDate)) {
      next(new ErrorResponse(MESSAGES.TOKEN_EXPIRED, 400));
      return;
    }
    user.password = password;
    await user.save();
    return res.status(200).json({ data: MESSAGES.PASSWORD_CHANGED });
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
};
