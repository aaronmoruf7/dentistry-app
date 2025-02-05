"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
//extract token from headers
const getTokenFromHeaders = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return undefined;
};
// use expressjwt to check the token and place the payload (defined where I made the token - in auth.services) in the auth object
const auth = {
    required: (0, express_jwt_1.expressjwt)({
        secret: process.env.JWT_SECRET || 'superSecret',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
    optional: (0, express_jwt_1.expressjwt)({
        secret: process.env.JWT_SECRET || 'superSecret',
        credentialsRequired: false,
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
};
exports.default = auth;
