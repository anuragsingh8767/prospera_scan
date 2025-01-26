import * as authService from '../Services/box.auth.services.js';

const validatee = async (req, res) => {
    authService.validatee(res);
};

const callback = async (req, res) => {
    authService.callback(req, res);
};

export { validatee, callback };