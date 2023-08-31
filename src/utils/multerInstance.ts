import { type Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import logger from '../../logger';
import { MESSAGES } from '../constants/messages';
import { type CreateProductInput } from '../schema/product.schema';

/**
 * Multer Storage Config
 */
const storage = multer.diskStorage({
  destination: function (req, _file, cb) {
    const folderPath = path.join(__dirname, '..', '..', 'uploads', req.body.category);
    const isRequiredFolderExists = fs.existsSync(folderPath);
    if (!isRequiredFolderExists) {
      fs.mkdir(folderPath, (error) => {
        if (error) {
          logger.error(error.message);
          cb(new Error(MESSAGES.INVALID_DESTINATION), folderPath);
          // eslint-disable-next-line no-useless-return
          return;
        }
      });
    }
    cb(null, folderPath);
  },
  filename: function (req: Request<unknown, unknown, CreateProductInput>, file, cb) {
    const fileName = `${req?.body?.name}-${req?.body?.description}`;
    const fileExtension = path.extname(file.originalname);
    const updatedFileName = `${fileName}${fileExtension}`;
    // const filePath = path.join(__dirname, '..', '..', 'uploads', req.body.category, updatedFileName);

    // const isFileExists = fs.existsSync(filePath);
    // if (isFileExists) {
    //   fs.unlink(filePath, (error) => {
    //     if (error) {
    //       logger.error(error.message);
    //       cb(error, updatedFileName);
    //       // eslint-disable-next-line no-useless-return
    //       return;
    //     }
    //   });
    // }

    cb(null, updatedFileName);
  },
});
export default multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(_req, file, callback) {
    if (file.mimetype.includes('image')) {
      callback(null, true);
      return;
    }
    callback(new Error(MESSAGES.INVALID_IMAGE_FILE));
  },
});
