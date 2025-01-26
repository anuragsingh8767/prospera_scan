import * as fileService from '../Services/postgres.file.services.js';

const deleteFile = async (req, res) => {
    const {schema,table,id } = req.query;
    fileService.deleteFile(schema,table,id,req,res);
};


const listFiles = async (req, res) => {
    const {page, limit,offset,schema} = req.body;
    fileService.listFiles(page, limit,offset,schema, req,res);
};


const downloadFile = async (req, res) => {
    const {schema,table,path } = req.query;
    await fileService.downloadFile(schema,table,path,req,res);
};

const readFile = async (req, res) => {
    const {table,schema,page,limit,offset } = req.query;
    fileService.readFile(table,schema,page,limit,offset,req, res)
};

const updateRecord = async (req, res) => {
    const {schema,table,record} = req.body;
    fileService.updateRecord(schema,table,record,req,res)
};

const insertRecord = async (req, res) => {
    const {schema,table,record} = req.body;
    fileService.insertRecord(schema,table,record,req,res)
};



export { deleteFile, downloadFile, listFiles, readFile, updateRecord, insertRecord };
