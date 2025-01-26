import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as con from '../Utils/connection.js';



async function listFiles(folderPath, page, limit, offset, req, res) {
    try {
        const ROOT_FOLDER_PATH = await con.nfsConnection(req,res);

        if (!page || page < 1 || !limit || limit < 1 || !offset || offset < 1) {
            return res.status(400).send('Invalid page, limit, or offset parameters');
        }

        offset -= 1;

        const fullPath = folderPath ? path.join(ROOT_FOLDER_PATH, folderPath) : ROOT_FOLDER_PATH;
        console.log('fullPath', fullPath);

        const dirEntries = await fs.promises.readdir(fullPath);

        const startIndex = (page - 1) * limit + offset;
        const endIndex = Math.min(startIndex + limit, dirEntries.length);
        const paginatedList = dirEntries.slice(startIndex, endIndex);

        const responseObj = {
            paginatedList,
        };

        res.json(responseObj);
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



async function readFile(filename, req, res) {
    try {
        // Adjust the NFS path based on your WSL setup
        const ROOT_FOLDER_PATH = await con.nfsConnection(req,res);

        if (!filename) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        const filePath = path.join(ROOT_FOLDER_PATH, filename);

        await fs.promises.access(filePath, fs.constants.F_OK);

        const fileBuffer = await fs.promises.readFile(filePath);
        res.setHeader('Content-Type', getContentType(filename));
        res.send(fileBuffer);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'File not found' });
        } else {
            console.error('Error reading file:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

function getContentType(filename) {
    const extension = path.extname(filename).toLowerCase();
    switch (extension) {
        case '.txt':
            return 'text/plain';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.pdf':
            return 'application/pdf';
        default:
            return 'application/octet-stream'; 
    }
}



async function downloadFile(filename, downloadPath, req,res) {
try {
    let ROOT_FOLDER_PATH = await con.nfsConnection(req,res);
    if (!filename || !downloadPath) {
    res.status(400).json({ error: 'Invalid input' });
    return;
    }

    const nfsFilePath = path.join(ROOT_FOLDER_PATH, filename);

    try {
    await fs.promises.access(nfsFilePath, fs.constants.F_OK);
    } catch (error) {
    if (error.code === 'ENOENT') { // File not found
        res.status(404).json({ error: 'File not found' });
        return;
    }  else {
        console.error('Error accessing file:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    }

    const downloadFolderPath = path.join(__dirname, downloadPath);
    try {
    await fs.promises.access(downloadFolderPath);
    } catch (error) {
    await fs.promises.mkdir(downloadFolderPath, { recursive: true });
    }

    const writeStream = fs.createWriteStream(path.join(downloadFolderPath, filename));

    const readStream = fs.createReadStream(nfsFilePath);
    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
    res.json({ message: 'File downloaded successfully!' });
    });

    writeStream.on('error', (error) => {
    console.error('Error while writing file:', error);
    res.status(500).json({ error: 'Internal server error' });
    });

    readStream.on('error', (error) => {
    console.error('Error while reading file:', error);
    res.status(500).json({ error: 'Internal server error' });
    });
} catch (error) {
    console.error('Error while downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
}
}




async function deleteFile(filename, req,res) {
try {
    let ROOT_FOLDER_PATH = await con.nfsConnection(req,res);

    if (!filename) {
    return res.status(400).json({ error: 'Invalid input' });
    }
    const nfsFilePath = path.join(ROOT_FOLDER_PATH, filename);
    try {
    await fs.promises.access(nfsFilePath, fs.constants.F_OK);
    } catch (error) {
    if (error.code === 'ENOENT') { // File not found
        return res.status(404).json({ error: 'File not found' });
        
    } else {
        console.error('Error accessing file:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    }

    try {
    await fs.promises.unlink(nfsFilePath);
    res.json({ message: 'File deleted successfully!' });
    } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
} catch (error) {
    res.status(500).json({ error: 'Internal server error' });
}
}



async function uploadFile(filePath, uploadPath, req,res) {
    try {
        let ROOT_FOLDER_PATH = await con.nfsConnection(req,res);

            if (!filePath || !uploadPath) {
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File not found
                return res.status(404).json({ error: 'File not found' });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        const uploadFolderPath = path.join(ROOT_FOLDER_PATH, uploadPath);
        try {
            await fs.promises.access(uploadFolderPath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.promises.mkdir(uploadFolderPath, { recursive: true });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        const fileBuffer = await fs.promises.readFile(filePath);
        const targetFilePath = path.join(uploadFolderPath, path.basename(filePath));
        await fs.promises.writeFile(targetFilePath, fileBuffer);

        res.json({ message: 'File uploaded successfully!' });
    } catch (error) {
        console.error('Error while uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export {
    uploadFile,
    readFile,
    downloadFile,
    listFiles,
    deleteFile
}