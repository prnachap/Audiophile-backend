import config from 'config';
import express, { type Request, type Response } from 'express';
import passport from 'passport';
import { authenticateUserHandler, logoutUserHandler } from '../contoller/auth.contoller';
import { protect } from '../middleware/protect';
import { validateResource } from '../middleware/validateResource';
import { authenticateUserSchema } from '../schema/auth.schema';

const authRouter = express.Router();
const redirectUrl = config.get<string>('clientRedirectUrl');

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${redirectUrl}/login` }),
  function (_req: Request, res: Response) {
    res.redirect(redirectUrl);
  }
);

authRouter.post(
  '/login',
  validateResource(authenticateUserSchema),
  passport.authenticate('local', { failureRedirect: redirectUrl, failureMessage: 'Invalid Email or Password' }),
  authenticateUserHandler
);
authRouter.post('/logout', protect, logoutUserHandler);

export default authRouter;
