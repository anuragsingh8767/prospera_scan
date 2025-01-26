// Dotenv Configuration
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: `${__dirname}/../${envFile}` });


// Tokens
var accessToken;
var refreshToken;

const setTokens = (newAccessToken, newRefreshToken) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
};

const getTokens = () => {
    return { accessToken, refreshToken };
};

export {
    setTokens,
    getTokens
}


// App Server Configuration
import express from 'express';
import multer from 'multer';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());


// Middleware setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


// Swagger Settings
if (process.env.NODE_ENV == 'development') {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Application',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:5000',
                },
            ],
        },
        apis: ['./src/routes/file.routes/*.js'],
    }

    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}


// Mounting routes
app.use('/v1', routes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}\n\n`);
});

export default app;
