import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        schema: Joi.string().required(),
        table: Joi.string().required(),
        id: Joi.number().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        page: Joi.number().required(),
        limit: Joi.number().required(),
        offset: Joi.number().required(),
        schema: Joi.string().allow('').required(),
    }),
};

const downloadfile = {
    param: Joi.object().keys({
        schema: Joi.string().required(),
        table: Joi.string().required(),
        path: Joi.string().required(),
    }),
};

const readfile = {
    param: Joi.object().keys({
        table: Joi.string().required(),
        schema: Joi.string().required(),
        page: Joi.number().required(),
        limit: Joi.number().required(),
        offset: Joi.number().required(),
        
    }),
};

const updateRecord = {
    body: Joi.object().keys({
        schema: Joi.string().required(),
        table: Joi.string().required(),
        record: Joi.object().required(),
    }),
};

const insertRecord = {
    body: Joi.object().keys({
        schema: Joi.string().required(),
        table: Joi.string().required(),
        record: Joi.object().required(),
    }),
};



export { deletefile, listfile, downloadfile, readfile, updateRecord, insertRecord };