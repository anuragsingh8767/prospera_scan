import express from 'express';
import * as fileValidation from '../../Validation/mysql.file.validation.js';
import * as fileController from '../../Controllers/mysql.file.controller.js';
import authenticate from '../../Middleware/authenticate.js';

const router = express.Router();

router
    .route('/upload')
    .post(authenticate(fileValidation.uploadfile), fileController.uploadFile);

router
    .route('/insert')
    .post(authenticate(fileValidation.insertRecord), fileController.insertRecord);

router
    .route('/update')
    .post(authenticate(fileValidation.updateRecord), fileController.updateRecord);


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
 * /v1/connector/upload:
 *   post:
 *     summary: upload a table to the schema
 *     tags: [MYSQL]
 *     parameters:
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: Table name to upload the file
 *       - in: query
 *         name: filePath
 *         schema:
 *           type: string
 *         description: path to the file
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *          schema:
 *             type: object
 *             required:
 *              - cred_name
 *              - type
 *             properties:
 *              cred_name:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       "200":
 *         description: File Uploaded
 *       "500":
 *         description: Error uploading file
 */

/**
 * @swagger
 * /v1/connector/delete:
 *   delete:
 *     summary: delete a table from the schema
 *     tags: [MYSQL]
 *     parameters:
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: name of the table to delete
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: id of the record to be deleted
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - cred_name
 *                      - type
 *                  properties:
 *                      cred_name:
 *                          type: string
 *                      type:
 *                          type: string
 *     responses:
 *       "200":
 *         description: Table deleted
 *       "400":
 *         description: Table not found
 *       "500":
 *         description: Error deleting table
 */

/**
 * @swagger
 * /v1/connector/download:
 *   get:
 *     summary: download a table from the schema
 *     tags: [MYSQL]
 *     parameters:
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: name of the table to download
 *       - in: query
 *         name: path
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
 * /v1/mysql/list:
 *   post:
 *     summary: Upload a file to the bucket
 *     tags: [MYSQL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page
 *               - limit
 *               - offset
 *               - table
 *               - cred_name
 *               - type
 *             properties:
 *               page:
 *                 type: number
 *               limit:
 *                 type: number
 *               offset:
 *                 type: number
 *               table:
 *                 type: string
 *               cred_name:
 *                 type: string
 *               type:
 *                 type: string
 *             example:
 *               page: 1
 *               limit: 10
 *               offset: 2
 *               table: city
 *               cred_name: anurag-mysql
 *               type: mysql
 *     responses:
 *       "200":
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 *     security:
 *      - bearerAuth: []
 */

/**
 * @swagger
 * /v1/mysql/insert:
 *   post:
 *     summary: Insert a record to the table
 *     tags: [MYSQL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - table
 *               - record
 *             properties:
 *               table:
 *                 type: string
 *               record:
 *                 type: object
 *             example:
 *               table: customers
 *               record: {"id":1,"Customer Id":"edwefqefwefwef3add","First Name":"John","Last Name":"Doe","Company":"Prospera soft","City":"Pune","Country":"India","Phone 1":"872447474747","Phone 2":"23737231237","Email":"dnfajfhf@gmail.com","Subscription Date":"727237237","Website":"Netflix"}
 *     responses:
 *       "200":
 *         description: record inserted
 *       "500":
 *         description: Error inserting record
 */

/**
 * @swagger
 * /v1/connector/update:
 *   post:
 *     summary: Update a record in the table
 *     tags: [MYSQL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - table
 *               - record
 *             properties:
 *               table:
 *                 type: string
 *               record:
 *                 type: object
 *             example:
 *               table: customers
 *               record: {"id":1,"Customer Id":"edwefqefwefwef3add","First Name":"John","Last Name":"Doe","Company":"Prospera soft","City":"Pune", "Country":"India","Phone 1":"872447474747","Phone 2":"23737231237","Email":"dnfajfhf@gmail.com","Subscription Date":"727237237","Website":"Netflix"}
 *     responses:
 *       "200":
 *         description: record updated
 *       "500":
 *         description: Error updating record
 */



/**
 * @swagger
 * /v1/connector/read:
 *   get:
 *     summary: read a table from the schema
 *     tags: [MYSQL]
 *     parameters:
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: name of the table to read
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: number of pages to read
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: number of rows to read
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: index of the row to start reading
 *     responses:
 *         "200":
 *             description: Table read
 *         "500":
 *             description: Error reading file
 */
