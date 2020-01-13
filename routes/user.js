'use strict'

var express = require('express');
//var mongoosePaginate = require('mongoose-pagination');

// bcryptjs
var bcrypt = require('bcryptjs');

// jwt
var jwt = require('jsonwebtoken');


// mssql
var mssql = require('mssql');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');


var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var mdAuthenticattion = require('../middlewares/authenticated');



//var User = require('../models/user');

// // Prueba de ruta de user
// app.get('/', (req, res, next ) => {

//     res.status(200).send({
//        ok: true,
//        message: 'Get de usuarios.'
//     })
// });


// Register User
app.post('/', (req, res) => {

    var body = req.body;
    var name = body.name;    
    var email = body.email;
    var password = bcrypt.hashSync(body.password, 10);

    var params = `'${name}', '${email}', '${password}'`;   
    var request = new mssql.Request();
    var lsql = `EXEC REGISTER_USER ${params}`  

    request.query(lsql, (err, result) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {            
            var userRegister = result.recordset;
            var ID_USER = userRegister[0].ID_USER;
            
            if (ID_USER === 0) {
                return  res.status(400).send({
                    ok: false, 
                    message: userRegister[0].MESSAGE                                  
                }); 
            } else {
                return res.status(200).send({
                    ok: true, 
                    message: userRegister[0].MESSAGE,                  
                    userRegister: userRegister                                   
                });  
            }
        }
    });
});

// GET USERS
app.get('/', (req, res, next ) => {

    var lsql = `EXEC GET_USERS`   
    var request = new mssql.Request();

    request.query(lsql, (err, result) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {            
            var users = result.recordset;            
            return res.status(200).send({
                ok: true,                             
                users: users                                   
            });
        }
    });
});

// GET USER
app.get('/:id', (req, res, next ) => {

    var id = req.params.id;

    var params = `${id}`;  
    var lsql = `EXEC GET_USER ${params}`    

    var request = new mssql.Request();
    request.query(lsql, (err, result) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {   
            
            var userUpdate = result.recordset;
            var ID_USER = userUpdate[0].ID_USER;
            
            if (ID_USER === 0) {
                return  res.status(400).send({
                    ok: false, 
                    message: userRegister[0].MESSAGE
                }); 
            } else {
                return res.status(200).send({
                    ok: true, 
                    message: userUpdate[0].MESSAGE,                  
                    userUpdate: userUpdate                                   
                });  
            }
        }
    });
});

// UPDATE USER
app.put('/:id', (req, res, next ) => {

    var id = req.params.id;
    var body = req.body;
    var name = body.name;    
    var email = body.email;    

    var params = `${id}, '${name}', '${email}'`;   
    var request = new mssql.Request();
    var lsql = `EXEC UPDATE_USER ${params}`  

    var request = new mssql.Request();
    request.query(lsql, (err, result) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {   
            var userUpdated = result.recordset;
            if (userUpdated.length === 0) {
                return res.status(200).send({
                    ok: true,
                    message: 'Usuario no registrado.'
                });
            } else {
                return res.status(200).send({
                    ok: true,                             
                    userUpdated: userUpdated
                });
            }
        }
    });
});

// DELETE USER
app.delete('/:id', (req, res, next ) => {

    var id = req.params.id;

    var params = `${id}`;  
    var lsql = `EXEC DELETE_USER ${params}`    

    var request = new mssql.Request();
    request.query(lsql, (err, result) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {   
            var userDeleted = result.recordset;        
            return res.status(200).send({
                ok: true, 
                message: userDeleted[0].MESSAGE,
                userDeleted: userDeleted
            });
        }
    });
});

module.exports = app;
