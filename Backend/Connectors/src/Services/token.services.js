var box_accessToken;
var box_refreshToken;
var dbx_accessToken;
var dbx_refreshToken;

const box_setTokens = (newAccessToken, newRefreshToken) => {
    box_accessToken = newAccessToken;
    box_refreshToken = newRefreshToken;
};

const box_getTokens = () => { 
    return {box_accessToken, box_refreshToken};
};

const dbx_setTokens = (newAccessToken, newRefreshToken) => {
    dbx_accessToken = newAccessToken;
    dbx_refreshToken = newRefreshToken;
};

const dbx_getTokens = () => { 
    return {dbx_accessToken, dbx_refreshToken};
};

export {
    box_setTokens,
    box_getTokens,
    dbx_setTokens,
    dbx_getTokens
};