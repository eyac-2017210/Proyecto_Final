'use strict'

const User = require('../models/user.model');
const Factura = require('../models/factura.model');
const Carrito = require('../models/carritocompra.model');
const { validateData, alreadyUser, encrypt, checkPassword, checkPermission, checkUpdate } = require('../utils/validate');
const jwt =require('../services/jwt');

exports.prueba = (req, res) =>{
   return res.send({message: 'si esta funcionandos'});
}

exports.register = async (req, res) =>{
    try {
        const params = req.body;
        let data = {
            name: params.name,
            password: params.password,
            username: params.username,
            Nit: params.Nit,
            role: 'Cliente'
        }
        const msg = validateData(data);
        if(!msg){
            let already = await alreadyUser(params.username);
            if (!already) {
                data.phone = params.phone;
                data.password = await encrypt(params.password);

                let user = new User(data);
                await user.save();

                return res.status(201).send({message: ' Usuario guardado exitosamente'});
            }else{
                return res.status(200).send({message: 'el username ya esta en uso cambielo por otro'});
            }
        }else{
            return res.send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error al guardar ususario'});
    }
}

exports.addUser = async(req, res)=>{
    try {
        const params = req.body;
        let data = {
            name: params.name,
            password: params.password,
            username: params.username,
            Nit: params.Nit,
            role: 'Cliente'
        }
        const msg = validateData(data);
        if(!msg){
            let already = await alreadyUser(params.username);
            if (!already) {
                data.phone = params.phone;
                data.password = await encrypt(params.password);

                let user = new User(data);
                await user.save();

                return res.status(201).send({message: ' Usuario guardado exitosamente'});
            }else{
                return res.status(200).send({message: 'el username ya esta en uso cambielo por otro'});
            }
        }else{
            return res.send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.login = async (req, res) =>{
    try {
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }
    
        let msg = validateData(data);

        if (!msg) {
            let already = await alreadyUser(params.username);
            if(already && await checkPassword(params.password, already.password)){
                const token = await jwt.createToken(already);
                let datacarrito ={
                    user: already._id,
                    total:  0
                }
                const carrito = new Carrito(datacarrito);
                const carritosSearch = await Carrito.findOne({user: already._id});
                if (carritosSearch) {
                    const factura = await Factura.find({user: already._id});
                    return res.send({message: 'Este usuario ya tiene un carrito', token, factura});
                }else{
                    await carrito.save();
                    const factura = await Factura.find({user: already._id});
                    return res.send({already, message: 'Usuario logeado', token, factura});
                }
                
            }else{
                return res.status(404).send({message: 'usuario inexistente'});
            }
        }else{
            return res.send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.userupdate = async (req, res)  => {
    try {
        const params = req.body;
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if (permission === false) {
            return res.status(401).send({message: 'Usuario no autorizado'});
        }else{
            const noUpdate = await checkUpdate(params);
            if(noUpdate === false){
                return res.status(400).send({message: 'Solo pueden ser actualizados por un administrador'});
            }else{
                const already = await alreadyUser(params.username);
                if(!already){
                    const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new: true})
                    .lean();
                    return res.send({userUpdate ,message: 'Usuario actualizado'})
                }else{
                    return res.send({message: 'El nombre del usuario ya esta tomado'})
                }
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteUser = async (req, res)=>{
    try {
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if (permission === false) {
            return res.status(403).send({message: 'Acción no autorizada'});
        }else{
            const userDelete = await User.findOneAndDelete({_id: userId});
            if(userDelete)
            return res.send({userDelete, message: 'Cuenta eliminada'});
            return res.send({message: 'Usuario no encontrado o ya eliminado'});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}