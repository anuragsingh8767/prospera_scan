import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import * as con from '../Utils/connection.js';




//Function to read documents in a collection
async function readFile(downloadPath, indexname, id, req, res) {
    try {
        let client = await con.opensearchConnection(req, res);
        if (!downloadPath || !indexname || !id) {
            return res.status(400).json({ error: 'Missing required parameters (downloadPath, indexname, or id) in the request body' });
        }
        const doc = await client.get({
            index: indexname, // Replace with your index name
            id
        });
    
        const fileContent = doc._source.file_content; // Replace with your actual field name
    
        // Create the download directory if it doesn't exist
        await fs.promises.mkdir(downloadPath, { recursive: true });
    
        // Construct the full file path
        const filePath = path.join(downloadPath, `${id}.bin`); // Replace '.bin' with appropriate extension
    
        // Save the file to the specified path
        await fs.promises.writeFile(filePath, fileContent);
    
        res.status(200).json({ message: 'File downloaded successfully' })
    } catch (error) {
        console.error('Error reading or downloading document:', error);
        res.status(500).json({ error: error.message });
    }
}



//Function to list all the indexes
async function listFiles(index, folderId, offset, limit, page, req,res) {
try {
    let client = await con.opensearchConnection(req,res);
if (!limit || limit <= 0) {
    return res.status(400).json({ error: 'Invalid limit' });
}
if (!page || page <= 0) {
    return res.status(400).json({ error: 'Invalid page' });
}
if (offset <= 0) {
    return res.status(400).json({ error: 'Invalid offset' });
}

let result;
const from = (offset - 1) + (page - 1) * limit;

if (!index) {
    // List all indexes with pagination
    result = await client.cat.indices({ format: 'json' });
    const indices = result.body.map(index => index.index);
    const paginatedIndices = indices.slice(from, from + limit);
    const nextToken = paginatedIndices.length > 0 ? paginatedIndices[paginatedIndices.length - 1] : null;
    return res.json({ indices: paginatedIndices, nextToken });
} else {
    // List files inside the index with pagination
    const query = folderId ? { match: { folderId } } : { match_all: {} };
    result = await client.search({
    index,
    body: {
        from,
        size: limit,
        query
    }
    });
    const files = result.body.hits.hits.map(hit => ({
    id: hit._id,
    type: hit._source.fileType,
    ...hit._source
    }));
    const nextToken = files.length > 0 ? files[files.length - 1].id : null;
    return res.json({ files, nextToken });
}
} catch (error) {
return res.status(500).json({ error: error.message });
}

}



async function deleteFile(indexname,id,req, res) {
    try {
        let client = await con.opensearchConnection(req, res);

        if (!indexname || !id) {
            return res.status(400).json({ error: 'Missing required parameters (indexname or id)' });
        }

        let deleteResponse = await client.delete({
            index: indexname,
            id: id
        });
        return res.status(200).json({ message: 'Document deleted' });
    } catch (error) {
        let result = error.meta.body.result;
        res.status(500).json({ error: 'Failed to delete document', details: {result} });
    }
}



export { listFiles, readFile,deleteFile, };
