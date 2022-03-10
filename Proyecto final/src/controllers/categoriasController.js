'use strict'

const { validateData, checkUpdate } = require("../utils/validate");
const Categorias = require('../models/categorias.model');
const Producto = require('../models/productos.model');

exports.pruebaCategorias = (req, res)=>{
    return res.send({message: 'Categorias funcionando'})
}

exports.createcategoria = async(req, res)=>{
    try {
        const params = req.body;
        const data = {
            name: params.name,
            productos: params.productos
        }
        const msg = validateData(data);
        if (!msg) {
            const producto = await Producto.findOne({_id: params.productos});
             if (!producto) {
                 return res.send({message: 'Producto no existente'});
             
                }else{
                    const categoriaAlready = await Categorias.findOne({name: data.name});
                     if (categoriaAlready) {
                     return res.send({message: 'categoria ya en existencia'});
                }
                    const categorias = new Categorias(data);
                    await categorias.save();
                    return res.send({message: 'Categoria creada'});
                    }
        }else{
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateCategoria = async(req, res)=>{
    try {
        const params = req.body;
        const categoriaId = req.params.id;
        const check = await checkUpdate(params);
        if (check === false) {
            return res.status(400).send({message: 'Data no recibida'});
        }else{
            const updateCategoria = await Categorias.findByIdAndUpdate({_id: categoriaId}, params, {new: true});
            return res.send({message: 'categoria actualizada', updateCategoria});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteCategorias = async (req, res)=>{
    try {
        const categoriaId = req.params.id;
        const buscarcategoria = await Categorias.findOne({_id: categoriaId});
        if (buscarcategoria && buscarcategoria.name !== 'default') {
            const productos = await Producto.find({categorias: categoriaId}).lean();
            if(Object.entries(productos).length === 0){
            const categoriaDeleted = await Categorias.findOneAndDelete({_id: categoriaId});
            return res.send({message: 'Categoria Eliminada', categoriaDeleted});
        }else{
            const productosMove = await Producto.updateMany({categorias: categoriaId}, {$set: {categorias: "6226966e6ef43183b94039ce"}});
                const categoriaDeleted = await Categorias.findOneAndDelete({_id: categoriaId});
                return res.send({message: "Category deleted", categoriaDeleted});
        }
        }else{
            return res.send({message: 'Categoria no funciona'});
        }
        
        
    } catch (err) {
        console.log(err);
        return err;
    }
}