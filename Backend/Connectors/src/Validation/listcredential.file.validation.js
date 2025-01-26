import Joi from 'joi';

const listcredential = {
    body: Joi.object().keys({
        type_id: Joi.number().required(),
    }),
};


export {listcredential}