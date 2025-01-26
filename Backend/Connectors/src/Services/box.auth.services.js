import BoxSDK from 'box-node-sdk';
import axios from 'axios';
import {box_setTokens} from './token.services.js';

// const sdk = new BoxSDK({
//     clientID: box.config.clientId,
//     clientSecret: box.config.clientSecret
// });

function validatee(res){
    const redirectUri = `http://localhost:5000/v1/boxauth/callback`;

    const authURL = sdk.getAuthorizeURL({
        response_type: 'code',
        redirect_uri: redirectUri,
        state: 'security_token'
    });

    res.redirect(authURL);
};

async function callback(req, res){
    const authCode = req.query.code;
    try {
        const tokenResponse = await axios.post('https://api.box.com/oauth2/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: authCode,
            client_id: `${box.config.clientId}`,
            client_secret: `${box.config.clientSecret}`,
            redirect_uri: 'http://localhost:5000/v1/auth/callback'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;
        box_setTokens(accessToken, refreshToken);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during OAuth callback:', error.response ? error.response.data : error.message);
        res.status(500).send('Authentication failed');
    }
};

const refreshAccessToken = async (refreshToken) => {
    try {
        const tokenResponse = await axios.post('https://api.box.com/oauth2/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: `${box.config.clientId}`,
            client_secret: `${box.config.clientSecret}`
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = tokenResponse.data;
        box_setTokens(access_token, refresh_token);

        return tokenResponse.data;
    } catch (error) {
        console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to refresh access token');
    }
};

export {
    validatee,
    callback,
    refreshAccessToken
};