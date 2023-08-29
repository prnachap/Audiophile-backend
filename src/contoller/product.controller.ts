import { type Request, type Response, type NextFunction } from 'express';
import multerInstance from '../utils/multerInstance';
import ErrorResponse from '../utils/errorResponse';
import multer from 'multer';
import { MESSAGES } from '../constants/messages';

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

export const createProductHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'updated' });
};
