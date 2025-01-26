import * as con from '../Utils/connection.js';
import {getcred} from '../Utils/getCred.js';

let result;
async function testconnection(cred_name,type,req,res) {
    if(!cred_name || !type){
        return res.status(400).send('cred-name and type are required');
    }
    try {
        let Res= await getcred(req,res);

        switch(type)
        {
            case "mongo":
                result=await con.MongoConnection(req,res);
                if(!result || result===null){
                    return res.status(500).send('Failed to Connect to MongoDB');
                }
                else 
                    return res.status(200).send('Connected to MongoDB');

            case "opensearch":
                result=await con.opensearchConnection(req,res);
                if(!result || result===null){
                    return res.status(500).send('Failed to Connect to OpenSearch');
                }
                else 
                    return res.status(200).send('Connected to opensearch');

            case "smb":
                result=await con.smbConnection(req,res);
                if(!result || result===null){
                    return res.status(500).send('Failed to Connect to smb');
                }
                else 
                    return res.status(200).send('Connected to smb');


            case "box":
                result=await con.boxConnection(req,res);
                if(!result || result===null){
                    return res.status(500).send('Failed to Connect to Box');
                }
                else 
                    return res.status(200).send('Connected to Box');


            case "mysql":
                result=await con.mysqlConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to Mysql');
                else 
                    return res.status(200).send('Connected to Mysql');


            case "postgres":
                result=await con.postgresConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to Postgres');
                else 
                    return res.status(200).send('Connected to Postgres');
    

            case "S3":
                result=await con.s3Connection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to S3');
                else 
                    return res.status(200).send('Connected to S3');


            case "elastic":
                result=await con.elasticConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to elastic');
                else 
                    return res.status(200).send('Connected to elastic');


            case "github":
                result=await con.githubConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Faile to Connect to github');
                else 
                    return res.status(200).send('Connected to github');


            case "slack":
                result=await con.slackConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to slack');
                else 
                    return res.status(200).send('Connected to slack');


            case "gdrive":
                result=await con.gdriveConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to gdrive');
                else 
                    return res.status(200).send('Connected to gdrive');

            case "nfs":
                result=await con.nfsConnection(req,res);
                if(!result || result===null)
                    return res.status(500).send('Failed to Connect to nfs');
                else 
                    return res.status(200).send('Connected to nfs');

                
        }
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).send('Internal Server Error');
    }

}

export { testconnection };