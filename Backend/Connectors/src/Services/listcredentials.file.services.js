import * as con from '../Utils/connection.js';
import { connectToDatabase } from '../Utils/getCred.js';

const collectionName = 'creds';
async function listcreds(type_id,res)
{
    try {
        if (!type_id) {
            return res.status(400).send('Type is required');
        }
        try {
            const mongoConnection=await connectToDatabase();
            const collection = mongoConnection.collection(collectionName);
            const results = await collection.find({ type_id }).project({ name: 1, type: 1,_id: 1 }).toArray();
            if (results.length === 0) {
                return res.status(404).send('No matching documents found');
            }
            res.status(200).json(results);
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).send('Error fetching documents');
        }

    } catch (error) {
        console.log("error")
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {listcreds}