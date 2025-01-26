import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        fileId: Joi.string().required(),
    }),
};

const uploadfile = {
    param: Joi.object().keys({
        channel: Joi.string().required(),
        filepath: Joi.string().required(),
        fileComment: Joi.string().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        pageToken: Joi.string().allow('').required(),
        pageSize: Joi.number().required(),
        // channel: Joi.string().required(),
    }),
};

const downloadfile = {
    param: Joi.object().keys({
        fileId: Joi.string().required(),
        downloadpath: Joi.string().required(),
    }),
};

const readfile = {
    param: Joi.object().keys({
        fileId: Joi.string().required(),
    }),
};

export { deletefile, uploadfile, listfile, downloadfile, readfile };