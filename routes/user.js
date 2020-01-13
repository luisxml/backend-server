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


<<<<<<< HEAD
// Get users paginacion 1
// app.get('/:page', (req, res, next ) => {
//     //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {    

//    if(req.params.page){
//     var page = req.params.page;
//     }else{
//         var page = 1;
//     }

//     var itemsPerPage = 3;
    
//     User.find({}, 'name email image role google').paginate(page, itemsPerPage, (err, users, total) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la Petición.',
//                 error: err
//              });
//         } else {            
//             if (users.length <=0) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'No hay usuarios Registrados.'
//                  });
//             } else{
//                 res.status(200).send({
//                     ok: true,
//                     total_items: total,
//                     users: users
//                  });
//             }            
//         }
//     });    
// });
=======
// Register User
app.post('/', (req, res) => {
>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb

    var body = req.body;
    var name = body.name;    
    var email = body.email;
    var password = bcrypt.hashSync(body.password, 10);

    var params = `'${name}', '${email}', '${password}'`;   
    var request = new mssql.Request();
    var lsql = `EXEC REGISTER_USER ${params}`  

<<<<<<< HEAD
    User.find({}, 'name email image role google').skip(desde).limit(5).exec((err, users) => {    
        if (err) {
=======
    request.query(lsql, (err, result) => {
        if (err) { 
>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb
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

<<<<<<< HEAD
// Update User
app.put('/:id', [mdAuthenticattion.verificarToken, mdAuthenticattion.verificarUser], (req, res) => {
=======
// UPDATE USER
app.put('/:id', (req, res, next ) => {

>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb
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

<<<<<<< HEAD
// Delete user
app.delete('/:id', [mdAuthenticattion.verificarToken, mdAuthenticattion.verificarRoleUser], (req, res) => {
=======
// DELETE USER
app.delete('/:id', (req, res, next ) => {

>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb
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
