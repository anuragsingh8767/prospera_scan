import express from 'express';
import * as fileValidation from '../../Validation/slack.file.validation.js';
import * as fileController from '../../Controllers/slack.file.controller.js';
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
 * /v1/slack/upload:
 *   post:
 *     summary: upload a file to the bucket
 *     tags: [SLACK]
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *         description: name of the channel to upload the file
 *       - in: query
 *         name: filepath
 *         schema:
 *           type: string
 *         description: path to the file
 *       - in: query
 *         name: fileComment
 *         schema:
 *           type: string
 *         description: comment to add to the file
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */

/**
 * @swagger
 * /v1/slack/delete:
 *   delete:
 *     summary: delete a file from the bucket
 *     tags: [SLACK]
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
 * /v1/slack/download:
 *   get:
 *     summary: download a file from the bucket
 *     tags: [SLACK]
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
 * /v1/slack/list:
 *   post:
 *     summary: Upload a file to the bucket
 *     tags: [SLACK]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageToken
 *               - pageSize
 *             properties:
 *               pageToken:
 *                 type: string
 *               pageSize:
 *                 type: number
 *             example:
 *               pageToken: 1sdaf68453f5asd465
 *               pageSize: 10
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */


/**
 * @swagger
 * /v1/slack/read:
 *   get:
 *     summary: read a file from the bucket
 *     tags: [SLACK]
 *     parameters:
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: file id of the file to read
 */