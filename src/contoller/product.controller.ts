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
import { type User } from '../model/user.model';
import type mongoose from 'mongoose';
import { findUser } from '../services/user.service';
import { gt, isEqual } from 'lodash';

const upload = multerInstance.single('uploaded_file');
type RequestUserType = User & { _id: mongoose.Types.ObjectId };

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
    const { _id, email } = req.user as RequestUserType;
    const imagePath = req.file?.path;
    const createdBy = _id;
    const user = await findUser({ email });
    if (isEmpty(user)) {
      next(new ErrorResponse(MESSAGES.USER_NOT_FOUND, 400));
      return;
    }
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
      createdBy,
    });
    user.products.push(newProduct.id);
    await user.save();
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
    const { _id } = req.user as RequestUserType;
    const { productId } = req.params;
    const existingProduct = await findProduct({ _id: productId });

    if (!isEqual(existingProduct?.createdBy, _id)) {
      next(new ErrorResponse(MESSAGES.NOT_AUTHORIZED, 403));
      return;
    }

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
    const { _id, email } = req.user as RequestUserType;

    const existingProduct = await findProduct({ _id: productId });
    const user = await findUser({ email });
    const productIndexInUser = user?.products.findIndex((product) =>
      isEqual((product as mongoose.Types.ObjectId).toString(), productId)
    );

    if (!isEqual(existingProduct?.createdBy, _id)) {
      next(new ErrorResponse(MESSAGES.NOT_AUTHORIZED, 403));
      return;
    }

    if (isEmpty(existingProduct)) {
      next(new ErrorResponse(MESSAGES.PRODUCT_DOESNOT_EXISTS, 400));
      return;
    }
    await deleteProduct({ _id: productId });
    if (gt(productIndexInUser, -1)) {
      user?.products.splice(productIndexInUser as number, 1);
      await user?.save();
    }

    unlinkSync(existingProduct.imagePath);
    res.status(200).json({ data: MESSAGES.PRODUCT_DELETED });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
