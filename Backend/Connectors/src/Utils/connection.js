import mongoose from 'mongoose';
import mysql from 'mysql2/promise';
import pg from 'pg';
import AWS from 'aws-sdk';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { google } from 'googleapis';
import { Octokit } from '@octokit/rest';
import { WebClient } from '@slack/web-api';
import BoxSDK from 'box-node-sdk';
import {getcred} from './getCred.js';
import { box_getTokens } from '../Services/token.services.js';
import smb2 from 'smb2';
import { Client as OpenSearchClient} from '@opensearch-project/opensearch';



const {Pool}=pg
let config;




async function MongoConnection(req,res) {
    config = await getcred(req,res);

    if (!config) {
        console.log('MongoDB configuration is required to create a connection');
        return null;
    }
    try{
        let user = config.user;
        let password = config.password;
        let host = config.host;
        let schema = config.schema;
        let uri =`mongodb+srv://${user}:${password}@${host}.mongodb.net/${schema}`;
        let Connection = mongoose.createConnection(uri, {});
        return new Promise((resolve, reject) => {
            Connection.on('connected', () => {
                console.log("connected to mongodb")
                resolve(Connection);
            });
            Connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
                reject(err);
                
            });
        }).then((Connection) =>{
            return Connection;
        }).catch((error) => {
            console.error('Error creating MongoDB connection:', error.message);
            return null;
        });
    }catch(error){
        console.error('Error creating MongoDB connection:', error.message);
        return null;
    }
}


async function mysqlConnection(req,res) {
    config = await getcred(req,res);
    if (!config) {
        console.log('MySQL configuration is required to create a connection');
        return null;
    }
    let connection;
    try{
        connection = mysql.createPool({
        host: config.HOST,
        user: config.USER,
        password: config.PASSWORD,
        database: config.DATABASE
    });
    let database= config.DATABASE;
    await connection.query('SELECT 1');
    console.log('MySQL connection established successfully');
        return {connection,database}
}catch(error){
    console.error('Error creating MySQL connection:', error.message);
    return null;

}}


async function postgresConnection(req,res) {
    config = await getcred(req,res);

    if (!config) {
        console.log('Postgres configuration is required to create a connection');
        return null;
    }
    let pool;
    try{
        pool = new Pool({
        host: config.HOST,
        user: config.USER,
        password: config.PASSWORD,
        database: config.DATABASE,
    });
    await pool.query('SELECT 1');
        console.log('Postgres connection established successfully');
        return pool;

}catch(error){
    console.error('Error creating Postgres connection:', error.message);
    return null;
}
}



async function s3Connection(req,res) {
    config = await getcred(req,res);

    if (!config) {
        console.log('S3 configuration is required to create a connection');
        return null;
    }
    let s3;
    try{
    s3 = new AWS.S3({
        accessKeyId: config.AccessKeyId,
        secretAccessKey:config.SecretAccessKey,
        region:config.Region,
    });
    await s3.listBuckets().promise();
    return s3;
}catch(error){
    console.log('Error creating Postgres connection:', error.message);
    return null;

}
}

async function elasticConnection(req,res){
    config = await getcred(req,res);

    if(!config){
        console.log('Elastic configuration is required to create a connection');
        return null;
    }
    let client;
    try {
        client = new ElasticSearchClient({
            node: config.node, // Use https if your Elasticsearch is configured for it
            auth: {
                username: config.username,
                password: config.password
            },
            tls: {
                rejectUnauthorized: false // Disable certificate verification
            }
        });
        const health = await client.ping();
        return client;
    }catch(error){
        console.error('Error creating Elastic connection:', error.message);
        return null;
    }
}


async function gdriveConnection(req,res)
{
    config = await getcred(req,res);

    if(!config){
        console.log('Gdrive configuration is required to create a connection');
        return null;
    }
    try{
    let cred =config.service_key;
    let scope =config.scope;
    const auth = new google.auth.GoogleAuth({
        credentials: cred,
        scopes: scope,
    });
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.list({
        q: "'root' in parents",
        pageSize: 1,
        fields: 'files(id, name)',
    });

    if (response.data.files.length > 0) {
        console.log('Successfully connected to Google Drive');
        return {drive,auth};
    } 
}catch(error)
{
    console.error('Error creating Gdrive connection:', error.message);
    return null;
}
}


async function githubConnection(req,res)
{
    config = await getcred(req,res);

    if(!config){
        console.log('Github configuration is required to create a connection');
        return null;
    }
    try{
    let accessToken = config.accessToken;
    let owner = config.owner;
    let octokit = new Octokit({ auth: accessToken });
    let { data } = await octokit.rest.users.getAuthenticated();
    if (data && data.login) {
        console.log('Successfully connected to GitHub as', data.login);
        return {octokit,owner};
    } else {
        console.log('Failed to verify GitHub connection');
        return null;
    }
} catch(error){
    console.error('Error creating Github connection:', error.message);
    return null;
}
}



async function slackConnection(req,res)
{
    config = await getcred(req,res);

    if(!config){
        console.log('Slack configuration is required to create a connection');
        return null;
    }
    let token;
    try{
    token = config.token;
    // let client = config.client;
    let client = new WebClient(token);
    let response = await client.auth.test();
        
        if (response.ok) {
            return client;
        } else {
            console.log('Failed to verify Slack connection');
            return null;
        }
}catch(error){
    console.error('Error creating Slack connection:', error.message);
    return null;
}
}



async function boxConnection(req,res)
{
    config = await getcred(req,res);

    if(!config){
        console.log('Box configuration is required to create a connection');
        return null;
    }
    let sdk;
    try{
        sdk = new BoxSDK({
            clientID: config.clientID,
            clientSecret:config.clientSecret
        });

        let accessToken = box_getTokens().box_accessToken;
        let client = sdk.getBasicClient(accessToken);
        let user = await client.users.get(client.CURRENT_USER_ID);
        if (user) {
            return client;
        } else {
            console.log('Failed to verify Box connection');
            return null;
        }
}catch(error){
    console.error('Error creating Box connection:', error.message);
    return null;
}
}



async function smbConnection() {
    const smb2Client = new SMB2({
    share: "",
    domain: "",
    username: "",
    password: "",
    });
    return smb2Client
}


async function nfsConnection(req, res){
    config= await getcred(req,res);
    if(!config){
        console.log('nfs configuration is required to create a connection');
        return null;
    }
    try{
        let ROOT_FOLDER_PATH = config.rootpath;
        if (!ROOT_FOLDER_PATH) {
            console.log('Root folder path is required to create a connection');
            return null;
        }
        return ROOT_FOLDER_PATH;
    }catch{
        console.error('Error creating nfs connection:', error.message);
        return null;
    }
}


async function opensearchConnection(req,res) {
    config = await getcred(req,res);

    if (!config) {
        console.log('OpenSearch configuration is required to create a connection');
        return null;
    }
    try{
        let client = new OpenSearchClient({
            node: config.node,
            auth: {
                username: config.username,
                password: config.password
            },
            ssl: {
                rejectUnauthorized: false
            }
        });
        return client;
    
    }catch(error){
        console.error('Error creating OpenSearch connection:', error.message);
        return null;
    }
}

export {opensearchConnection, nfsConnection, boxConnection, mysqlConnection, postgresConnection, s3Connection, elasticConnection, gdriveConnection, githubConnection, slackConnection, MongoConnection, smbConnection };