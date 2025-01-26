import Joi from 'joi';

const testfile = {
    body: Joi.object().keys({
        cred_name: Joi.string().required(),
        type: Joi.string().required(),
    }),
}

export  { testfile };