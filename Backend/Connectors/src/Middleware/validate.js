import Joi from 'joi';
import pick from '../Utils/pick.js';
import ApiError from '../Utils/ApiError.js';

const validate = (schema) => (req, res, next) => {
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
};

export default validate;