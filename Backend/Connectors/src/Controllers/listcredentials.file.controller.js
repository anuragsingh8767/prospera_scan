import * as fileService from '../Services/listcredentials.file.services.js';

const listcreds = async (req, res) => {
    const { type_id } = req.body;
    fileService.listcreds(type_id, res)
};



export {listcreds}