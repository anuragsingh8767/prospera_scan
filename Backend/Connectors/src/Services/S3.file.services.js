import fs from 'fs';
import path from 'path';
import * as con from '../Utils/connection.js';



async function deleteFile(bucketname, filePath, req,res) {
    let s3 = await con.s3Connection(req,res);
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketname,
            Key: filePath, // Use filePath directly as the key
        };

        // Check if the file exists
        s3.headObject(params, (err, data) => {
            if (err && err.code === 'NotFound') {
                res.status(404).send(`File doesn't exist: ${bucketname}/${filePath}`);
                resolve("File doesn't exist"); // Resolve with a message if file doesn't exist
            } else if (err) {
                res.status(500).send(`Error checking file existence: ${err}`);
                reject(err);
            } else {
                // File exists, proceed with deletion
                s3.deleteObject(params, (err, data) => {
                    if (err) {
                        res.status(500).send(`Error deleting file: ${err}`);
                        reject(err);
                    } else {
                        res.status(200).send(`File deleted successfully from ${bucketname}/${filePath}`);
                        resolve(data);
                    }
                });
            }
        });
    });
}

async function downloadFile(bucketname, fileName, downloadPath,req,res) {
    console.log("downloadFile");
    let s3 = await con.s3Connection(req,res);
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketname,
            Key: fileName,
        };
        var filePath;
        if(downloadPath){
            filePath = path.join(downloadPath,path.basename(fileName));
        }else{
            filePath = fileName;
        }
        const directory = path.dirname(filePath);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const file = fs.createWriteStream(filePath);
        s3.getObject(params)
            .createReadStream()
            .on('error', function (err) {
                res.status(500).send(`Error downloading file: ${err}`);
                reject(err);
            })
            .pipe(file)
            .on('close', function () {
                res.status(200).send(`File downloaded successfully to ${filePath}`);
                resolve(filePath);
            });
    });
};

async function listFiles(bucketName,continuationToken, pageSize, req,res) {
    let s3 = await con.s3Connection(req,res);
    const params = {
    Bucket: bucketName,
    MaxKeys: pageSize,
    };

    if (continuationToken) {
    params.ContinuationToken = continuationToken;
    }

    return s3.listObjectsV2(params).promise()
    .then(response => {
        const files = response.Contents.map(item => item.Key);
        response.NextContinuationToken;
        let result={files,NextContinuationToken:response.NextContinuationToken};
        res.send(result);
    })
    .catch(error => {
        res.send(`Error listing files: ${error}`);
        throw error;
    });
}

async function uploadFile(bucketname, filePath,req,res) {
    let s3 = await con.s3Connection(req,res);
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const params = {
            Bucket: bucketname,
            Key: fileName,
            Body: fileContent,
        };
        s3.upload(params, (err, data) => {
            if (err) {
                res.status(500).send(`Error uploading file ${err}`);
                reject(err);
            } else {
                res.status(200).send(`File uploaded successfully. File URL: ${data.Location}`);
                resolve(data.Location);
            }
        });
    });
};

async function readFile(bucketName, filePath, req,res = null) {
    let s3 = await con.s3Connection(req,res);
    const params = {
        Bucket: bucketName,
        Key: filePath,
    };

    try {
        const data = await s3.getObject(params).promise();

        const fileContent = data.Body.toString('utf-8');

        if (res) {
            // Set response headers
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`); 
            res.send(fileContent);
        }

    } catch (err) {
        console.error(`Error reading file ${filePath} from S3:`, err);

        if (res) {
            res.status(500).send(`Error reading file: ${err}`);
        }

        throw err;
    }
}

export { deleteFile, downloadFile, listFiles, uploadFile, readFile};