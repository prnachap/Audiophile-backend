import multer from 'multer';
import { MESSAGES } from '../constants/messages';

/**
 * Multer Storage Config
 */
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now();
    cb(null, `${uniquePrefix}-${file.originalname}`);
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
