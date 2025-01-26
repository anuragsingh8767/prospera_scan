import express from 'express';
import * as fileValidation from '../../Validation/postgres.file.validation.js';
import * as fileController from '../../Controllers/postgres.file.controller.js';
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

router
    .route('/update')
    .post(authenticate(fileValidation.updateRecord), fileController.updateRecord);

router
    .route('/insert')
    .post(authenticate(fileValidation.insertRecord), fileController.insertRecord);

export default router;


/**
 * @swagger
 * '/v1/connector/delete':
 *   delete:
 *     summary: delete a record from the table
 *     tags: [POSTGRES]
 *     parameters:
 *       - in: query
 *         name: schema
 *         schema:
 *           type: string
 *         description: name of the schema to delete the record
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: name of the table to ddlete the record from
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: id of the record
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
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
 *     tags: [POSTGRES]
 *     parameters:
 *       - in: query
 *         name: schema
 *         schema:
 *           type: string
 *         description: name of the schema to download the table from
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
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
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
 *         description: File downloaded
 *       "500":
 *         description: Error downloading file
 */

/**
 * @swagger
 * /v1/connector/list:
 *   post:
 *     summary: list the tables in the schema or list the schemas if schema name is not provided
 *     tags: [POSTGRES]
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
 *               - schema
 *               - cred_name
 *               - type
 *             properties:
 *               page:
 *                 type: number
 *               limit:
 *                 type: number
 *               offset:
 *                 type: number
 *               schema:
 *                 type: string
 *               cred_name:
 *                 type: string
 *               type:
 *                 type: string
 *             example:
 *               page: 1
 *               limit: 10
 *               offset: 1
 *               schema: public
 *               cred_name: example
 *               type: example 
 *     responses:
 *       "200":
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 */


/**
 * @swagger
 * /v1/connector/read:
 *   get:
 *     summary: read a table from the schema
 *     tags: [POSTGRES]
 *     parameters:
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: name of the table to read from
 *       - in: query
 *         name: schema
 *         schema:
 *           type: string
 *         description: name of the schema to read from
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
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
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
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 */

/**
 * @swagger
 * /v1/connector/update:
 *   post:
 *     summary: update a record in the table
 *     tags: [POSTGRES]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schema
 *               - table
 *               - record
 *               - cred_name
 *               - type
 *             properties:
 *               schema:
 *                 type: string
 *               table:
 *                 type: string
 *               record:
 *                 type: object
 *               cred_name:
 *                type: string
 *               type:
 *                 type: string
 *             example:
 *               schema: public
 *               table: capital
 *               record: {"schema":"public","table":"capital","record":{"id":1,"country":"test","capital":"test"}} 
 *     responses:
 *       "200":
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 */

/**
 * @swagger:
 *'/v1/connector/insert':
 *   post:
 *     summary: insert a record in the table
 *     tags: [POSTGRES]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schema
 *               - table
 *               - record
 *               - cred_name
 *               - type
 *             properties:
 *               schema:
 *                 type: string
 *               table:
 *                 type: string
 *               record:
 *                 type: object
 *               cred_name:
 *                 type: string
 *               type:
 *                 type: string
 *             example:
 *               schema: public
 *               table: capital
 *               record: {"schema":"public","table":"random","record":{"id":1,"name":"test"}}
 * 
 *     responses:
 *       "200":
 *         description: tables listed
 *       "500":
 *         description: Error listing file
 */
