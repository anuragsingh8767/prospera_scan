import { getTokens } from '../app.js';
import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { refreshAccessToken } from './dbx.auth.service.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function checktoken(){
    let dbx = new Dropbox({ accessToken: getTokens().accessToken, fetch });
    if (!dbx) {
        await refreshAccessToken(getTokens().refreshToken);
        dbx = new Dropbox({ accessToken: getTokens().accessToken, fetch });
    }
    return dbx;
}

async function listFiles(folderId, cursor = null, limit = 10, res) {
    try {
        let dbx = await checktoken();
        const path = folderId ? folderId : '';

        let entries = [];
        let nextCursor = null;

        if (!cursor) {
            const initialResponse = await dbx.filesListFolder({ path, limit });
            entries = initialResponse.result.entries;
            nextCursor = initialResponse.result.cursor;

            if (initialResponse.result.has_more) {
                res.json({ entries, cursor: nextCursor });
            } else {
                res.json({ entries, cursor: null });
            }
        } else {
            const response = await dbx.filesListFolderContinue({ cursor });
            entries = response.result.entries;
            nextCursor = response.result.cursor;

            if (response.result.has_more) {
                res.json({ entries, cursor: nextCursor });
            } else {
                res.json({ entries, cursor: null });
            }
        }
    } catch (error) {
        res.send(`${error.error}`);
        console.log(error);
    }
}

async function downloadFile(fileId, downloadPath, res) {
    try {
        let dbx = await checktoken();
        const response = await dbx.filesDownload({ path: `${fileId}` });

        // Ensure the downloadPath includes the file name
        const fileName = response.result.name;
        const fullDownloadPath = path.join(downloadPath, fileName);

        // Check if the downloadPath exists, if not, create it
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }

        // Write the file content to the specified path
        fs.writeFileSync(fullDownloadPath, response.result.fileBinary, 'binary');

        res.send(`File downloaded successfully to ${fullDownloadPath}`);
    } catch (error) {
        res.send(`Error downloading file: ${error.message}`);
        console.log(error);
    }
}


async function uploadFile(folderId, filePath, res) {
    try {
        let dbx = await checktoken();
        const contents = fs.readFileSync(filePath);
        const fileName = path.basename(filePath); // Extract the filename from the path

        // Determine the path based on folderId (or use root if folderId is empty)
        const dropboxPath = folderId ? `${folderId}/${fileName}` : `/${fileName}`;

        const response = await dbx.filesUpload({
            path: dropboxPath,
            contents,
            mode: 'overwrite', // To overwrite existing files
        });

        res.send(response.result);
    } catch (error) {
        res.send(`Error uploading file: ${error.error}`);
        console.log(error);
    }
}

async function deleteFile(fileId, res) {
    try {
        let dbx = await checktoken();
        await dbx.filesDeleteV2({ path: `${fileId}` });
        res.send(`File deleted successfully `);
    } catch (error) {
        res.send(`Error deleting file: ${error}`);  
        console.log(error);
    }
}

async function readFile(fileId, res) {
    try {
        let dbx = await checktoken();
        const response = await dbx.filesDownload({ path: `${fileId}` });
        const content = response.result.fileBinary.toString(); // Convert to string
        res.send(content);
    } catch (error) {
        res.send(`Error reading file: ${error}`);
        console.log(error);
    }
}

export { listFiles, downloadFile, uploadFile, deleteFile, readFile };