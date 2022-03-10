'use strict'

const express = require('express');
const facturaController = require('../controllers/facturaController');
const api = express.Router();
const mdAuth = require('../services/authenticate');

api.get('/obtenerfactura', mdAuth.ensureAuth, facturaController.GenerarFactura);
api.get('/facturaUser', mdAuth.ensureAuth, facturaController.getFacturas);
api.get('/factura', mdAuth.ensureAuth, facturaController.getFactura);

module.exports = api;