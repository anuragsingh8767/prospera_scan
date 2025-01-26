import express from 'express';
import authenticate from '../Middleware/authenticate.js';
import * as conTypeValidation from '../Validation/conType.validation.js';
import * as conTypeController from '../Controllers/conType.controller.js';

const router = express.Router();

router
    .route('/list')
    .get(authenticate(conTypeValidation.listConType), conTypeController.listConType);

router
    .route('/creds')
    .get(authenticate(conTypeValidation.listConTypeCreds), conTypeController.listConTypeCreds);

export default router;