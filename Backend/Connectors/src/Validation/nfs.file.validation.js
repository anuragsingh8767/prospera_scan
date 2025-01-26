import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        filename: Joi.string().required(),
    }),
};

const uploadfile = {
    body: Joi.object().keys({
        localFilePath: Joi.string().required(),
        remoteFilePath: Joi.string().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        remoteFolderPath: Joi.string().allow('').required(),
        page: Joi.number().required(),
        limit: Joi.number().required(),
        offset: Joi.number().required()
    }),
};

const downloadfile = {
    param: Joi.object().keys({
        filename: Joi.string().required(),
        downloadPath: Joi.string().required(),
    }),
};

const readfile = {
    param: Joi.object().keys({
        filename: Joi.string().required(),
    }),
};

export  { deletefile, uploadfile, listfile, downloadfile, readfile };