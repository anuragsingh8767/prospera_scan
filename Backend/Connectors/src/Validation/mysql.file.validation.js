import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        table: Joi.string().required(),
        id: Joi.number().required(),
    }),
};

const uploadfile = {
    param: Joi.object().keys({
        table: Joi.string().required(),
        filePath: Joi.string().required(),
    }),
};

const insertRecord = {
    body: Joi.object().keys({
        table: Joi.string().required(),
        record: Joi.object().required(),
    }),
};

const updateRecord = {
    body: Joi.object().keys({
        table: Joi.string().required(),
        record: Joi.object().required(),
    }),
};


const listfile = {
    body: Joi.object().keys({
        page: Joi.number().required(),
        limit: Joi.number().required(),
        offset: Joi.number().required(),
    }),
};


const downloadfile = {
    param: Joi.object().keys({
        table: Joi.string().required(),
        path: Joi.string().required(),
    }),
};

const readfile = {
    body: Joi.object().keys({
        table: Joi.string().required(),
        page: Joi.number().required(),
        limit: Joi.number().required(),
        offset: Joi.number().required(),
    }),
};



export { deletefile, uploadfile, listfile, downloadfile, readfile, insertRecord, updateRecord };
