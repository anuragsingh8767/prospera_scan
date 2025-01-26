import express from 'express';
import * as S3Validation from '../../Validation/S3.file.validation.js';
import * as S3Controller from '../../Controllers/S3.file.controller.js';
import authenticate from '../../Middleware/authenticate.js';

const router = express.Router();

router
    .route('/upload')
    .post(authenticate(S3Validation.uploadfile), S3Controller.uploadFile);

router
    .route('/download')
    .get(authenticate(S3Validation.downloadfile), S3Controller.downloadFile);

router
    .route('/list')
    .post(authenticate(S3Validation.listfile), S3Controller.listFiles);

router
    .route('/delete')
    .delete(authenticate(S3Validation.deletefile), S3Controller.deleteFile);

router
    .route('/read')
    .get(authenticate(S3Validation.readfile), S3Controller.readFile);

export default router;

/**
 * @swagger
 * /v1/S3/upload:
 *   post:
 *     summary: upload a file to the bucket
 *     tags: [S3]
 *     parameters:
 *       - in: query
 *         name: bucketname
 *         schema:
 *           type: string
 *         description: bucket name
 *       - in: query
 *         name: filepath
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
 * /v1/S3/delete:
 *   delete:
 *     summary: delete a file from the bucket
 *     tags: [S3]
 *     parameters:
 *       - in: query
 *         name: bucketname
 *         schema:
 *           type: string
 *         description: bucket name
 *       - in: query
 *         name: filepath
 *         schema:
 *           type: string
 *         description: path to the file
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
 * /v1/S3/download:
 *   get:
 *     summary: download a file from the bucket
 *     tags: [S3]
 *     parameters:
 *       - in: query
 *         name: bucketname
 *         schema:
 *           type: string
 *         description: bucket name
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *         description: name if of the file to download
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
 * /v1/S3/list:
 *   post:
 *     summary: list a file to the bucket
 *     tags: [S3]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bucketname
 *               - pagesize
 *               - continuationtoken
 *             properties:
 *               bucketname:
 *                 type: string
 *               pageSize:
 *                 type: number
 *               continuationToken:
 *                 type: string
 *             example:
 *               bucketname: testbucket
 *               pageSize: 10
 *               continuationToken: dfbfdbvkbefigefksdbvisdugvfb
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */


/**
 * @swagger
 * /v1/S3/read:
 *   get:
 *     summary: read a file from the bucket
 *     tags: [S3]
 *     parameters:
 *       - in: query
 *         name: bucketname
 *         schema:
 *           type: string
 *         description: bucket name
 *       - in: query
 *         name: filepath
 *         schema:
 *           type: string
 *         description: file to the file
 */