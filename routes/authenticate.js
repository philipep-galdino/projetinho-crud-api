import jwt from 'express-jwt'

function getHeadersToken (request) {
    if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Token' || 
        request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
            return request.headers.authorization.split(' ')[1]
        }
    
    return null
}

const auth = {
    required: jwt({
        secret: 'secretinho',
        algorithms: ['HS256'],
        userProperty: 'payload',
        getToken: getHeadersToken
    }),
    optional: jwt({
        secret: 'secretinho',
        algorithms: ['HS256'],
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getHeadersToken
    })
}

export default auth