'use strict'

const Producto = require('../models/productos.model');
const { validateData } = require('../utils/validate');

exports.pruebaproducts = (req, res)=>{
    return res.send({message: 'Producto funciona correctamente'});
}

exports.addproduct = async (req, res)=>{
    try {
        const params = req.body;
        let data = {
            name: params.name,
            price: params.price,
            size: params.size,
            stock: params.stock
        }
        const msg = validateData(data);
        if(!msg){
            const productos = new Producto(data);
            await productos.save();
            return res.send({message: 'Producto agregado'});
        }else{
            return res.send(msg)
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.agotado = async(req,res)=>{
    try{
        const productoAgotado = await Producto.find({stock:0})
        return res.send({productoAgotado})
    }catch(err){
        console.log(err);
        return err;
    }
}