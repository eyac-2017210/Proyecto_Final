'use strict'

const Producto = require('../models/productos.model');
const Carrito = require('../models/carritocompra.model');
const { validateData } = require('../utils/validate');

exports.carritoprueba = (req, res) =>{
    return res.send({message: 'Carrito en linea'});
}

exports.addProductos = async (req, res) =>{
    try {
        const params = req.body;
        const data ={
            name: params.name,
            quantity: params.quantity
        }
        const msg = validateData(data);
        if (!msg) {
            const producto = await Producto.findOne({name: params.name});
            if (producto) {
                if (producto.stock >= params.quantity) {
                    const CarritoAgregarProducto = await Carrito.findOneAndUpdate({user: req.user.sub}, {
                        $push:{
                            products:[
                                {
                                    zapatos:{idProducto: producto._id, name: params.name, quantity: params.quantity, price: params.price, size: params.size, subtotal:(producto.price * params.quantity)}
                                }
                            ]
                        }
                    },
                    {new: true});
                    const carritoCompras = await Carrito.findOne({user: req.user.sub}).lean();
                    const arrayProductos = Object.entries(carritoCompras.products);
                    let total = 0;
                    for (let i = 0; i<arrayProductos.length; i++) {
                        total = total + carritoCompras.products[i].zapatos.subtotal;
                    }
                    const totalUpdate = await Carrito.findOneAndUpdate({user: req.user.sub}, {total: total}, {new: true});
                    return res.send({message: 'Producto añadido', totalUpdate});
                } else {
                    return res.send({message: 'Cantidad del producto no valida'});
                }
            } else {
                return res.send({message: 'Producto no encontrado'});
            }
        } else {
            return res.send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}
