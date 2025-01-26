import { Dropbox } from 'dropbox';
import axios from 'axios';
import querystring from 'querystring';
import { setTokens } from  '../app.js';

// const DROPBOX_CLIENT_ID = dbox.config.DROPBOX_CLIENT_ID;
// const DROPBOX_CLIENT_SECRET = dbox.config.DROPBOX_CLIENT_SECRET;
// const DROPBOX_REDIRECT_URI = 'http://localhost:5000/v1/dbxauth/callback';

async function validatee(res) {
    try {
        const dbx = new Dropbox({ clientId: DROPBOX_CLIENT_ID, fetch: fetch });
        const authUrl = await dbx.auth.getAuthenticationUrl(DROPBOX_REDIRECT_URI,null, 'code', 'offline');
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error generating authorization URL:', error.message);
        res.status(500).send('Error generating authorization URL');
    }
}

async function callback(req, res) {
    const { code } = req.query;

    if (!code) {
        console.error('No authorization code found in URL parameters');
        return res.status(400).send('No authorization code found in URL parameters');
    }

    try {
        const response = await axios.post(
            'https://api.dropboxapi.com/oauth2/token',
            querystring.stringify({
                code,
                grant_type: 'authorization_code',
                client_id: DROPBOX_CLIENT_ID,
                client_secret: DROPBOX_CLIENT_SECRET,
                redirect_uri: DROPBOX_REDIRECT_URI,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token: accessToken, refresh_token: refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching access token');
    }
}

async function refreshAccessToken(refreshToken) {
    try {
        const response = await axios.post(
            'https://api.dropboxapi.com/oauth2/token',
            querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: DROPBOX_CLIENT_ID,
                client_secret: DROPBOX_CLIENT_SECRET,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token: newAccessToken } = response.data;
        console.log('New access token received:', newAccessToken);
        setTokens(newAccessToken, refreshToken);
    } catch (error) {
        console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
        throw new Error('Error refreshing access token');
    }
}

export { validatee, callback, refreshAccessToken };
