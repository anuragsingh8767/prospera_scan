import * as fileService from '../Services/box.file.services.js';

const deleteFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.deleteFile(fileId,res);
};

const uploadFile = (req, res) => {
    const { folderId, filepath } = req.query;
    fileService.uploadFile(folderId, filepath, res)
};

const listFiles = async (req, res) => {
    const { folderId, offset, limit } = req.body;
    fileService.listFiles(folderId, offset, limit, res);
};

const downloadFile = async (req, res) => {
    const { fileId, downloadpath } = req.query;
    await fileService.downloadFile(fileId, downloadpath,res);
};

const readFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.readFile( fileId, res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
