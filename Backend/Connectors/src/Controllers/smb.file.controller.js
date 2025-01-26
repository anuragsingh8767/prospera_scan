import * as fileService from '../Services/smb.file.services.js';

const deleteFile = async (req, res) => {
    const { remoteFilePath } = req.query;
    fileService.deleteFile(remoteFilePath, req, res);
};

const uploadFile = (req, res) => {
    const { localFilePath, remoteFilePath } = req.body; // Assuming filepath is passed as a query parameter
    fileService.uploadFile(localFilePath, remoteFilePath, req, res)
};

const listFiles = async (req, res) => {
    const { remotefoldername, page, limit } = req.body;
    fileService.listFiles(remotefoldername , page, limit,req, res);
};

const downloadFile = async (req, res) => {
    const { remoteFilepath, localFilePath } = req.query;
    await fileService.downloadFile(remoteFilepath, localFilePath,req, res);
};

const readFile = async (req, res) => {
    const { remoteFilePath } = req.query;
    fileService.readFile( remoteFilePath, req, res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
