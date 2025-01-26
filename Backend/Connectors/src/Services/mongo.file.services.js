import mongoose from 'mongoose';
import * as con from '../Utils/connection.js';




// Function to read a file 
async function readFile(limit, collectionName, page, token, req,res) {
    try {
        if (!collectionName || collectionName === '') {
            return res.status(400).json({ error: 'Missing Collection name' });
        }
        if (!limit || limit <= 0) {
            return res.status(400).json({ error: 'Invalid limit' });
        }
        if (!page || page <= 0) {
            return res.status(400).json({ error: 'Invalid page' });
        }
        let connection = await con.MongoConnection(req,res);
        const collections = await connection.db.listCollections({ name: collectionName }).toArray();

        if (collections.length === 0) {
            return res.status(404).json({ error: 'Collection does not exist' });
        }

        const collection = connection.db.collection(collectionName);
        let query = {};
        if (token) {
            query = { _id: { $gt: mongoose.Types.ObjectId.createFromHexString(token) } };
        }

        const documents = await collection.find(query).limit(parseInt(limit)).toArray();
        if (documents.length === 0) {
            console.log('No documents found with the given criteria');
        }
        const nextToken = documents.length > 0 ? documents[documents.length - 1]._id : null;
        res.json({ documents, nextToken });
    } catch (error) {
        console.error('Error reading documents:', error);
        res.status(500).json({ error: error.message });
    }
}



//Function to list all the collections
async function listFiles(limit, page, token,req, res) {
    try {
        if (!limit || limit <= 0) {
            return res.status(400).json({ error: 'Invalid limit' });
        }
        if (!page || page <= 0) {
            return res.status(400).json({ error: 'Invalid page' });
        }

        let connection = await con.MongoConnection(req,res);
        let collections = await connection.db.listCollections().toArray();
        collections = collections.sort((a, b) => a.name.localeCompare(b.name));

        let startIndex = 0;
        if (token) {
            const tokenIndex = collections.findIndex(collection => collection.name === token);
            if (tokenIndex === -1) {
                return res.status(400).json({ error: 'Invalid token' });
            }
            startIndex = tokenIndex + 1;
        }

        const paginatedCollections = collections.slice(startIndex, startIndex + limit);
        const nextToken = paginatedCollections.length > 0 ? paginatedCollections[paginatedCollections.length - 1].name : null;
        return res.json({ collections: paginatedCollections, nextToken });
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}






// Function to delete a file from a repository
async function deleteFile(collectionName, id, req,res) {
    try {
        if (!id || !collectionName) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        if (id <= -1) { 
            return res.status(400).json({ error: 'Invalid id' });
        }
        let connection = await con.MongoConnection(req,res);
        const collections = await connection.db.listCollections({ name: collectionName }).toArray();

        if (collections.length === 0) {
            return res.status(404).json({ error: 'Collection does not exist' });
        }
        const collection = connection.db.collection(collectionName);
        const result = await collection.deleteOne({ _id: mongoose.Types.ObjectId.createFromHexString(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete document', details: error.message });
    }
}


export { listFiles, readFile,deleteFile, };
