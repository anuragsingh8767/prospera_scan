import * as fileService from '../Services/test.file.service.js';

const testFile = async (req, res) => {
    const {cred_name,type} = req.body;
    fileService.testconnection(cred_name,type,req,res);
}

export { testFile };