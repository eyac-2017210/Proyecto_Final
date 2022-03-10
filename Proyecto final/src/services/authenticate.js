'use strict'

const jwt = require ('jwt-simple');
const moment = require('moment');
const secretKey = 'SecretKeyToExample';

exports.ensureAuth =(req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autentificación'});
    }else{
        try {
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message: 'El token ha expirado'});
            }
        } catch (err) {
            console.log (err);
            return res.status(400).send({message: 'El token no es valido'});
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = async (req, res, next )=>{
    try {
        const user = req.user;
        if (user.role === 'ADMIN') return next() 
            return res.status(403).send({message: 'Usuario no autorizado'});
        
    } catch (err) {
        console.log(err);
        return err;
    }
}