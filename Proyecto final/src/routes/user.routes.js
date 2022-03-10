'use strict'

const express = require('express');
const userController = require('../controllers/userController');
const api = express.Router();
const mdAuth = require('../services/authenticate');

api.get('/prueba',[mdAuth.ensureAuth], userController.prueba);
api.post('/register', userController.register);
api.post('/addUser',[mdAuth.ensureAuth, mdAuth.isAdmin], userController.addUser);
api.post('/login', userController.login);
api.put('/update/:id', mdAuth.ensureAuth,userController.userupdate);
api.delete('/delete/:id', mdAuth.ensureAuth ,userController.deleteUser);


module.exports = api;