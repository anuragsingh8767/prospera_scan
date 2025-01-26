import * as fileService from '../Services/gdrive.file.services.js';

const deleteFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.deleteFile(fileId ,req,res);
};

const uploadFile = (req, res) => {
    const { name, filepath, folderId } = req.query; // Assuming filepath is passed as a query parameter
    fileService.uploadFile(name, filepath, folderId, req,res)
};

const listFiles = async (req, res) => {
    const { folderId, limit, pageToken} = req.body;
    fileService.listFiles(folderId, limit, pageToken,req, res);
};

const downloadFile = async (req, res) => {
    const { fileId, downloadpath } = req.query;
    await fileService.downloadFile(fileId, downloadpath, req,res);
};

const readFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.readFile( fileId,req, res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
