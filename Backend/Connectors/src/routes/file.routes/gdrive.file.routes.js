import express from 'express';
import * as fileValidation from '../../Validation/gdrive.file.validation.js';
import * as fileController from '../../Controllers/gdrive.file.controller.js';
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
 * /v1/gdrive/upload:
 *   post:
 *     summary: upload a file to the drive
 *     tags: [GOOGLE DRIVE]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: rename the file to this name
 *       - in: query
 *         name: filepath
 *         schema:
 *           type: string
 *         description: path to the file
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *         description: folder id to upload the file
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */

/**
 * @swagger
 * /v1/gdrive/delete:
 *   delete:
 *     summary: delete a file from the drive
 *     tags: [GOOGLE DRIVE]
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
 * /v1/gdrive/download:
 *   get:
 *     summary: download a file from the drive
 *     tags: [GOOGLE DRIVE]
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
 * /v1/gdrive/list:
 *   post:
 *     summary: Upload a file to the bucket
 *     tags: [GOOGLE DRIVE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderId
 *               - limit
 *               - pageToken
 *             properties:
 *               folderId:
 *                 type: string
 *               limit:
 *                 type: number
 *               pageToken:
 *                 type: string
 *             example:
 *               folderId: kjfhvekfusvfusdb
 *               limit: 10
 *               pageToken: laihbfoeugfbsiluhf
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */


/**
 * @swagger
 * /v1/gdrive/read:
 *   get:
 *     summary: read a file from the bucket
 *     tags: [GOOGLE DRIVE]
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: file id of the file to read
 *     responses:
 *       "200":
 *         description: File read
 *       "500":
 *         description: Error reading file
 */