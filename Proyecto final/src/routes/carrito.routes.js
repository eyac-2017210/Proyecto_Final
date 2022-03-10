'use strict'

const express = require('express');
const carritoController = require('../controllers/carritoController');
const api = express.Router();
const mdAuth = require('../services/authenticate');

api.get('/carritoprueba', carritoController.carritoprueba);
api.put('/addProductos', mdAuth.ensureAuth, carritoController.addProductos);

module.exports = api;