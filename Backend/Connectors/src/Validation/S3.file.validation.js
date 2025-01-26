import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        bucketname: Joi.string().required(),
        filename: Joi.string().required(),
    }),
};

const uploadfile = {
    param: Joi.object().keys({
        bucketname: Joi.string().required(),
        filepath: Joi.string().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        bucketname: Joi.string().required(),
        pageSize: Joi.number().required(),
        continuationToken: Joi.string().allow('').required(),
    }),
};

const downloadfile = {
    param: Joi.object().keys({
        bucketname: Joi.string().required(),
        filename: Joi.string().required(),
        downloadpath: Joi.string().required(),
    }),
};

const readfile = {
    param: Joi.object().keys({
        bucketname: Joi.string().required(),
        filepath: Joi.string().required(),
    }),
};

export { deletefile, uploadfile, listfile, downloadfile, readfile };