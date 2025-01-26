import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        remoteFilepPath: Joi.string().required(),
    }),
};

const uploadfile = {
    body: Joi.object().keys({
        localFilePath: Joi.string().required(),
        remoteFilepPath: Joi.string().required(),
        cred_name: Joi.string().required(),
        type: Joi.string().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        remotefoldername: Joi.string().allow('').required(),
        page: Joi.number().required(),
        limit: Joi.number().required(),
    }),
};

const downloadfile = {
    param: Joi.object().keys({
        remoteFilePath: Joi.string().required(),
        localFilePath: Joi.string().required(),
    }),
};

const readfile = {
    param: Joi.object().keys({
        remoteFilePath: Joi.string().required(),
    }),
};

export { deletefile, uploadfile, listfile, downloadfile, readfile };