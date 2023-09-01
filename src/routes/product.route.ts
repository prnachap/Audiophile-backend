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

/**
 * @openapi
 * '/api/v1/product':
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductSchema'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   feature:
 *                     type: string
 *                   boxContent:
 *                     type: array
 *                   createdAt:
 *                     type: date-time
 *                   updatedAt:
 *                     type: date-time
 *                   _v:
 *                     type: number
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 */
productRouter.post('/', protect, uploadHandler, validateResource(createProductSchema), createProductHandler);

/**
 * @openapi
 * '/api/v1/product/{productId}':
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductSchema'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   feature:
 *                     type: string
 *                   boxContent:
 *                     type: array
 *                   createdAt:
 *                     type: date-time
 *                   updatedAt:
 *                     type: date-time
 *                   _v:
 *                     type: number
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 */

productRouter.put('/:productId', protect, uploadHandler, validateResource(updateProductSchema), updateProductHandler);

/**
 * @openapi
 * '/api/v1/product/{productId}':
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
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
 *                   default: product deleted
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 */

productRouter.delete('/:productId', protect, validateResource(deleteProductSchema), deleteProductHandler);

export default productRouter;
