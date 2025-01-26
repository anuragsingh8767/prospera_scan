## Prerequisites

- Nodejs -v 21.5.0
- [Follow Node.js Documentation for more information](https://nodejs.org)
- npm -v 10.8.2
- [Follow npm Documentation for more information](https://docs.npmjs.com/)
- Before using any of the api's, configure the config file with the respective credentials. Below is the structure
```
src
 |-config
      |-<name of the connector>.config.json
```


## Installation of dev dependencies

Install npm dependencies

```bash
  npm i
```

## Starting the project

```bash
npm start

```
- This will start the project and will now be accessible using url

```
http://localhost:5000

```
- After installation and starting the project, you can use the below url to access the swagger doc for the api's.
```
http://localhost:5000/api-docs
```


# AMAZON S3

- Follow the Swagger doc for referals for the api's.
- To initially list all files, keep the conitnuationtoken field empty, and to list next batch of files, provide the token.

  # MYSQL

- Start the mysql server on a remote device and make sure its always on while testing
- Make sure both the devices are connected on the same network
- Follow the Swagger doc for referals for the api's.

# BOX


Below are the steps to follow before making any api calls:-

- Step 1 : 
Hit the url below -
```
http://localhost:5000/v1/boxauth/
```
- Step 2 :
Use the credentials to login and hit "Authorize" button.

- Step 3 : 
Click the the "Grant access to Box" button to grant the access for the api's.

- Step 4 : 
Now you can continue to use Postman or any other app to make api calls referring to the Swagger Doc.
