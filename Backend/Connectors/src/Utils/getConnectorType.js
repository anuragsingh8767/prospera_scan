import * as con from '../Utils/getCred.js';

async function listConType(res) {
    try {
        const connection = await con.connectToDatabase();
        const collection = connection.collection('credtypes');
        
        const results = await collection.find({}, { projection: { type: 1, type_id: 1, _id: 1 } }).toArray();
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Error listing connector types:', error);
        res.status(500).json({ error: 'An error occurred while listing connector types' });
    }
}

export {
    listConType,
}