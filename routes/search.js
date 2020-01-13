'use strict'

var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// Busqueda General
app.get('/:all/:search', (req, res, next ) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    // if (search.length <= 0) {
    //     return res.status(200).send({
    //         ok: true,
    //         message: 'Debe establecer un patron de busqueda';           
    //      });
    // }
    
    Promise.all([
        searchHospitals(search, regex),
        searchDoctors(search, regex),
        searchUser(search, regex)])
        .then( reply => {
            res.status(200).send({
                ok: true,
                //message: 'Petición de busqueda realizada correctamente.'
                hospitals: reply[0],
                doctors: reply[1],
                users: reply[2]
             });
        })
    // searchHospitals(search, regex).then(hospitals => {
    //     res.status(200).send({
    //         ok: true,
    //         //message: 'Petición de busqueda realizada correctamente.'
    //         Hospitals: hospitals
    //      });
    //});

    // Hospital.find({ name: regex}, (err, hospitals) => {
    //     if (err) {
    //         res.status(500).send({
    //             ok: false,
    //             message: 'Error en la Petición.'
    //          });
    //     } else {
    //         if (hospitals.length <= 0){
    //             res.status(404).send({
    //                 ok: false,
    //                 message: 'No Hay Hospitales Registrados.'
    //              });
    //         } else {
    //             res.status(200).send({
    //                 ok: true,
    //                 //message: 'Petición de busqueda realizada correctamente.'
    //                 Hospitals: hospitals
    //              });
    //         }
    //     }

    // });
});

// Busqueda por coleccion
app.get('/collection/:table/:search', (req, res, next ) => {

    var search = req.params.search;
    var table = req.params.table;
    var regex = new RegExp(search, 'i');

    var promise;

    switch( table ){

        case 'hospitals':
            promise = searchHospitals(search, regex)
        break;

        case 'doctors':
            promise = searchDoctors(search, regex)
        break;
        
        case 'users':
            promise = searchUser(search, regex)
        break;

        default:
            res.status(400).send({
                ok: false,
                message: 'Error en la busqueda.'
            });
    }

    promise.then(data => {
            res.status(200).send({
                ok: true,
                //message: 'Petición de busqueda realizada correctamente.'
                [table]: data
            });
        });
});




// Funcion de buscar Hospital
function searchHospitals(search, regex){

    return new Promise( (resolve, reject) => {

        Hospital.find({ name: regex}).populate('user', 'name email role').exec((err, hospitals) => {
            if(err) {
                reject('Error al Consultar hospitales.', err);
            } else {
                resolve(hospitals);
            }
        });
    });    
}

// Funcion de Buscar Doctores
function searchDoctors(search, regex){

    return new Promise( (resolve, reject) => {

        //Doctor.find({ name: regex}, (err, doctors) => {
        Doctor.find({ name: regex}).populate('hospital').populate('user', 'name email role').exec((err, doctors) => {
            if(err) {
                reject('Error al Consultar Doctores.', err);
            } else {
                resolve(doctors);
            }
        });
    });    
}

// Funcion de buscar Usuarios
function searchUser(search, regex){

    return new Promise( (resolve, reject) => {

        User.find({}, 'name email role image')
            .or([{'name': regex}, {'email': regex}])
            .exec( (err, users) => {
                if(err) {
                    reject('Error al Consultar Usuarios.', err);
                } else {
                    resolve(users);
                }
        });        
    });    
}

module.exports = app;
