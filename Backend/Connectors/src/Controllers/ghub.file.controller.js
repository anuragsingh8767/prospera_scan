import * as fileService from '../Services/ghub.file.services.js';

const deleteFile = async (req, res) => {
    const { repo } = req.query;
    const { id, message } = req.query;
    fileService.deleteFile(repo, id, message,req,res);
};

const uploadFile = (req, res) => {
    const { repo, path, message } = req.body;
    fileService.uploadFile(repo, path, message, req,res);
};

const listFiles = async (req, res) => {
    const { repo, path, limit, page } = req.body;
    fileService.listFiles(repo, path, limit, page , req,res);
};

const listRepos = async (req, res) => {
    // const { repo } = req.query;
    fileService.listRepos(req,res);
};

const downloadFile = async (req, res) => {
    const { repo, downloadpath } = req.query;
    fileService.downloadFile(repo, downloadpath,req,res);
};

const readFile = async (req, res) => {
    const { repo, fileId } = req.query;
    fileService.readFile( repo, fileId,req, res)
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile, listRepos };
