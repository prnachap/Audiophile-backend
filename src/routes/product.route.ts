import express from 'express';
import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
  uploadHandler,
} from '../contoller/product.controller';
import { validateResource } from '../middleware/validateResource';
import { createProductSchema, deleteProductSchema, updateProductSchema } from '../schema/product.schema';
import { protect } from '../middleware/protect';

const productRouter = express.Router();

productRouter.post('/', protect, uploadHandler, validateResource(createProductSchema), createProductHandler);

productRouter.put('/:productId', protect, uploadHandler, validateResource(updateProductSchema), updateProductHandler);

productRouter.delete('/:productId', protect, validateResource(deleteProductSchema), deleteProductHandler);

export default productRouter;
