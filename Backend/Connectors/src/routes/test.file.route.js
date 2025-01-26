import express from 'express';
import * as fileController from '../Controllers/test.file.controller.js';
import * as fileValidation from '../Validation/test.file.validation.js';
import authenticate from '../Middleware/authenticate.js';


const router = express.Router();

router
    .route('/test')
    .post(authenticate(fileValidation.testfile), fileController.testFile);

export default router;  