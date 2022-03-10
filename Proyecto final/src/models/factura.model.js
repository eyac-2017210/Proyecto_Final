'use strict'

const mongoose = require('mongoose');

const facturaSchema = mongoose.Schema({
    date: Date,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    products: [
        {zapatos: {idProducto: {type: mongoose.Schema.ObjectId, ref: 'Producto'},
        name: String,
        price: Number,
        size: String,
        quantity: Number,
        subtotal: Number
                    }}
    ],
    total: Number
})

module.exports = mongoose.model('Factura', facturaSchema);