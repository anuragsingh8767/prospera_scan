import * as fileService from '../Services/mysql.file.services.js';

const deleteFile = async (req, res) => {
    const {table, id } = req.query;
    fileService.deleteFile(table, id, req,res);
};

const uploadFile = async(req, res) => {
    const {table,filePath } = req.query;
    fileService.uploadFile(table, filePath,req, res);
};

const listFiles = async (req, res) => {
    const {page, limit,offset} = req.body;
    fileService.listFiles(page, limit,offset,req,res);
};


const downloadFile = async (req, res) => {
    const {table,path } = req.query;
    await fileService.downloadFile(table,path,req,res);
};

const readFile = async (req, res) => {
    const {table,page,limit,offset } = req.body;
    fileService.readFile(table,page,limit,offset, req, res)
};

const insertRecord = async (req, res) => {
    const {table,record} = req.body;
    fileService.insertRecord(table,record, req,res)
};

const updateRecord = async (req, res) => {
    const {table,record} = req.body;
    fileService.updateRecord(table,record,req, res)
};

export { deleteFile, downloadFile, listFiles, uploadFile, readFile,insertRecord, updateRecord};
