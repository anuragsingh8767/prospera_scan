import * as S3Service from '../Services/S3.file.services.js';

const deleteFile = async (req, res) => {
    const { bucketname, filepath } = req.query;
    S3Service.deleteFile(bucketname, filepath,req,res);
};

const uploadFile = async (req, res) => {
    const { bucketname, filepath } = req.query;
    S3Service.uploadFile(bucketname, filepath,req,res);
};

const listFiles = async (req, res) => {
    const { bucketname, continuationToken, pageSize} = req.body;
    S3Service.listFiles(bucketname,continuationToken,pageSize,req,res);
};

const downloadFile = async (req, res) => {
    const { bucketname, filename, downloadpath } = req.query;
    await S3Service.downloadFile(bucketname, filename, downloadpath,req,res);
};

const readFile = async (req, res) => {
    const { bucketname, filepath } = req.query;
    S3Service.readFile(bucketname, filepath,req,res);
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile };
