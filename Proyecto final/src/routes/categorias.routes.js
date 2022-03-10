'use strict'

const express = require('express');
const categoriasController = require('../controllers/categoriasController');
const api = express.Router();
const mdAuth = require('../services/authenticate');

api.get('/pruebaCategorias', categoriasController.pruebaCategorias);
api.get('/createcategoria', mdAuth.ensureAuth,categoriasController.createcategoria);
api.put('/updateCategorias/:id', mdAuth.ensureAuth, categoriasController.updateCategoria);
api.delete('/deleteCategorias/:id',mdAuth.ensureAuth, categoriasController.deleteCategorias);

module.exports = api;