'use strict'

var express = require('express');

// bcryptjs
var bcrypt = require('bcryptjs');

// jwt
var jwt = require('jsonwebtoken');

var mdAuthenticattion = require('../middlewares/authenticated');

var app = express();

var User = require('../models/user');

// // Prueba de ruta de user
// app.get('/', (req, res, next ) => {

//     res.status(200).send({
//        ok: true,
//        message: 'Get de usuarios.'
//     })
// });

// Get users
app.get('/', (req, res, next ) => {
    //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {
    User.find({}, 'name email image role').exec((err, users) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
             });
        } else {            
            if (!users) {
                return res.status(404).send({
                    ok: false,
                    message: 'No hay usuarios Registrados.'
                 });
            } else{
                res.status(200).send({
                    ok: true,
                    users: users
                 });
            }
            
        }
    });    
});

// Register User
app.post('/', (req, res) => {

    var body = req.body;
    var user = new User({
        name:  body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        role: body.role
    });

    user.save((err, userRegister) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
            });
        } else {            
            if (!userRegister) {
                return res.status(404).send({
                    ok: false,
                    message: 'No se Registro el usurario.'
                });
            } else {
                res.status(201).send({
                    ok: true,
                    message: 'Usuario Registrado Correctamente.',
                    user: userRegister
                });
            }        
        }
    });    
});



// Update User
app.put('/:id', mdAuthenticattion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!user) {
                return res.status(404).send({
                    ok: false,
                    message: 'Usuario no registrado.'
                });
            } else {
                user.name = body.name;
                user.email = body.email;
                user.role = body.role;

                user.save((err, userUpdate) => {
                    if (err) {
                        return res.status(400).send({
                            ok: false,
                            message: 'Error al actualizar el usuario.',
                            error: err
                        });
                    } else {
                        userUpdate.password = null;
                        res.status(200).send({
                            ok: true,
                            message: 'Usuario Actualizado Correctamente.',
                            user: userUpdate,                            
                            userToken: req.user
                        });
                    }
                });
            }
        }
    });
});

// Delete user
app.delete('/:id', mdAuthenticattion.verificarToken, (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDelete) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!userDelete) {
                return res.status(404).send({
                    ok: false,
                    message: 'Usuario no Existe.'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    message: 'Usuario Eliminado Correctamente.',
                    user: userDelete
                });
            }       
        }

    });
});



module.exports = app;
