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

/**
 * @openapi
 * '/api/v1/auth/login':
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@example.com
 *              password:
 *                type: string
 *                default: strongpassword
 *
 *    responses:
 *      200:
 *        description: success
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   default: john doe
 *                 email:
 *                   type: string
 *                   default: johndoe@example.com
 *                 password:
 *                   type: string
 *                   default: testpassword
 *                 verified:
 *                   type: boolean
 *                   default: false
 *                 verificationCode:
 *                   type: string
 *                   default: 123
 *                 createdAt:
 *                   type: string
 *                   default: 2023-09-01T04:14:59.662Z
 *                 updatedAt:
 *                   type: string
 *                   default: 2023-09-01T04:14:59.662Z
 *                 __V:
 *                   type: number
 *                   default: 0
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server Error
 */
authRouter.post(
  '/login',
  validateResource(authenticateUserSchema),
  passport.authenticate('local', { failureRedirect: redirectUrl, failureMessage: 'Invalid Email or Password' }),
  authenticateUserHandler
);

/**
 * @openapi
 * '/api/v1/auth/logout':
 *  post:
 *    tags:
 *      - Auth
 *    summary: Logout User
 *    responses:
 *      200:
 *        description: success
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   default: false
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server Error
 */
authRouter.post('/logout', protect, logoutUserHandler);

export default authRouter;
