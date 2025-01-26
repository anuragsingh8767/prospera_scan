// src/utils/validation.js

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
    return password.length >= 4;
};

export const validateUsername = (username) => {
    const re = /^[a-zA-Z][a-zA-Z0-9-_]{2,19}$/;
    return re.test(String(username));
};