import fs from 'fs';
import dotenv from 'dotenv';
import {box_getTokens} from './token.services.js';
import { refreshAccessToken } from './box.auth.services.js';
import BoxSDK from 'box-node-sdk';
import { promises as sf } from 'fs';
import path from 'path';

dotenv.config();

// const sdk = new BoxSDK({
//     clientID: `${box.config.clientId}`,
//     clientSecret: `${box.config.clientSecret}`
// });

async function checkToken(accessToken ,refreshToken, res){
    // Refresh the access token if not present or expired
    if (!accessToken) {
            const tokenData = await refreshAccessToken(refreshToken);
            accessToken = tokenData.access_token;
            refreshToken = tokenData.refresh_token;
            throw new Error('Token expired. Please retry the operation');
    }

    const client = sdk.getBasicClient(accessToken);
    return client;
}

async function uploadFile(folderId, filePath, res) {
    let { accessToken, refreshToken } = box_getTokens();

    
    try {
        const client = await checkToken(accessToken, refreshToken, res);
        // Check if the file exists
        await sf.access(filePath);

        // Extract the file name from the file path
        const fileName = path.basename(filePath);
        const fileStream = fs.createReadStream(filePath);

        // Upload the file to the specified folder in Box
        const uploadedFile = await client.files.uploadFile(folderId, fileName, fileStream);

        res.json(uploadedFile);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('File not found:', filePath);
            return res.status(404).send('File not found');
        }
        console.error('Error uploading file:', error.response ? error.response.data : error.message);
        res.status(500).send('File upload failed');
    }
}

async function listFiles(folderId = 0, offset = 10, limit = 0, res) {
    let { accessToken, refreshToken } = box_getTokens();

    try {
        const client = await checkToken(accessToken, refreshToken, res);
        // Get the items in the specified folder with pagination
        const items = await client.folders.getItems(folderId, {
            fields: 'name,size,modified_at',
            limit: limit,
            offset: offset
        });

        res.json({
            entries: items.entries,
            total_count: items.total_count,
            limit: limit,
            offset: offset
        });
    } catch (error) {
        console.error('Error listing files:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to list files');
    }
}


async function readFile(fileId, res) {
    let { accessToken, refreshToken } = box_getTokens();

    // Refresh the access token if not present or expired
    
    try {
        const client = await checkToken(accessToken, refreshToken, res);
        // Fetch file information from Box
        const fileInfo = await client.files.get(fileId, {
            fields: 'id,name,size,content'
        });

        // Get the file stream
        const fileStream = await client.files.getReadStream(fileId);

        // Collect the file content
        let fileData = '';
        fileStream.on('data', chunk => {
            fileData += chunk;
        });

        fileStream.on('end', () => {
            res.json({ content: fileData, info: fileInfo });
        });

        fileStream.on('error', (error) => {
            console.error('Error reading file:', error.response ? error.response.data : error.message);
            res.status(500).send('Failed to read file');
        });
    } catch (error) {
        console.error('Error reading file:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to read file');
    }
}

async function deleteFile (fileId, res){
    let { accessToken, refreshToken } = box_getTokens();

    // Refresh the access token if not present or expired
    
    try {
        const client = await checkToken(accessToken, refreshToken, res);
        // Delete the file from Box
        await client.files.delete(fileId);
        res.status(200).send('File deleted successfully');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('File not found:', fileId);
            return res.status(404).send('File not found');
        }
        console.error('Error deleting file:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to delete file');
    }
};

async function downloadFile(fileId, downloadDir, res) {
    let { accessToken, refreshToken } = box_getTokens();

    try {
        // Ensure downloadDir exists, create it if it doesn't
        // Ensure downloadDir exists, create it if it doesn'tget
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Construct the full path for the downloaded file
        const fileName = `file_${fileId}.download`; // Example: Use fileId to create a filename
        const downloadPath = path.join(downloadDir, fileName);

        const client = await checkToken(accessToken, refreshToken, res);

        // Create a write stream to the constructed file path
        const downloadStream = fs.createWriteStream(downloadPath);

        // Get the read stream from the Box file
        const fileStream = await client.files.getReadStream(fileId);

        fileStream.pipe(downloadStream);

        fileStream.on('end', () => {
            res.status(200).send(`File downloaded successfully to ${downloadPath}`);
        });

        fileStream.on('error', (error) => {
            console.error('Error downloading file:', error.response ? error.response.data : error.message);
            res.status(500).send('Failed to download file');
        });

        downloadStream.on('error', (error) => {
            console.error('Error writing file:', error.message);
            res.status(500).send('Failed to write file');
        });
    } catch (error) {
        console.error('Error processing file download:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to download file');
    }
}

export { uploadFile, listFiles, readFile, deleteFile, downloadFile, checkToken};