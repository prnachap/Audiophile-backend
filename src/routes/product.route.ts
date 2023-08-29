import express from 'express';
import { createProductHandler, uploadHandler } from '../contoller/product.controller';

const productRouter = express.Router();

// productRouter.post('/create', protect, validateResource(createProductSchema), createProductHandler);
productRouter.post('/create', uploadHandler, createProductHandler);

export default productRouter;
