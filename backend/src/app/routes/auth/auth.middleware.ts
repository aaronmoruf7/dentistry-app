import { expressjwt as jwt } from 'express-jwt';
import { Request } from 'express'

//extract token from headers
const getTokenFromHeaders = (req: Request): string | undefined => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' || 
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){

        return req.headers.authorization.split(' ')[1];
    }
    return undefined;
};

// use expressjwt to check the token and place the payload in the auth object
const auth = {
    required: jwt({
        secret: process.env.JWT_SECRET || 'superSecret',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
    optional: jwt({
        secret: process.env.JWT_SECRET || 'superSecret',
        credentialsRequired: false,
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
};

export default auth;

