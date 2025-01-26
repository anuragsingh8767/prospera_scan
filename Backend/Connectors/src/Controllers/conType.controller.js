import * as conTypeServices from '../Utils/getConnectorType.js';
import { returnCred } from '../Utils/getCred.js';

const listConType = async (req, res) => {
    conTypeServices.listConType(res);
}

const listConTypeCreds = async (req, res) => {
    const id = req.query.id;
    returnCred(id, res);
}

export { listConType, listConTypeCreds };