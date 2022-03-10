'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'SecretKeyToExample';

exports.createToken = async (user) =>{
    try {
        const payload ={
            sub: user._id,
            name: user.name,
            username: user.username,
            Nit: user.Nit,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(1, 'hours').unix()
        }
        return jwt.encode(payload, secretKey)
    } catch (err) {
        console.log(err);
        return err;
    }
}