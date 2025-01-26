import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        fileId: Joi.string().required(),
    }),
};

const uploadfile = {
    param: Joi.object().keys({
        filepath: Joi.string().allow('').required(),
        folderId: Joi.string().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        folderId: Joi.string().allow('').required(),
        cursor: Joi.number().allow('').required(),
        limit: Joi.number().required(),
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