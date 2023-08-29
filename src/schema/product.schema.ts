import { object, string, number, type TypeOf } from 'zod';

export const createProductSchema = object({
  body: object({
    name: string({ required_error: 'Name is mandatory' }).min(3, 'Product name must be at least 4 characters long.'),
    price: number({ required_error: 'Price is mandatory' }),
    description: string({ required_error: 'Description is mandatory' }),
    feature: string({ required_error: 'Feature is mandatory' }),
    boxContent: object({
      quantity: number(),
      name: string(),
    }),
  }),
});
export type CreateProductInput = TypeOf<typeof createProductSchema>['body'];
