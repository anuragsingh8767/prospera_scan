import * as authService from '../Services/dbx.auth.service.js';

const validatee = async (req, res) => {
    await authService.validatee(res);
};

const callback = async (req, res) => {
    authService.callback(req, res);
};

export { validatee, callback };