import * as fileService from '../Services/opensearch.file.services.js';

const deleteFile = async (req, res) => {
    const {indexname,id} = req.query;
    fileService.deleteFile(indexname, id,req,res);
};



const readFile = async (req, res) => {
    const {downloadPath,indexname,id} = req.query;
    fileService.readFile(downloadPath, indexname,id,req, res);
};


const downloadFile = async (req, res) => {
    const {schema,table,path } = req.query;
    await fileService.downloadFile(schema,table,path,req,res);
};

const listFiles = async (req, res) => {
    const {index, folderid,offset,limit,page } = req.body;
    fileService.listFiles(index,folderid,offset,limit,page,req, res)
};



export { deleteFile, downloadFile, listFiles, readFile};
