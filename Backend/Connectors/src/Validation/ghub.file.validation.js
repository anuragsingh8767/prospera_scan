import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        repo: Joi.string().required(),
        id: Joi.string().required(),
        message: Joi.string().required(),
    }),
};

const uploadfile = {
    body: Joi.object().keys({
        repo: Joi.string().required(),
        path: Joi.string().allow('').required(),
        message : Joi.string().allow('').required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        repo : Joi.string().required(),
        path: Joi.string().allow('').required(),
        limit: Joi.number().required(),
        page: Joi.number().required(),
    }),
};

const downloadfile = {
    param: Joi.object().keys({
        repo: Joi.string().required(),
        downloadpath: Joi.string().required(),
    }),
};

const readfile = {
    param: Joi.object().keys({
        repo: Joi.string().required(),
        fileId: Joi.string().required(),
    }),
};

export { deletefile, uploadfile, listfile, downloadfile, readfile};