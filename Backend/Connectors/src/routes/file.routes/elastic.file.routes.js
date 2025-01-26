import express from 'express';
import authenticate from '../../Middleware/authenticate.js';
import * as fileValidation from '../../Validation/elastic.file.validation.js';
import * as fileController from '../../Controllers/elastic.file.controller.js';

const router = express.Router();

router
    .route('/list')
    .post(authenticate(fileValidation.listFiles), fileController.listFiles);

router
    .route('/upload')
    .post(authenticate(fileValidation.uploadFile), fileController.uploadFile);

router
    .route('/download')
    .get(authenticate(fileValidation.downloadFile), fileController.downloadFile);

router
    .route('/delete')
    .delete(authenticate(fileValidation.deleteFile), fileController.deleteFile);

    router
    .route('/read')
    .get(authenticate(fileValidation.readFile), fileController.readFile);

export default router;

/**
 * @swagger
 * /v1/elastic/upload:
 *   post:
 *     summary: upload a file to the elastic search
 *     tags: [ELASTIC SEARCH]
 *     parameters:
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *         description: Id of the folder where to upload the file
 *       - in: query
 *         name: indexName
 *         schema:
 *           type: string
 *         description: path to the file
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */

/**
 * @swagger
 * /v1/elastic/delete:
 *   delete:
 *     summary: delete a file from the elastic search
 *     tags: [ELASTIC SEARCH]
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
 * /v1/elastic/download:
 *   get:
 *     summary: download a file from the elastic search
 *     tags: [ELASTIC SEARCH]
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
 * /v1/elastic/list:
 *   post:
 *     summary: list a file from the elastic search
 *     tags: [ELASTIC SEARCH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderId
 *               - indexName
 *               - limit
 *               - offset
 *             properties:
 *               folderId:
 *                 type: string
 *               indexName:
 *                 type: string
 *               offset:
 *                 type: number
 *               limit:
 *                 type: number
 *             example:
 *               folderId: 1684535465
 *               indexName: eaxmple
 *               limit: 10
 *               offset: 0
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */


/**
 * @swagger
 * /v1/elastic/read:
 *   get:
 *     summary: read a file from the elastic search
 *     tags: [ELASTIC SEARCH]
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: file id of the file to read
 */