import fs from 'fs';
import axios from 'axios';
import path from 'path';
import * as con from '../Utils/connection.js';


// Upload a file
async function uploadFile(channel, filePath, fileComment, req,res) {
    try {
        let client = await con.slackConnection(req,res);
        const response = await client.files.upload({
            channels: channel,
            file: fs.createReadStream(filePath),
            initial_comment: fileComment,
        });
        res.json({ fileId: response.file.id });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
}

// Delete a file
async function deleteFile(fileId,req, res) {
    try {
        let client = await con.slackConnection(req,res);
        const response = await client.files.delete({
            file: fileId,
        });
        res.json({ success: response.ok });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'File deletion failed' });
    }
}

async function downloadFile(fileId, downloadPath,req, res) {
    try {
        let client = await con.slackConnection(req,res);
        const response = await client.files.info({
            file: fileId,
        });
        const fileUrl = response.file.url_private_download;
        const fileName = response.file.name; // Extract the file name from the response
        const fileResponse = await axios.get(fileUrl, {
            headers: { Authorization: `Bearer ${slackBotToken}` },
            responseType: 'stream',
        });

        // Ensure the downloadPath exists, create it if it doesn't
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }

        // Ensure downloadPath includes the actual file name
        const filePath = path.join(downloadPath, fileName);

        const writeStream = fs.createWriteStream(filePath);
        fileResponse.data.pipe(writeStream);

        writeStream.on('finish', () => {
            res.json({ success: true });
        });

        writeStream.on('error', (err) => {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'File download failed' });
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'File download failed' });
    }
}

async function listFiles(pageToken = null, pageSize = 10,req, res) {
    try {
        let client = await con.slackConnection(req,res);
        let files = [];
        let nextPageToken = pageToken;
        let totalFiles = 0;

        while (files.length < pageSize && nextPageToken !== undefined) {
            const params = {
                limit: Math.min(pageSize - files.length, 100),
                cursor: nextPageToken
            };

            const response = await client.files.list(params);
            files = files.concat(response.files || []);
            nextPageToken = response.response_metadata?.next_cursor;
            console.log('Updated Next Cursor:', nextPageToken); // Log for debugging

            if (!nextPageToken) break;
            totalFiles = response.paging?.total || files.length;
        }

        res.json({
            files: files.slice(0, pageSize),
            pageSize,
            nextPageToken, // Return the next cursor as is
            totalFiles
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'File listing failed' });
    }
}

// Read a file's content (assuming it's a text file)
async function readFile(fileId,req, res) {
    try {
        let client = await con.slackConnection(req,res);
        const response = await client.files.info({
            file: fileId,
        });
        const fileUrl = response.file.url_private_download;
        const fileResponse = await axios.get(fileUrl, {
            headers: { Authorization: `Bearer ${slackBotToken}` },
        });
        res.send(fileResponse.data); // Assuming it's a text file
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'File read failed' });
    }
}

export { uploadFile, deleteFile, downloadFile, listFiles, readFile };