import isEqual from 'lodash/isEqual';
import { object, string, type TypeOf } from 'zod';

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

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
