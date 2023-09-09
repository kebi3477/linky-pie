import * as multer from 'multer';
import * as path from 'path';

export const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, process.env.UPLOAD_DIR);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    })
};
