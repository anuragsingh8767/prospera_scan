import * as fileService from '../Services/mongo.file.services.js'

const deleteFile = async (req, res) => {
    const { collection, id } = req.query
    fileService.deleteFile(collection, id, req, res)
}

const readFile = async (req, res) => {
    const { limit, collection, page, token } = req.query
    fileService.readFile(limit, collection, page, token, req, res)
}
const listFiles = async (req, res) => {
    const { limit, page, token } = req.body
    fileService.listFiles(limit, page, token, req, res)
}



// const uploadFile = (req, res) => {
//     const {schema,table,record } = req.body;
//     fileService.uploadFile(schema,table, record, res);
// };

// const downloadFile = async (req, res) => {
//     const {schema,table,path } = req.query;
//     await fileService.downloadFile(schema,table,path,req,res);
// };


export { deleteFile, listFiles, readFile }
