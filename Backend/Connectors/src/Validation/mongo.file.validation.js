import Joi from 'joi';

const deletefile = {
    param: Joi.object().keys({
        collection: Joi.string().required(),
        id: Joi.string().required(),
    }),
};

// const uploadfile = {
//     body: Joi.object().keys({
//         schema: Joi.string().required(),
//         table: Joi.string().required(),
//         record: Joi.object().required(),
//     }),
// };

const readfile = {
    param: Joi.object().keys({
        limit: Joi.number().required(),
        collection: Joi.string().required(),
        page: Joi.number().required(),
        token: Joi.string().required(),
    }),
};


// const downloadfile = {
//     param: Joi.object().keys({
//         schema: Joi.string().required(),
//         table: Joi.string().required(),
//         path: Joi.string().required(),
//     }),
// };

const listfile = {
    body: Joi.object().keys({
        limit: Joi.number().required(),
        page: Joi.number().required(),
        token: Joi.string().allow('').required(),
    }),
};



export { deletefile, listfile, readfile };