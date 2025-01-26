import express from 'express';
import * as fileValidation from '../../Validation/dbx.file.validation.js';
import * as fileController from '../../Controllers/dbx.file.controller.js';
import authenticate from '../../Middleware/authenticate.js';

const router = express.Router();

router
    .route('/upload')
    .post(authenticate(fileValidation.uploadfile), fileController.uploadFile);

router
    .route('/download')
    .get(authenticate(fileValidation.downloadfile), fileController.downloadFile);

router
    .route('/list')
    .post(authenticate(fileValidation.listfile), fileController.listFiles);

router
    .route('/delete')
    .delete(authenticate(fileValidation.deletefile), fileController.deleteFile);

router
    .route('/read')
    .get(authenticate(fileValidation.readfile), fileController.readFile);

export default router;

/**
 * @swagger
 * /v1/dbx/upload:
 *   post:
 *     summary: upload a file to the Dropbox
 *     tags: [DROPBOX]   
 *     parameters:
 *       - in: query
 *         name: filepath
 *         schema:
 *           type: string
 *         description: path to the file
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *         description: Id of the folder where to upload the file
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */

/**
 * @swagger
 * /v1/dbx/delete:
 *   delete:
 *     summary: delete a file from the Dropbox
 *     tags: [DROPBOX]
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: file id of the file to delete
 *     responses:
 *       "200":
 *         description: File deleted
 *       "400":
 *         description: File not found
 *       "500":
 *         description: Error deleting file
 */

/**
 * @swagger
 * /v1/dbx/download:
 *   get:
 *     summary: download a file from the Dropbox
 *     tags: [DROPBOX]  
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: file id of the file to download
 *       - in: query
 *         name: downloadpath
 *         schema:
 *           type: string
 *         description: path to save the file
 *     responses:
 *       "200":
 *         description: File downloaded
 *       "500":
 *         description: Error downloading file
 */

/**
 * @swagger
 * /v1/dbx/list:
 *   post:
 *     summary: list a file to the Dropbox
 *     tags: [DROPBOX]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderId
 *               - cursor
 *               - limit
 *             properties:
 *               folderId:
 *                 type: string
 *               cursor:
 *                 type: string
 *               limit:
 *                 type: number
 *             example:
 *               folderId: 1684535465
 *               cursor: fidscvbsliuvbwe;iguedivievg;aeifhu;ief;awugeil
 *               limit: 10
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */


/**
 * @swagger
 * /v1/dbx/read:
 *   get:
 *     summary: read a file from the Dropbox
 *     tags: [DROPBOX]
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: file id of the file to read
 */