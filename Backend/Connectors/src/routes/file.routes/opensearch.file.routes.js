import express from 'express';
import * as fileValidation from '../../Validation/opensearch.file.validation.js';
import * as fileController from '../../Controllers/opensearch.file.controller.js';
import authenticate from '../../Middleware/authenticate.js';

const router = express.Router();


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
 * /v1/mongo/delete:
 *   delete:
 *     summary: delete a document from the table
 *     tags: [MONGO]
 *     parameters:
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *         description: name of the collection where you want to delete a document
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: id of the document which you want to delete
 *     responses:
 *       "200":
 *         description: Document deleted
 *       "400":
 *         description: Document not found
 *       "500":
 *         description: Error deleting document
 */



/**
 * @swagger
 * /v1/mongo/list:
 *   post:
 *     summary: List all the collections in a database
 *     tags: [MONGO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - limit
 *               - page
 *               - token
 *             properties:
 *               limit:
 *                 type: number
 *               page:
 *                 type: number
 *               token:
 *                 type: string
 *             example:
 *               limit: 3
 *               page: 1
 *               token: 66b456c870ed940fcfe16619
 *     responses:
 *       "200":
 *         description: collections listed
 *       "400":
 *         description: Invalid input
 *       "500":
 *         description: Error listing collections
 */


/**
 * @swagger
 * /v1/mongo/read:
 *   get:
 *     summary: read documents from the collections
 *     tags: [MONGO]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: limit of the number of documents to read
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *         description: name of the collections where you want to read
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: number of pages to read
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: token to start reading from
 *     responses:
 *       "200":
 *         description: collections listed
 *       "400":
 *         description: Invalid input
 *       "500":
 *         description: Error listing collections
 */