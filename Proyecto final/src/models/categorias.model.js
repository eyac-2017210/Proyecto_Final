'use strict'

const mongoose = require('mongoose');

const categoriasSchema = mongoose.Schema({
    name: String,
    productos: {type: mongoose.Schema.ObjectId, ref: 'Producto'}
})

module.exports = mongoose.model('Categorias', categoriasSchema);