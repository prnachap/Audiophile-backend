import { object, string, type TypeOf, z } from 'zod';

export const createProductSchema = object({
  body: object({
    name: string({ required_error: 'Name is mandatory' }).min(3, 'Product name must be at least 4 characters long.'),
    price: string({ required_error: 'Price is mandatory' }),
    category: z.enum(['earphones', 'headphones', 'speakers'], { required_error: 'Categories is incorrect' }),
    description: string({ required_error: 'Description is mandatory' }),
    feature: string({ required_error: 'Feature is mandatory' }),
    // boxContent: object({
    //   quantity: number(),
    //   name: string(),
    // })
    //   .optional()
    //   .array(),
  }),
});

export const updateProductSchema = object({
  body: object({
    name: string({ required_error: 'Name is mandatory' }).min(3, 'Product name must be at least 4 characters long.'),
    price: string({ required_error: 'Price is mandatory' }),
    category: z.enum(['earphones', 'headphones', 'speakers'], { required_error: 'Categories is incorrect' }),
    description: string({ required_error: 'Description is mandatory' }),
    feature: string({ required_error: 'Feature is mandatory' }),
  }),
  params: object({
    productId: string({ required_error: 'ProductId is mandatory' }),
  }),
});

export const deleteProductSchema = object({
  params: object({
    productId: string({ required_error: 'ProductId is mandatory' }),
  }),
});
export type CreateProductInput = TypeOf<typeof createProductSchema>['body'];

export type DeleteProductInput = TypeOf<typeof deleteProductSchema>['params'];

export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
