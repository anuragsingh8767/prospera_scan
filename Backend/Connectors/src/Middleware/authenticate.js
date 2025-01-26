// Dotenv Configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });
const secretKey = process.env.SECRET_KEY; // Make sure to use the same secret key used for signing the token


import jwt from 'jsonwebtoken';
import ApiError from '../Utils/ApiError.js';
import httpStatus from 'http-status';
import Joi from 'joi';
import pick from '../Utils/pick.js';


function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next(); // Only call next() if token is valid
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send('Token has expired');
        }
        return res.status(401).send('Invalid Token');
    }
}


const authenticate = (schema) => (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
        }

        const validSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validSchema));
        const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, allowUnknown: true })
        .validate(object, { presence: 'optional' });

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return res.send(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
    });
};


export default authenticate;