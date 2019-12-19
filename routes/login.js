'use strict'

var express = require('express');

// Configs
var SEED = require('../config/config').SEED;

// bcryptjs
var bcrypt = require('bcryptjs');

// jwt
var jwt = require('jsonwebtoken');



var app = express();

var User = require('../models/user');

app.post('/', (req, res) => {
    
    var body = req.body;

    User.findOne({email: body.email}, (err, userLogin) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!userLogin) {
                return res.status(404).send({
                    ok: false,
                    message: 'Email o Password Incorrecto. - email',
                    error: err
                }); 
            } else {

                if (!bcrypt.compareSync(body.password, userLogin.password)){
                    return res.status(404).send({
                        ok: false,
                        message: 'Email o Password Incorrecto. - password',
                        error: err
                    }); 
                } else {

                    // Crear token
                    userLogin.password = null;
                    var token = jwt.sign({user: userLogin}, SEED, {expiresIn: 14400}) // expira en 4 horas
                    res.status(200).send({
                        ok: true,
                        message: 'Login Correcto.',
                        user: userLogin,
                        id: userLogin._id,
                        token: token
                    }); 
                }
                
            }
        }
    });    
});

module.exports = app;