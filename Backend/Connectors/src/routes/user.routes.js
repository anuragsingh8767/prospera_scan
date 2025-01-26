import express from 'express';
import * as userController from '../Controllers/user.controller.js';
import * as userValidation from '../Validation/user.validation.js';
import validate from '../Middleware/validate.js';
import authenticate from '../Middleware/authenticate.js';

const router = express.Router();

router 
    .route('/create')
    .post(validate(userValidation.createUser), userController.createUser);

router 
    .route('/login')
    .post(validate(userValidation.loginUser), userController.loginUser);
router 
    .route('/test')
    .get(authenticate(userValidation.testtoken), userController.testtoken);

export default router;