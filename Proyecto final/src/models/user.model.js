'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    Nit: String,
    username: String,
    password: String,
    phone: String,
    role: String
});

module.exports = mongoose.model('User', userSchema);