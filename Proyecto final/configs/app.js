'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const productosRoutes = require('../src/routes/producto.routes');
const categoriasRoutes =require('../src/routes/categorias.routes');
const carritoRoutes = require('../src/routes/carrito.routes');
const facturaRoutes = require('../src/routes/facturas.routes');

const app = express(); //instancia de expresss

app.use(helmet()); //otorgar seguridad a mi servidor
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/producto', productosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/carrito', carritoRoutes);
app.use('/factura', facturaRoutes);

module.exports = app;