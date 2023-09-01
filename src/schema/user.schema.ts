import isEqual from 'lodash/isEqual';
import { object, string, type TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserSchema:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           default: john doe
 *         email:
 *           type: number
 *           default: johndoe@example.com
 *         password:
 *           type: string
 *           default: strongpassword123
 *         confirmPassword:
 *           type: string
 *           default: strongpassword123
 *         verificationCode:
 *           type: string
 *           default: 123
 *         verified:
 *           type: boolean
 *           default: false
 */

export const createUserSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }).min(3, 'Name is too short - should be at least 3 characters'),
    email: string({ required_error: 'Email is required' }).email('Not a valid email'),
    password: string({ required_error: 'Password is required' }).min(
      3,
      'Password is too short - should be at least 8 characters'
    ),
    confirmPassword: string({ required_error: 'Confirm Password is required' }),
  }).refine((data) => isEqual(data.password, data.confirmPassword), {
    message: 'Passwords donot match',
    path: ['confirmPassword'],
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email('Invalid email'),
  }),
});

export const userVerficationSchema = object({
  params: object({
    verificationId: string({ required_error: 'verification token is required' }),
    userId: string({ required_error: 'user id is required' }),
  }),
});

export const sendVerificationSchema = object({
  body: object({
    userId: string({ required_error: 'user id is required' }),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    token: string({ required_error: 'token is required' }),
    email: string({ required_error: 'email is required' }).email('Invalid email'),
    password: string({ required_error: 'password is mandatory' }).min(
      8,
      'Password is too short - should be at least 8 characters'
    ),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type UserVerificationInput = TypeOf<typeof userVerficationSchema>['params'];
export type sendVerificationInput = TypeOf<typeof sendVerificationSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];
