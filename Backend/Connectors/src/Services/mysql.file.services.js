import fs from 'fs/promises';
import csv from 'csv-parser';
import * as con from '../Utils/connection.js';
import path from 'path';




async function listFiles(page, limit, offset, req, res) {
    try {
        const connectionResult = await con.mysqlConnection(req, res);
        if (!connectionResult) 
            return res.status(500).send('Error establishing database connection.');
        const { connection, database: schema } = connectionResult;
        const calculatedOffset = ((page - 1) * limit + offset) - 1;

        const [tables] = await connection.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_type = 'BASE TABLE' AND table_schema = ?
            ORDER BY table_name
            LIMIT ? OFFSET ?
        `, [schema, limit, calculatedOffset]);

        const totalTables = tables.length;
        const paginatedTables = tables.slice(0, limit);

        res.json({
            page,
            limit,
            totalTables,
            totalPages: Math.ceil(totalTables / limit),
            tables: paginatedTables,
        });
    } catch (error) {
        console.error('Error listing tables:', error);
        return res.status(500).send('Internal server error.');
    }
}


async function readFile(table, page, limit, offset, req, res) {
    try {
        const connectionResult = await con.mysqlConnection(req, res);
        if (!connectionResult) 
            return res.status(500).send('Error establishing database connection.');
        const { connection, database: schema } = connectionResult;
        const calculatedOffset = ((page - 1) * limit + offset) - 1;

        const [results] = await connection.query(`SELECT * FROM ${schema}.${table} LIMIT ${limit} OFFSET ${calculatedOffset}`);

        if (results.length === 0) {
            return res.status(404).send(`Table ${table} not found in database ${schema}`);
        }

        res.json(results);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).send('Internal server error.');
    }
}




async function uploadFile(tableName, filePath, req, res) {
    try {
        const connectionResult = await con.mysqlConnection(req, res);
        if (!connectionResult) 
            return res.status(500).send('Error establishing database connection.');

        const { connection, database: schema } = connectionResult;

        if (!filePath || !tableName || !schema) {
            return res.status(400).send('File path, table name, and database name are required.');
        }

        if (!fs.existsSync(filePath)) {
            return res.status(400).send('File path does not exist.');
        }

        if (fs.lstatSync(filePath).isDirectory()) {
            return res.status(400).send('File path is a directory.');
        }

        await connection.query(`USE \`${schema}\``);

        const [tables] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length > 0) {
            return res.status(400).send('Table already exists.');
        }

        // Read and parse CSV file
        const resultsArray = [];
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(csv({ headers: false }))
            .on('data', (data) => resultsArray.push(data))
            .on('end', async () => {
                if (resultsArray.length === 0) {
                    return res.status(400).send('Empty CSV file.');
                }

                const columnNames = Object.keys(resultsArray[0]);
                const columns = columnNames.map(name => `\`${name}\` TEXT`).join(',');

                const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
                await connection.query(createTableQuery);

                // Construct placeholders for the parameterized query
                const numColumns = columnNames.length;
                const placeholders = `(${Array(numColumns).fill('?').join(',')})`;
                const insertPlaceholders = Array(resultsArray.length).fill(placeholders).join(',');
                const values = resultsArray.flatMap(row => columnNames.map(name => row[name]));

                // Insert data into the newly created table
                const insertQuery = `INSERT INTO ${tableName} (${columnNames.map(name => `\`${name}\``).join(',')}) VALUES ${insertPlaceholders}`;
                await connection.query(insertQuery, values);

                res.send('CSV file successfully processed and data inserted into the database.');
            })
            .on('error', (fileError) => {
                console.error('Error reading CSV file:', fileError);
                res.status(500).send('Error reading CSV file.');
            });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Internal server error.');
    }
}



async function deleteFile(table, id, req, res) {
    try {
        const connectionResult = await con.mysqlConnection(req, res);
        if (!connectionResult) 
            return res.status(500).send('Error establishing database connection.');
        const { connection, database: schema } = connectionResult;
        // Validate inputs
        if (!table || !id) {
            return res.status(400).json({ error: 'Table name and ID are required.' });
        }

        // Ensure table name is safe to use in query
        if (!/^[a-zA-Z0-9_]+$/.test(table)) {
            return res.status(400).json({ error: 'Invalid table name.' });
        }

        const deleteQuery = 'DELETE FROM ?? WHERE id = ?';

        const [result] = await connection.query(deleteQuery, [table, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found.' });
        }

        res.json({ message: `Record with ID ${id} deleted successfully from table ${table}.` });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).send('Error deleting record.');
    }
}


async function downloadFile(table, directoryPath, req, res) {
    try {
        const { connection, database: schema } = await con.mysqlConnection(req, res);

        // Create the directory if it doesn't exist
        await fs.mkdir(directoryPath, { recursive: true });

        const [results] = await connection.query(`SELECT * FROM ${schema}.${table}`);

        if (results.length === 0) {
            return res.status(404).send(`Table ${table} not found in database ${schema}`);
        }

        const csv = results.map(row => Object.values(row).join(',')).join('\n');
        const filePath = path.join(directoryPath, `${table}.csv`);

        await fs.writeFile(filePath, csv);

        res.json({ message: 'CSV file saved successfully', filePath });
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Internal server error.');
    }
}




    async function insertRecord(table_name, record, req, res) {
        try {
            const connectionResult = await con.mysqlConnection(req, res);
            if (!connectionResult) 
                return res.status(500).send('Error establishing database connection.');
            const { connection, database: schema } = connectionResult;    
            const { id } = record;
    
            if (!table_name || !record) {
                return res.status(400).json({ error: 'Table name and record are required.' });
            }
            if (!id || typeof id !== 'number' || id <= 0) {
                return res.status(400).json({ error: 'A valid ID is required and must be greater than 0.' });
            }
    
            const checkQuery = `SELECT 1 FROM \`${table_name}\` WHERE id = ?`;
            const [checkResult] = await connection.query(checkQuery, [id]);
    
            if (checkResult.length > 0) {
                return res.status(400).json({ error: 'ID already exists.' });
            }
    
            const columns = Object.keys(record).map(key => `\`${key}\``).join(', ');
            const placeholders = Object.keys(record).map(() => '?').join(', ');
            const values = Object.values(record);
    
            const query = `INSERT INTO \`${table_name}\` (${columns}) VALUES (${placeholders})`;
            await connection.query(query, values);
    
            res.status(200).json({ message: 'Record added successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
        }
    }

//Function to update a record
async function updateRecord(table_name, record, req, res) {
    try {
        const connectionResult = await con.mysqlConnection(req, res);
        if (!connectionResult) 
            return res.status(500).send('Error establishing database connection.');
        const { connection, database: schema } = connectionResult;
        const { id } = record;

        if (!table_name || !record) {
            return res.status(400).json({ error: 'Table name and record are required.' });
        }
        if (!id || typeof id !== 'number' || id <= 0) {
            return res.status(400).json({ error: 'A valid ID is required and must be greater than 0.' });
        }

        const checkQuery = `SELECT 1 FROM \`${table_name}\` WHERE id = ?`;
        const [checkResult] = await connection.query(checkQuery, [id]);

        if (checkResult.length > 0) {
            const columns = Object.keys(record).map(key => `\`${key}\` = ?`).join(', ');
            const values = [...Object.values(record), id];

            const updateQuery = `UPDATE \`${table_name}\` SET ${columns} WHERE id = ?`;
            await connection.query(updateQuery, values);

            res.status(200).json({ message: 'Record updated successfully' });
        } else {
            res.status(400).json({ error: 'ID does not exist.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
}



export { listFiles, readFile, uploadFile, deleteFile, downloadFile,insertRecord,updateRecord };
