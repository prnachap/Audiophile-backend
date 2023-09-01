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

/**
 * @openapi
 * '/api/v1/users/register':
 *   post:
 *     tags:
 *       - User
 *     summary: Register User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSchema'
 *     responses:
 *       200:
 *         description: Success
 *         content:
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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 */

userRouter.post('/register', validateResource(createUserSchema), createUserHandler);

/**
 * @openapi
 * '/api/v1/users/forgot-password':
 *   post:
 *     tags:
 *       - User
 *     summary: Forgot Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@example.com
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   default: "password reset link sent"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 */

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
