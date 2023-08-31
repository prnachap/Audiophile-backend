import { type NextFunction, type Request, type Response } from 'express';
import { unlinkSync } from 'fs';
import isEmpty from 'lodash/isEmpty';
import multer from 'multer';
import logger from '../../logger';
import { MESSAGES } from '../constants/messages';
import { type Category } from '../model/product.model';
import { type CreateProductInput, type DeleteProductInput, type UpdateProductInput } from '../schema/product.schema';
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from '../services/product.service';
import ErrorResponse from '../utils/errorResponse';
import multerInstance from '../utils/multerInstance';

const upload = multerInstance.single('uploaded_file');

export const uploadHandler = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new ErrorResponse(err.message, 500));
    } else if (err) {
      next(new ErrorResponse(MESSAGES.SERVER_ERROR, 500));
    }
    next();
  });
};

// @desc   Create Product
// @route  Post api/v1/product
// @access Private
export const createProductHandler = async (
  req: Request<unknown, unknown, CreateProductInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, category, description, feature, price } = req.body;
    const imagePath = req.file?.path;
    const existingProduct = await findProduct({ name });
    if (!isEmpty(existingProduct)) {
      next(new ErrorResponse(MESSAGES.PRODUCT_EXISTS, 400));
      return;
    }
    const newProduct = await createProduct({
      category: category as Category,
      description,
      feature,
      name,
      price: parseInt(price),
      imagePath,
    });
    res.status(200).json({ data: newProduct });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc   Update Product
// @route  Put api/v1/product/:productId
// @access Private
export const updateProductHandler = async (
  req: Request<UpdateProductInput['params'], unknown, UpdateProductInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const existingProduct = await findProduct({ _id: productId });
    if (isEmpty(existingProduct)) {
      next(new ErrorResponse(MESSAGES.PRODUCT_DOESNOT_EXISTS, 400));
      return;
    }
    const updatedProduct = await findAndUpdateProduct({ _id: productId }, { ...req.body }, { new: true });
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc   Delete Product
// @route  Delete api/v1/product/:productId
// @access Private
export const deleteProductHandler = async (req: Request<DeleteProductInput>, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const existingProduct = await findProduct({ _id: productId });
    if (isEmpty(existingProduct)) {
      next(new ErrorResponse(MESSAGES.PRODUCT_DOESNOT_EXISTS, 400));
      return;
    }
    await deleteProduct({ _id: productId });
    unlinkSync(existingProduct.imagePath);
    res.status(200).json({ data: MESSAGES.PRODUCT_DELETED });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
