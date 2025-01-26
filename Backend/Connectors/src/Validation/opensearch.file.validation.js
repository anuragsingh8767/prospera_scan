import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        indexname: Joi.string().required(),
        id: Joi.string().required(),
    }),
};



const readfile = {
    param: Joi.object().keys({
        downloadPath: Joi.string().required(),
        indexname: Joi.string().required(),
        id: Joi.string().required(),
    }),
};


const downloadfile = {
    param: Joi.object().keys({
        schema: Joi.string().required(),
        table: Joi.string().required(),
        path: Joi.string().required(),
    }),
};

const listfile = {
    body: Joi.object().keys({
        index: Joi.string().allow('').required(),
        folderid: Joi.number().allow('').required(),
        offset: Joi.number().required(),
        limit: Joi.number().required(),
        page: Joi.number().required(),
    }),
};



export {downloadfile, deletefile, listfile, readfile };