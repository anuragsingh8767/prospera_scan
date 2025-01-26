import joi from 'joi';

const listFiles = joi.object().keys({
    body:{
        folderId : joi.string().allow('').required(),
        indexName : joi.string().allow('').required(),
        limit : joi.number().required(),
        offset : joi.string().required(),
    }
});

const deleteFile = joi.object().keys({
    param:{
        fileId : joi.string().required()
    }
});

const readFile = joi.object().keys({
    body:{
        fileId : joi.string().required(),
    }
});

const uploadFile = joi.object().keys({
    param:{
        filePath: joi.string().required(),
        indexName: joi.string().allow('').required(),
    }
});

const downloadFile = joi.object().keys({
    param:{
        fileId: joi.string().required(),
        downloadpath: joi.string().required(),
    }
});

export { listFiles, uploadFile, downloadFile, deleteFile, readFile };