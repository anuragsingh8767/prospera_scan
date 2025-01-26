import * as fileService from '../Services/dbx.file.services.js';

const deleteFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.deleteFile(fileId,res);
};

const uploadFile = (req, res) => {
    const { filepath, folderId } = req.query; // Assuming filepath is passed as a query parameter
    fileService.uploadFile(folderId, filepath, res)
};

const listFiles = async (req, res) => {
    const { folderId, cursor, limit } = req.body;
    fileService.listFiles(folderId, cursor, limit, res);
};

const downloadFile = async (req, res) => {
    const { fileId, downloadpath } = req.query;
    fileService.downloadFile(fileId, downloadpath,res);
};

const readFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.readFile( fileId, res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
