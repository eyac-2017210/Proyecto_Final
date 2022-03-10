'use strict'

const Factura = require('../models/factura.model');
const Carrito = require('../models/carritocompra.model');
const User = require ('../models/user.model');
const Producto = require('../models/productos.model');

exports.GenerarFactura = async (req, res)=>{
    try {
        const user = await User.findOne({_id: req.user.sub}); 
        const buscarCarrito = await Carrito.findOne({user: req.user.sub}).lean();
        let products = buscarCarrito.products;
        let total = buscarCarrito.total;
        
        const data ={
            date: new Date,
            user: req.user.sub,
            products: products,
            total: total    
        };
        let factura = new Factura(data);
        await factura.save();
        let clearZapatos = [];
        const CarritoUpdate = await Carrito.findOneAndUpdate({user:req.user.sub}, {products: clearZapatos, total:0}, {new:true});
        const BuscarFactura = await Factura.findOne({user: req.user.sub}).lean();
        let productoFactura= BuscarFactura.products;
        const arrayProductsFactura = Object.entries(productoFactura);
        
        for(let i=0; i<arrayProductsFactura.length; i++){
            let productId = productoFactura[i].zapatos.idProducto;
            let quantity = productoFactura[i].zapatos.quantity;
            let producto = await Producto.findOne({id: productId});
            let stock = producto.stock;
            let totalVendido =  producto.totalVendido;
            let productoUpdate = await Producto.findOneAndUpdate({_id: productId}, {stock: (stock-quantity), totalVendido:(totalVendido+quantity)}, {new:true});
        }
        return res.send({message: `Factura Creada para ${user.name} ${user.surname}`,  factura})
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getFacturas = async(req, res)=>{
    try {
        const userId = req.user.id;
        const BuscarFactura = await Factura.findOne({user: userId});

        if (BuscarFactura) {
            return res.send(BuscarFactura)
        } else {
            return res.send({message: 'El usuario no tiene facturas'})
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.getFactura = async (req, res) =>{
    const facturaId = req.params.id;
    const BuscarFactura = await Factura.findOne({_id: facturaId});
    if (BuscarFactura) {
        return res.send(BuscarFactura);
    } else {
        return res.send({message: 'La factura no existe'}); 
    }
};