import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import * as con from '../Utils/connection.js'; 


async function uploadFile(filePath, indexName,req, res) {
    try {
        let client = await con.elasticConnection(req,res);
        const fileContent = fs.readFileSync(filePath);
        let data;
        let isJson = true;
        try {
            data = JSON.parse(fileContent.toString('utf8'));
        } catch (parseError) {
            data = fileContent.toString('utf8');
            isJson = false;
        }
        const validIndexName = indexName && !indexName.startsWith('_') ? indexName : 'default_index';
        const fileName = path.basename(filePath);
        const response = await client.index({
            index: validIndexName,
            body: isJson ? { ...data, filename: fileName } : { content: data, filename: fileName }
        });
        res.send(response);
    } catch (error) {
        console.error(error.message); // Log the specific error message for debugging
        res.status(500).send('Error uploading file: ' + error.message);
    }
}

async function listFiles(folderId, indexName, limit, offset, req,res) {
    try {
        let client = await con.elasticConnection(req,res);
        // If no indexName is provided, list all available indices
        if (!indexName) {
            const indicesResponse = await client.cat.indices({ format: 'json' });
            const indices = indicesResponse.map(index => index.index);
            res.send(indices);
            return;
        }

        // Define the query based on whether folderId is provided
        const query = folderId ? { term: { folderId: folderId } } : { match_all: {} };

        // Search for documents within the specified index
        const response = await client.search({
            index: indexName, // Use the provided index name
            body: {
                query: query,
                _source: ['filename'], // Include only the filename field
                from: offset, // Pagination offset
                size: limit // Pagination limit
            }
        });

        // Extract the necessary fields
        const files = response.hits.hits.map(hit => ({
            id: hit._id,
            index: hit._index,
            filename: hit._source.filename || 'No filename' // Handle missing filename
        }));

        // Get the last file's ID to use as the offset for the next batch
        const nextOffset = files.length > 0 ? files[files.length - 1].id : null;

        res.send({ files, nextOffset });
    } catch (error) {
        console.error(error.message); // Log the specific error message for debugging
        res.status(500).send('Error listing documents: ' + error.message);
    }
}

async function downloadFile(fileId, downloadPath,req, res) {
    try {
        let client = await con.elasticConnection(req,res);
        // Search for the document across all indices
        const response = await client.search({
            body: {
                query: {
                    ids: {
                        values: [fileId]
                    }
                }
            }
        });

        if (response.hits.total.value === 0) {
            res.status(404).send('File not found');
            return;
        }

        const hit = response.hits.hits[0];
        const fileContent = hit._source.content;
        const fileName = hit._source.filename;

        // Ensure the download path exists, create it if it doesn't
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }

        const filePath = path.join(downloadPath, fileName);

        // Write the file content to the specified path
        fs.writeFileSync(filePath, fileContent);

        // Ensure the file path is absolute
        const absoluteFilePath = path.resolve(filePath);

        // Send a success message instead of the file content
        res.status(200).send(`File downloaded successfully to ${absoluteFilePath}`);
    } catch (error) {
        console.error(error.message); // Log the specific error message for debugging
        res.status(500).send('Error downloading file: ' + error.message);
    }
}

async function deleteFile(fileId, req,res) {
    try {
        let client = await con.elasticConnection(req,res);
        // Search for the document across all indices
        const searchResponse = await client.search({
            body: {
                query: {
                    ids: {
                        values: [fileId]
                    }
                }
            }
        });

        if (searchResponse.hits.total.value === 0) {
            res.status(404).send('File not found');
            return;
        }

        const hit = searchResponse.hits.hits[0];
        const indexName = hit._index;

        // Delete the document by its ID and index name
        const deleteResponse = await client.delete({
            index: indexName,
            id: fileId
        });

        // Check if the document was found and deleted
        if (deleteResponse.result === 'not_found') {
            res.status(404).send('File not found');
            return;
        }

        // Send a success message
        res.status(200).send('File deleted successfully');
    } catch (error) {
        console.error(error.message); // Log the specific error message for debugging
        res.status(500).send('Error deleting file: ' + error.message);
    }
}

async function readFile(fileId,req, res) {
    try {
        let client = await con.elasticConnection(req,res);
        // Search for the document across all indices
        const searchResponse = await client.search({
            body: {
                query: {
                    ids: {
                        values: [fileId]
                    }
                }
            }
        });

        if (searchResponse.hits.total.value === 0) {
            res.status(404).send('File not found');
            return;
        }

        const hit = searchResponse.hits.hits[0];
        const fileContent = hit._source.content;
        const fileName = hit._source.filename;

        // Send the file content as the response
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.status(200).json({
            Content : fileContent
        });
    } catch (error) {
        console.error(error.message); // Log the specific error message for debugging
        res.status(500).send('Error reading file: ' + error.message);
    }
}


export { uploadFile, listFiles, downloadFile, deleteFile, readFile };