import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        fileId: Joi.string().required(),
    }),
};

const uploadfile = {
    param: Joi.object().keys({
        name: Joi.string().required(),
        filepath: Joi.string().required(),
        folderId: Joi.string().allow('').required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        folderId: Joi.string().allow('').required(),
        limit: Joi.number().required(),
        pageToken: Joi.string().allow('').required(),
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