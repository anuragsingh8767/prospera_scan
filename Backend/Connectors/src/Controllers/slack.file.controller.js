import * as fileService from '../Services/slack.file.services.js';

const deleteFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.deleteFile(fileId,req, res);
};

const uploadFile = (req, res) => {
    const { channel, filepath, fileComment } = req.query;
    fileService.uploadFile(channel, filepath, fileComment, req,res)
};

const listFiles = async (req, res) => {
    const { pageToken , pageSize} = req.body;
    fileService.listFiles(pageToken, pageSize, req,res);
};

const downloadFile = async (req, res) => {
    const { fileId, downloadpath } = req.query;
    await fileService.downloadFile(fileId, downloadpath,req,res);
};

const readFile = async (req, res) => {
    const { fileId } = req.query;
    fileService.readFile( fileId,req, res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
