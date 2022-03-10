'use strict'

const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    name: String,
    price: Number,
    size: String,
    stock: Number,
    categorias: {type: mongoose.Schema.ObjectId, ref: 'Categorias'}
})

module.exports = mongoose.model('Producto', productoSchema);