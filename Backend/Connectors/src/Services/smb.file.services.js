import * as con from '../Utils/connection.js';
import fs from 'fs';
import smb2 from 'smb2';

const smb2Client = new smb2({
    share: "\\\\192.168.1.13\\Downloads",
    domain: "WORKGROUP",
    username: "BUZZ",
    password: "wasd",
    });

async function readFile(remoteFilePath, req,res) {
        try{
            const smb2Client = await con.smbConnection(req,res);
            smb2Client.readFile(remoteFilePath, (err, data) => {
            })
            res.send(data.toString())
        }catch{
            res.status(500).send('Error reading File ');
        }

}

async function downloadFile(remoteFilePath, localFilePath,req,res) {
    try{
        const smb2Client = await con.smbConnection(req,res);
        smb2Client.readFile(remoteFilePath, (err, data) => {
            fs.writeFile(localFilePath, data, (err) => {    
            });
            res.send(`File downloaded successfully to ${localFilePath}`);
        });
    }catch{
        res.status(500).send('Error downloading File ');
    };
}

async function uploadFile(localFilePath, remoteFilePath,req,res) {
    try{
        const smb2Client = await con.smbConnection(req,res);
        fs.readFile(localFilePath, (err, data) => {
            smb2Client.writeFile(remoteFilePath, data, (err) => {
            });
        });
        res.send(`File uploaded successfully to ${remoteFilePath}`)
    }catch{
        console.error('Unhandled promise rejection:', error);
    }
}

// async function listFiles(remotefoldername ='', res) {
//     return new Promise((resolve, reject) => {
//         smb2Client.readdir(remotefoldername, (err, files) => {
//             if (err) {
//                 reject(`Error listing files: ${err}`);
//             } else {
//                 res.json(files);
//                 resolve(files);
//             }
//         });
//     }).catch(error => {
//         console.error('Unhandled promise rejection:', error);
//         res.status(500).send('Internal Server Error');
//     });
// }

// async function listFiles(remotefoldername = '', page = 1, limit = 10, res) {
//     const getAllFiles = async (folder, res) => {
//             smb2Client.readdir(folder, async (err, files) => {
//                 if (err) {
//                     res.send(`Error listing files: ${err}`);
//                 } else {
//                     let allFiles = [];
//                     for (const file of files) {
//                         const filePath = `${folder}/${file}`;
//                         // Assuming directories end with a slash (/) or have a specific pattern
//                         if (file.endsWith('/')) {
//                             const nestedFiles = await getAllFiles(filePath);
//                             allFiles = allFiles.concat(nestedFiles);
//                         } else {
//                             allFiles.push(filePath);
//                         }
//                     }
//                     res.json(allFiles);
//                 }
//             });
//         }
//     }
//     try {
//         const allFiles = await getAllFiles(remotefoldername);
//         const startIndex = (page - 1) * limit;
//         const paginatedFiles = allFiles.slice(startIndex, startIndex + limit);

//         res.send({
//             page,
//             limit,
//             totalFiles: allFiles.length,
//             files: paginatedFiles
//         });
//     } catch (error) {
//         console.error('Unhandled promise rejection:', error);
//         // res.status(500).send('Internal Server Error');
// }

async function listFiles(remotefoldername = '', page = 1, limit = 10, req, res) {
    try {
        // const smb2Client = await con.smbConnection(req,res);
        let allFiles = [];
        let foldersToRead = [remotefoldername];

        while (foldersToRead.length > 0) {
            const currentFolder = foldersToRead.pop();
            smb2Client.readdir(currentFolder, (err, files) => {
                if (err) {
                    console.log(`Error listing files: ${err}`);
                    return;
                } else {
                    for (const file of files) {
                        const filePath = `${currentFolder}/${file}`;
                        if (file.endsWith('/')) {
                            foldersToRead.push(filePath);
                        } else {
                            allFiles.push(filePath);
                        }
                    }
                }
            });
        }

        // Wait for all directories to be read
        setTimeout(() => {
            const startIndex = (page - 1) * limit;
            const paginatedFiles = allFiles.slice(startIndex, startIndex + limit);

            res.send({
                page,
                limit,
                totalFiles: allFiles.length,
                files: paginatedFiles
            });
        }, 1000); // Adjust the timeout as needed
    } catch (error) {
        console.error('Unhandled promise rejection:', error);
        res.status(500).send('Internal Server Error');
    }
}


async function deleteFile(remoteFilePath, req,res) {
    try{
        const smb2Client = await con.smbConnection(req,res);
        smb2Client.unlink(remoteFilePath, (err) => {
        });
        res.send(`File ${remoteFilePath} deleted successfully.`);
    }catch{
        console.error('Unhandled promise rejection:', error);
        res.status(500).send('Internal Server Error');
    };
}

export {
    uploadFile,
    readFile,
    downloadFile,
    listFiles,
    deleteFile
}