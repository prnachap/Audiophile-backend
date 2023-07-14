import config from 'config';
import express from 'express';
import passport from 'passport';
import { authenticateUserHandler, logoutUserHandler } from '../contoller/auth.contoller';
import { validateResource } from '../middleware/validateResource';
import { authenticateUserSchema } from '../schema/auth.schema';
import { protect } from '../middleware/protect';

const authRouter = express.Router();
const redirectUrl = config.get<string>('clientRedirectUrl');

authRouter.post(
  '/login',
  validateResource(authenticateUserSchema),
  passport.authenticate('local', { failureRedirect: redirectUrl, failureMessage: 'Invalid Email or Password' }),
  authenticateUserHandler
);
authRouter.post('/logout', protect, logoutUserHandler);

export default authRouter;
