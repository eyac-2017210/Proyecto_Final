'use strict'

const express = require('express');
const productosController = require('../controllers/productosController');
const api = express.Router();

api.get('/pruebaproducts', productosController.pruebaproducts);
api.get('/addproduct', productosController.addproduct);
api.get('/agotado', productosController.agotado);

module.exports = api;
