import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import * as con from "../Utils/connection.js";


async function listFiles(folderId = 'root', limit = 10, pageToken = "",req, res) {
    try{ 
    let {drive,auth}= await con.gdriveConnection(req,res);
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    // Set the query to list files in the root folder if folderId is not provided
    const query = folderId ? `'${folderId}' in parents and trashed = false` : `'root' in parents and trashed = false`;

    const response = await drive.files.list({
    q: query,
    pageSize: limit,
    pageToken: pageToken || '',
    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
    });

    res.status(200).json({
    files: response.data.files,
    nextPageToken: response.data.nextPageToken,
    });
    }catch (error) {
    console.error('Error listing files:', error.message);
    res.status(error.code || 500).json({ error: error.message });
    }
}

async function uploadFile(name, filePath, folderId, req,res) {
    if (!name || !filePath || !folderId) {
        return res.status(400).send('Missing required fields: name, filePath, or folderId');
    }

    console.log('Received file:', { name, filePath, folderId });

    try {
        let {drive,auth}= await con.gdriveConnection(req,res);
        // Infer the MIME type from the file extension
        const mimeType = mime.lookup(filePath) || 'application/octet-stream'; // Fallback MIME type

        const fileMetadata = {
            name: name,
            parents: [folderId] // Specify the folder ID
        };

        const media = {
            mimeType: mimeType,
            body: fs.createReadStream(path.resolve(filePath)), // Use path.resolve for absolute path
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        res.json({ fileId: response.data.id, name: fileMetadata.name });
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).send(`Error uploading file: ${error.message}`);
    }
}


async function deleteFile(fileId, req,res) {
    if (!fileId) {
        return res.status(400).send('File ID is required');
    }
    try {
        let {drive,auth}= await con.gdriveConnection(req,res);
        // Delete the file with the given ID
        await drive.files.delete({ fileId: fileId });
        res.send(`File with ID ${fileId} deleted successfully`);
    } catch (error) {
        console.error('Error deleting file:', error.message);
        res.status(500).send(`Error deleting file: ${error.message}`);
    }
}

async function downloadFile(fileId, downloadPath, req, res) {
    if (!fileId) {
        return res.status(400).send('File ID is required');
    }
    if (!downloadPath) {
        return res.status(400).send('Download path is required');
    }
    try {
        let { drive, auth } = await con.gdriveConnection(req, res);

        // Create the download folder if it doesn't exist
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }

        // Get file metadata to retrieve the file name
        const metadataResponse = await drive.files.get({
            fileId: fileId,
            fields: 'id, name'
        });
        const fileName = metadataResponse.data.name;

        // Download the file
        const fileResponse = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        // Ensure downloadPath includes a file name
        const filePath = path.join(downloadPath, fileName);

        const writeStream = fs.createWriteStream(filePath);
        fileResponse.data.pipe(writeStream);

        writeStream.on('finish', () => {
            res.json({ success: true, path: filePath });
        });

        writeStream.on('error', (err) => {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'File download failed' });
        });
    } catch (error) {
        console.error('Error downloading file:', error.message);
        res.status(500).send(`Error downloading file: ${error.message}`);
    }
}


async function readFile(fileId,req, res) {
    if (!fileId) {
        return res.status(400).send('File ID is required');
    }
    try {
        let {drive,auth}= await con.gdriveConnection(req,res);

        // Get the file content
        const fileResponse = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        // Pipe the file stream directly to the response
        fileResponse.data.pipe(res);

        fileResponse.data.on('end', () => {
            console.log('File successfully sent to the client.');
        });

        fileResponse.data.on('error', (err) => {
            console.error('Error reading file:', err);
            res.status(500).send(`Error reading file: ${err.message}`);
        });
    } catch (error) {
        console.error('Error reading file:', error.message);
        res.status(500).send(`Error reading file: ${error.message}`);
    }
}

export { listFiles, uploadFile, deleteFile, downloadFile, readFile } ;