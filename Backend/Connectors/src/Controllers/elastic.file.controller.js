import * as fileServices from '../Services/elastic.file.services.js';

const listFiles = async (req, res) => {
    const { folderId, indexName, limit, offset } = req.body;
    fileServices.listFiles(folderId, indexName, limit, offset, req,res);
}

const deleteFile = async (req, res) => {
    const { fileId } = req.query;
    fileServices.deleteFile(fileId,req, res);
}

const readFile = async (req, res) => {
    const { fileId } = req.body;
    fileServices.readFile(fileId, req,res);
}

const uploadFile = async (req, res) => {
    const { filePath, indexName } = req.query;
    fileServices.uploadFile(filePath, indexName,req, res);
}

const downloadFile = async (req, res) => {
    const { fileId, downloadpath } = req.query;
    fileServices.downloadFile(fileId, downloadpath,req, res);
}

export { listFiles, uploadFile, downloadFile, deleteFile, readFile};