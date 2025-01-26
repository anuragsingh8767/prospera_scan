import express from 'express';
import * as fileValidation from '../../Validation/ghub.file.validation.js';
import * as fileController from '../../Controllers/ghub.file.controller.js';
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
    .route('/list/repo')
    .post(authenticate(fileValidation.listrepo), fileController.listRepos);

router
    .route('/delete')
    .delete(authenticate(fileValidation.deletefile), fileController.deleteFile);

router
    .route('/read')
    .get(authenticate(fileValidation.readfile), fileController.readFile);

export default router;

/**
 * @swagger
 * /v1/ghub/delete:
 *   delete:
 *     summary: delete a file from the repo
 *     tags: [GITHUB]
 *     parameters:
 *       - in: query
 *         name: repo
 *         schema:
 *           type: string
 *         description: name of the repo to delete the file from
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: sha of the file to delete
 *       - in: query
 *         name: message
 *         schema:
 *           type: number
 *         description: commit message
 *     responses:
 *       "200":
 *         description: file deleted
 *       "400":
 *         description: file not found
 *       "500":
 *         description: Error deleting file
 */

/**
 * @swagger
 * /v1/ghub/download:
 *   get:
 *     summary: download a repo 
 *     tags: [GITHUB]
 *     parameters:
 *       - in: query
 *         name: repo
 *         schema:
 *           type: string
 *         description: name of the repo to download
 *       - in: query
 *         name: downloadpath
 *         schema:
 *           type: string
 *         description: path to download the repo
 *     responses:
 *       "200":
 *         description: Repo downloaded
 *       "500":
 *         description: Error downloading Repo
 */

/**
 * @swagger
 * /v1/ghub/list:
 *   post:
 *     summary: list files in the repo
 *     tags: [GITHUB]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - repo
 *               - path
 *               - limit
 *               - page
 *             properties:
 *               repo:
 *                 type: string
 *               path:
 *                 type: string
 *               limit:
 *                 type: number
 *               page:
 *                 type: number
 *             example:
 *               repo: example
 *               path: ./example/fo/der
 *               limit: 10
 *               page: 1
 *     responses:
 *       "200":
 *         description: File listed
 *       "500":
 *         description: Error listing file
 */


/**
 * @swagger
 * /v1/ghub/read:
 *   get:
 *     summary: read a file from the repo
 *     tags: [GITHUB]
 *     parameters:
 *       - in: query
 *         name: repo
 *         schema:
 *           type: string
 *         description: name of the repo to read from
 *       - in: query
 *         name: fileId
 *         schema:
 *           type: string
 *         description: id of the file to read
 *     responses:
 *       "200":
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 */

/**
 * @swagger
 * /v1/ghub/upload:
 *   post:
 *     summary: upload a file to the repo
 *     tags: [GITHUB]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - repo
 *               - path
 *               - message
 *             properties:
 *               schema:
 *                 type: string
 *               table:
 *                 type: string
 *               record:
 *                 type: string
 *             example:
 *               repo: public
 *               path: ./example/folder
 *               message: first commit
 *     responses:
 *       "200":
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 */