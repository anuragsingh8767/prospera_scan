import * as fileService from '../Services/nfs.file.services.js';

const deleteFile = async (req, res) => {
    const { filename } = req.query;
    fileService.deleteFile(filename, req,res);
};

const uploadFile = (req, res) => {
    const { localFilePath, remoteFilePath } = req.body; // Assuming filepath is passed as a query parameter
    fileService.uploadFile(localFilePath, remoteFilePath, req,res)
};

const listFiles = async (req, res) => {
    const { remoteFolderPath, page, limit,offset } = req.body;
    fileService.listFiles(remoteFolderPath, page, limit,offset,req,res);
};

const downloadFile = async (req, res) => {
    const { filename, downloadPath } = req.query;
    await fileService.downloadFile(filename,downloadPath,req,res);
};

const readFile = async (req, res) => {
    const { filename } = req.query;
    fileService.readFile( filename, req,res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
