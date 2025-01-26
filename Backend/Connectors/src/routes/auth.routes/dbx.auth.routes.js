import express from 'express';
import * as authValidation from '../../Validation/dbx.auth.validation.js';
import * as authController from '../../Controllers/dbx.auth.controller.js';
import validate from '../../Middleware/validate.js';

const router = express.Router();

router
    .route('/')
    .get(validate(authValidation.validatee), authController.validatee);

router
    .route('/callback')
    .get(validate(authValidation.callback), authController.callback);

export default router;