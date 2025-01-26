import fs from 'fs';
import path from 'path';
import pg from 'pg';    
import { parse } from 'json2csv';
import * as con from '../Utils/connection.js';



// Function to list files
async function listFiles(page, limit, offset, schemaName, req,res) {
    offset-=1;
try {
    let pool = await con.postgresConnection(req,res);

    if (isNaN(page) || isNaN(limit) || isNaN(offset) || page < 1 || limit < 1 || offset < 0) {
        return res.status(400).json({ error: 'Invalid pagination parameters.' });
    }
    let query, countQuery, queryParams = [], countParams = [];

    if (schemaName) {
    query = `
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_type = 'BASE TABLE' AND table_schema = $1
        ORDER BY table_schema, table_name 
        LIMIT $2 OFFSET $3
    `;
    countQuery = `
        SELECT COUNT(*) 
        FROM information_schema.tables 
        WHERE table_type = 'BASE TABLE' AND table_schema = $1
    `;
    queryParams.push(schemaName, limit, offset);
    countParams.push(schemaName);
    } else {
    query = `
        SELECT schema_name 
        FROM information_schema.schemata 
        ORDER BY schema_name 
        LIMIT $1 OFFSET $2
    `;
    countQuery = `
        SELECT COUNT(*) 
        FROM information_schema.schemata
    `;
    queryParams.push(limit, offset);
    }

    const result = await pool.query(query, queryParams);
    const countResult = await pool.query(countQuery, countParams);
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No schemas or tables found.' });
    }
    res.json({
    page,
    limit,
    items: result.rows
    });
} catch (error) {
    console.error('Error listing items:', error);
    res.status(500).send('Error listing items.');
}
}




// Function to read files
async function readFile(table_name,schema_name, page, limit, offset, req,res) {
if (!table_name || !schema_name) {
return res.status(400).json({ error: 'Missing required parameters' });
}
let pool = await con.postgresConnection(req,res);
const calculatedOffset = ((page - 1) * limit + offset)-1;

try {
const client = await pool.connect();
try {
    const query = `SELECT * FROM ${schema_name}.${table_name} LIMIT $1 OFFSET $2`;
    const result = await client.query(query, [limit, calculatedOffset]);

    res.status(200).json(result.rows);
} catch (queryErr) {
    // console.error('Query error:', queryErr);
    res.status(500).json({ error: 'Failed to read records', details: queryErr.message });
} finally {
    client.release();
}
} catch (connErr) {
console.error('Connection error:', connErr);
res.status(500).json({ error: 'Failed to connect to the database' });
}

}




// Function to delete a file from a repository
async function deleteFile(schema_name,table_name, id, req,res) {
if(id<=-1){
    return res.status(400).json({ error: 'Invalid id' });
}    
if (!id || !table_name || !schema_name) {
    return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
    let pool = await con.postgresConnection(req,res);
    const client = await pool.connect();
    try {
        const query = `DELETE FROM ${schema_name}.${table_name} WHERE id = $1`;
        const result = await client.query(query, [id]);

        if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (queryErr) {
        res.status(500).json({ error: 'Failed to delete record',details: queryErr.message });
    } finally {
        client.release();
    }
    } catch (connErr) {
    console.error('Connection error:', connErr);
    res.status(500).json({ error: 'Failed to connect to the database' });
    }
};




// Function to download a table
async function downloadFile(schema_name,table_name, directory_path, req,res) {
if (!table_name || !schema_name || !directory_path) {
    return res.status(400).json({ error: 'Missing required parameters' });
}

try {
    let pool = await con.postgresConnection(req,res);
    const client = await pool.connect();
    try {
    const query = `SELECT * FROM ${schema_name}.${table_name}`;
    const result = await client.query(query);

    const csv = parse(result.rows);

    if (!fs.existsSync(directory_path)) {
        fs.mkdirSync(directory_path, { recursive: true });
    }

    const filePath = path.join(directory_path, `${table_name}.csv`);
    fs.writeFileSync(filePath, csv);

    res.status(200).json({ message: 'Table downloaded successfully', filePath });
    } catch (queryErr) {
    res.status(500).json({ error: 'Failed to download table', details: queryErr.message });
    } finally {
    client.release();
    }
} catch (connErr) {
    console.error('Connection error:', connErr);
    res.status(500).json({ error: 'Failed to connect to the database' });
}
}





async function updateRecord(schema_name, table_name, record, req,res) {
    const { id } = record;

    if (!schema_name || !table_name || !record) {
        return res.status(400).json({ error: 'Schema name, table name, and record are required.' });
    }
    if (!id || typeof id !== 'number' || id <= 0) {
        return res.status(400).json({ error: 'A valid ID is required and must be greater than 0.' });
    }

    try {
        let pool = await con.postgresConnection(req,res);
        const client = await pool.connect();

        try {
            const checkQuery = `SELECT 1 FROM ${schema_name}.${table_name} WHERE id = $1`;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rowCount > 0) {
                const columns = Object.keys(record).map((key, index) => `${key} = $${index + 1}`).join(', ');
                const values = [...Object.values(record), id];

                const updateQuery = `UPDATE ${schema_name}.${table_name} SET ${columns} WHERE id = $${values.length}`;
                await client.query(updateQuery, values);

                res.status(200).json({ message: 'Record updated successfully' });
            } else {
                res.status(400).json({ error: 'ID does not exist.' });
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
}





async function insertRecord(schema_name, table_name, record, req,res) {
    const { id } = record;

    if (!schema_name || !table_name || !record) {
        return res.status(400).json({ error: 'Schema name, table name, and record are required.' });
    }
    if (!id || typeof id !== 'number' || id <= 0) {
        return res.status(400).json({ error: 'A valid ID is required and must be greater than 0.' });
    }

    try {
        let pool = await con.postgresConnection(req,res);
        const client = await pool.connect();

        try {
            const checkQuery = `SELECT 1 FROM ${schema_name}.${table_name} WHERE id = $1`;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rowCount > 0) {
                return res.status(400).json({ error: 'ID already exists.' });
            }

            const columns = Object.keys(record).map(key => key).join(', ');
            const placeholders = Object.keys(record).map((_, index) => `$${index + 1}`).join(', ');
            const values = Object.values(record);

            const query = `INSERT INTO ${schema_name}.${table_name} (${columns}) VALUES (${placeholders})`;
            await client.query(query, values);

            res.status(200).json({ message: 'Record added successfully' });
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
}




export { listFiles, readFile, deleteFile, downloadFile,updateRecord, insertRecord };
