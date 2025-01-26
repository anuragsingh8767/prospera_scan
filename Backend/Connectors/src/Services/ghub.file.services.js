import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as con from "../Utils/connection.js";



async function listFiles(repo, path = '', limit = 50, page = 1, req,res) {
  const files = [];
  let hasNextPage = true;

  try {
    let {octokit,owner} = await con.githubConnection(req,res);
    while (hasNextPage && files.length < limit) {
      const { data, headers } = await octokit.repos.getContent({
        owner: owner,
        repo: repo,
        path: path,
        per_page: limit,
        page: page,
      });

      data.forEach(item => {
        if (item.type === 'file' && files.length < limit) {
          files.push({
            name: item.name,
            path: item.path,
            id: item.sha,
          });
        }
      });

      const linkHeader = headers.link;
      hasNextPage = linkHeader && linkHeader.includes('rel="next"');
      if (hasNextPage) {
        page++;
      } else {
        hasNextPage = false;
      }
    }

    res.send(files);
  } catch (error) {
    console.error(`Error fetching files: ${error.message}`);
  }
}

async function readFile(repo, fileId, req,res) {
  try {
    let {octokit,owner} = await con.githubConnection(req,res);
    const { data } = await octokit.repos.getContent({
      owner: owner,
      repo: repo,
      path: '', // You can leave this empty if you are using fileId
      ref: 'main'
    });

    const file = data.find(item => item.sha === fileId);
    console.log(file.name);

    if (file) {
      const fileContent = await octokit.repos.getContent({
        owner: owner,
        repo: repo,
        path: file.path,
        ref: 'main'
      });

      res.json(atob(fileContent.data.content));
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error reading file:', error.message);
    const status = error.response?.status || 500;
    const message = status === 401 ? 'Unauthorized - Invalid or expired token' :
                    status === 404 ? 'Not Found - Check repository ID and path' :
                    error.message;
    res.status(status).json({ error: message });
  }
}

async function uploadFile(repo, filePath, message, req,res) {
  try {
    let {octokit,owner} = await con.githubConnection(req,res);
      // Read the file content
      console.log('filePath:', filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      const encodedContent = Buffer.from(content).toString('base64');

      // Make the request to GitHub
      const response = await octokit.repos.createOrUpdateFileContents({
          owner: owner,
          repo,
          path: fileName,
          message,
          content: encodedContent
      });

      res.json(response.data);
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: error.message });
  }
}

// Endpoint to delete a file from a repository
async function deleteFile(repo, sha, message, req,res) {
  try {
    let {octokit,owner} = await con.githubConnection(req,res);
      // List the contents of the repository
      const { data: contents } = await octokit.repos.getContent({
          owner: owner,
          repo,
          path: ''
      });

      // Find the file path by matching the sha
      let filePath = null;
      for (const item of contents) {
          if (item.sha === sha) {
              filePath = item.path;
              break;
          }
      }

      if (!filePath) {
          throw new Error('File with the specified id not found');
      }

      // Delete the file using the found path
      const response = await octokit.repos.deleteFile({
          owner: owner,
          repo,
          path: filePath,
          message,
          sha
      });

      res.json(response.data);
  } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: error.message });
  }
}

async function downloadFile(repo, folderPath, req,res) {
  try {
    let {octokit,owner} = await con.githubConnection(req,res);
      // Ensure the folder exists, create it if it doesn't
      if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
      }

      // Define the file path
      const filePath = path.join(folderPath, `${repo.replace('/', '_')}.zip`);

      // Make the request to GitHub using Octokit
      const { url } = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
          owner: owner,
          repo: repo,
          ref: 'main'
      });

      // Make the actual download request using axios
      const response = await axios({
          url: url,
          method: 'GET',
          responseType: 'stream'
      });

      // Create a write stream to the file
      const fileStream = fs.createWriteStream(filePath);

      // Pipe the response data to the file
      response.data.pipe(fileStream);

      // Handle the end of the stream
      fileStream.on('finish', () => {
          res.status(200).send(`File downloaded successfully to ${filePath}`);
      });

      // Handle errors in the stream
      fileStream.on('error', (err) => {
          console.error('Error writing file:', err);
          res.status(500).json({ error: 'Error writing file' });
      });

  } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ error: error.message });
  }
}
export { listFiles, readFile, uploadFile, deleteFile, downloadFile };
