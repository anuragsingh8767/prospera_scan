import express from 'express';
import userRoutes from './user.routes.js';
import S3Routes from './file.routes/S3.file.routes.js';
import boxRoutes from './file.routes/box.file.routes.js';
import boxauthRoutes from './auth.routes/box.auth.routes.js';
import slackRoutes from '../routes/file.routes/slack.file.routes.js';
import mysqlRoutes from '../routes/file.routes/mysql.file.routes.js';
import postgresRoutes from '../routes/file.routes/postgres.file.routes.js';
import dbxRoutes from '../routes/file.routes/dbx.file.routes.js';
import dbxauthRoutes from './auth.routes/dbx.auth.routes.js'
import ghubRoutes from './file.routes/ghub.file.routes.js';
import gdriveRoutes from './file.routes/gdrive.file.routes.js';
import mongoRoutes from './file.routes/mongo.file.routes.js';
import elasticRoutes from './file.routes/elastic.file.routes.js';
import listCredRoutes from './listcredentials.route.js';
import testConnectionRoutes from './test.file.route.js';
import smbRoutes from './file.routes/smb.file.routes.js';
import nfsRoutes from './file.routes/nfs.file.routes.js';
import opensearchRoutes from './file.routes/opensearch.file.routes.js';
import conTypeRoutes from './conType.routes.js';

const router = express.Router({ mergeParams: true });

router.use('/user', userRoutes);
router.use('/boxauth', boxauthRoutes);
router.use('/dbxauth', dbxauthRoutes);
router.use('/connectors', conTypeRoutes);
router.use('/connection', listCredRoutes);
router.use('/testconnection', testConnectionRoutes);

router.use('/connector', (req, res, next) => {
    const { type } = req.body;
    const routes = {
        'S3': S3Routes,
        'box': boxRoutes,
        'slack': slackRoutes,
        'mysql': mysqlRoutes,
        'postgres': postgresRoutes,
        'dbx': dbxRoutes,
        'github': ghubRoutes,
        'gdrive': gdriveRoutes,
        'mongo': mongoRoutes,
        'elastic': elasticRoutes,
        'smb': smbRoutes,
        'nfs': nfsRoutes,
        'opensearch': opensearchRoutes
    };

    const routeHandler = routes[type];

    if (routeHandler) {
        return routeHandler(req, res, next);
    } else {
        return res.status(404).send('Invalid connector type');
    }

});

export default router;