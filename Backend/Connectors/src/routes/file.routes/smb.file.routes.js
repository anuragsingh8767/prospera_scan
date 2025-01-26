import express from 'express';
import * as fileValidation from '../../Validation/smb.file.validation.js';
import * as fileController from '../../Controllers/smb.file.controller.js';
import validate from '../../Middleware/validate.js';

const router = express.Router();

router
    .route('/upload')
    .post(validate(fileValidation.uploadfile), fileController.uploadFile);

router
    .route('/download')
    .get(validate(fileValidation.downloadfile), fileController.downloadFile);

router
    .route('/list')
    .post(validate(fileValidation.listfile), fileController.listFiles);

router
    .route('/delete')
    .delete(validate(fileValidation.deletefile), fileController.deleteFile);

router
    .route('/read')
    .get(validate(fileValidation.readfile), fileController.readFile);

export default router;