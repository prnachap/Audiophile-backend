import express from 'express';
import {
  createUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  sendVerificationHandler,
  userVerificationHandler,
} from '../contoller/user.controller';
import { validateResource } from '../middleware/validateResource';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendVerificationSchema,
  userVerficationSchema,
} from '../schema/user.schema';
import { protect } from '../middleware/protect';

const userRouter = express.Router();

userRouter.post('/register', validateResource(createUserSchema), createUserHandler);

userRouter.post('/forgot-password', validateResource(forgotPasswordSchema), forgotPasswordHandler);

userRouter.post('/send-verification', protect, validateResource(sendVerificationSchema), sendVerificationHandler);

userRouter.get(
  '/verify-user/:verificationId/:userId',
  protect,
  validateResource(userVerficationSchema),
  userVerificationHandler
);

userRouter.post('/reset-password', validateResource(resetPasswordSchema), resetPasswordHandler);

export default userRouter;
