'use strict'

var express = require('express');

var mdAuthenticattion = require('../middlewares/authenticated');

var app = express();

var Doctor = require('../models/doctor');

// sql
var mssql = require('mssql');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// // Prueba de ruta de user
// app.get('/', (req, res, next ) => {

//     res.status(200).send({
//        ok: true,
//        message: 'Get prueba de hospital.'
//     })
// });

// // Get Doctors
// app.get('/:page', (req, res, next ) => {
   
//    // Doctor.find({}).populate({path: 'hospital', populate: {path: 'user', model: 'User'}}).exec((err, doctors) => {

//    if(req.params.page){
//     var page = req.params.page;
//     }else{
//         var page = 1;
//     }

//     var itemsPerPage = 3;
    
//     Doctor.find({}).populate('hospital').populate('user', 'name email').paginate(page, itemsPerPage, (err, doctors, total) => {
//     //Doctor.find({}).populate('hospital').populate('user', 'name email').exec((err, doctors) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la Petición.',
//                 error: err
//              });
//         } else {            
//             if (doctors.length <=0) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'No hay Doctores Registrados.'
//                  });
//             } else{
//                 res.status(200).send({
//                     ok: true,
//                     total : total,
//                     doctors: doctors
//                  });
//             }
            
//         }
//     });    
// });

// // Get Doctors 2
// app.get('/', (req, res, next ) => {
//     //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {
    
//     var desde = req.query.desde || 0;
//     desde = Number(desde);

//     Doctor.find({}, 'name image').populate('hospital').populate('user', 'name email')
//     .skip(desde).limit(5).exec((err, doctors) => {    
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la Petición.',
//                 error: err
//              });
//         } else {            
//             // if (doctors.length <=0) {
//             //     return res.status(404).send({
//             //         ok: false,
//             //         message: 'No hay Medicos Registrados.'
//             //      });
//             // } else{

//                 Doctor.count({}, (err, totalDoctors) => {
//                     res.status(200).send({
//                         ok: true,  
//                         totalDoctors: totalDoctors,                  
//                         doctors: doctors                        
//                      });
//                 });               
//             //}
            
//         }
//     });    
// });

app.get('/', (req, res, next ) => {
    var requets = new mssql.Request();
    requets.query('SELECT * FROM USUARIOS', (err, ressult) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            var data = {};
            data = ressult.recordset;            
            res.status(200).send({
            ok: true,                   
            users: data                    
            });  
        }
    });
});

app.put('/:id', (req, res, next ) => {

    var id = req.params.id;
    var name = req.body.name;
    var params = id + ',' + name;

        // res.status(200).send({
        // ok: true,                   
        // id: id ,
        // body: body                  
        // });  

    var requets = new mssql.Request();
    requets.query(
        'EXEC PRUEBA_NODE '+ params, 
        (err, ressult) => {
        if (err) { 
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {            
            var userUpdate = ressult.recordset;            
            res.status(200).send({
            ok: true, 
            message: 'Datos Guardados Correctamente.',                  
            user: userUpdate,
            params: params                 
            });  
        }
    });
});


// // Get doctor
// app.get('/:id', (req, res) => {
//     var id = req.params.id;
//     var body = req.body;

//     Doctor.findById(id).populate('user', 'name email image').populate('hospital').exec((err, doctor) => {

//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la petición.',
//                 error: err
//             });
//         } else {
//             if (!doctor) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'Doctor no registrado.'
//                 });
//             } else {
                                                           
//                 res.status(200).send({
//                     ok: true,                   
//                     doctor: doctor                    
//                 });                    
                
//             }
//         }
        
//     });
// });

// // Register Doctor
// app.post('/', mdAuthenticattion.verificarToken, (req, res) => {
    
//     var body = req.body;
//     var doctor = new Doctor({
//         name:  body.name,
//         image: null,
//         user: req.user._id,
//         hospital: body.hospital
//     });

//     doctor.save((err, doctorRegister) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la Petición.',
//                 error: err
//             });
//         } else {            
//             if (!doctorRegister) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'No se Registro el doctor.'
//                 });
//             } else {
//                 res.status(201).send({
//                     ok: true,
//                     message: 'Doctor Registrado Correctamente.',
//                     doctor: doctorRegister
//                 });
//             }        
//         }
//     });
// });

// // Update Doctor
// app.put('/:id', mdAuthenticattion.verificarToken, (req, res) => {
//     var id = req.params.id;
//     var body = req.body;

//     Doctor.findById(id, (err, doctor) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la petición.',
//                 error: err
//             });
//         } else {
//             if (!doctor) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'Doctor no registrado.'
//                 });
//             } else {
//                 doctor.name = body.name;
//                 //hospital.image = null;
//                 //hospital.user = body.role;

//                 doctor.save((err, doctorUpdate) => {
//                     if (err) {
//                         return res.status(400).send({
//                             ok: false,
//                             message: 'Error al actualizar el hospital.',
//                             error: err
//                         });
//                     } else {                        
//                         res.status(200).send({
//                             ok: true,
//                             message: 'Hospital Actualizado Correctamente.',
//                             doctor: doctorUpdate,                            
//                             userToken: req.user
//                         });
//                     }
//                 });
//             }
//         }
//     });
// });

// // Delete Doctor
// app.delete('/:id', mdAuthenticattion.verificarToken, (req, res) => {
//     var id = req.params.id;

//     Doctor.findByIdAndRemove(id, (err, doctorDelete) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la petición.',
//                 error: err
//             });
//         } else {
//             if (!doctorDelete) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'Doctor no Registrado.'
//                 });
//             } else {
//                 res.status(200).send({
//                     ok: true,
//                     message: 'Doctor Eliminado Correctamente.',
//                     doctor: doctorDelete
//                 });
//             }       
//         }

//     });
// });


module.exports = app;