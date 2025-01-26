import express from 'express';
import * as fileValidation from '../Validation/listcredential.file.validation.js';
import * as fileController from '../Controllers/listcredentials.file.controller.js';
import authenticate from '../Middleware/authenticate.js';

const router = express.Router();

router
    .route('/list')
    .post(authenticate(fileValidation.listcredential), fileController.listcreds);

export default router;