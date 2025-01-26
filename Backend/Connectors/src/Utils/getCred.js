import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';

const collectionName = 'creds';

const uri='mongodb+srv://anurags:admin@cluster0.jc6rf.mongodb.net/test'
let isConnected = false;
let mongoConnection;

async function connectToDatabase() {
    if (isConnected) {
        return mongoConnection;
    }
    mongoConnection = mongoose.createConnection(uri, {});
    return new Promise((resolve, reject) => {
        mongoConnection.on('connected', () => {
            console.log("connected to mongodb")
            isConnected = true;
            resolve(mongoConnection);
        });
        mongoConnection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            reject(err);
            
        });
    });
}

async function getcred(req,res)
{
    let cred_name= req.body.cred_name;
    let Type= req.body.type;
    const MongoConnection=await connectToDatabase();
    const collection = MongoConnection.collection(collectionName);
    const document = await collection.findOne({ name: cred_name, type:Type });
    console.log(document);

    if (!document) {
        return res.status(404).send('No matching credential found');
    }
    if (!document.type) {
        return res.status(404).send('No matching type found');
    }

    let credentials = document.cred;
    return credentials;
}

async function returnCred(id, res) {
    try {

        const MongoConnection = await connectToDatabase();
        const collection = MongoConnection.collection(collectionName);

        const document = await collection.findOne({ _id: ObjectId.createFromHexString(id) }, { cred: 1 });
        if (document && document.cred) {
            res.json(document.cred);
        } else {
            res.status(404).json({ error: "Credentials not found." });
        }
    } catch (error) {
        console.error("Error retrieving credentials:", error);
        res.status(500).json({ error: "An error occurred while retrieving credentials." });
    }
}

export {getcred, connectToDatabase, returnCred};