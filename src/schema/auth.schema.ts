import { type TypeOf, object, string } from 'zod';

export const authenticateUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is mandatory' }).email('Invalid Email'),
    password: string({ required_error: 'Password is mandatory' }),
  }),
});

export type AuthenticateUserInput = TypeOf<typeof authenticateUserSchema>['body'];
