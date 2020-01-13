'use strict'

var express = require('express');

var mdAuthenticattion = require('../middlewares/authenticated');

var app = express();

var Hospital = require('../models/hospital');

// // Prueba de ruta de user
// app.get('/', (req, res, next ) => {

//     res.status(200).send({
//        ok: true,
//        message: 'Get prueba de hospital.'
//     })
// });


// Get Hospitals 1
// app.get('/:page', (req, res, next ) => {
//     //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {    
//     if(req.params.page){
//          var page = req.params.page;
//     }else{
//         var page = 5;
//     }
        
//     var itemsPerPage = 3;
            
//     Hospital.find({}).populate('user', 'name email').paginate(page, itemsPerPage, (err, hospitals, total) => { 
//     //Hospital.find({}).populate( 'user', 'name email').exec((err, hospitals) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: 'Error en la Petición.',
//                 error: err
//              });
//         } else {            
//             if (hospitals.length <=0) {
//                 return res.status(404).send({
//                     ok: false,
//                     message: 'No hay Hospitales Registrados.'
//                  });
//             } else{
//                 res.status(200).send({
//                     ok: true,
//                     total: total,
//                     hospitals: hospitals
//                  });
//             }
            
//         }
//     });    
// });

// Get Hospitals 2
app.get('/', (req, res, next ) => {
    //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {
    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'name image').skip(desde).limit(5).exec((err, hospitals) => {    
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
             });
        } else {            
            if (hospitals.length <=0) {
                return res.status(404).send({
                    ok: false,
                    message: 'No hay usuarios Registrados.'
                 });
            } else{

                Hospital.count({}, (err, totalHospitals) => {
                    res.status(200).send({
                        ok: true,  
                        totalHospitals: totalHospitals,                  
                        hospitals: hospitals
                        
                     });
                });               
            }
            
        }
    });    
});

// Get Hospitals 3
app.get('/gets', (req, res, next ) => {
    //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {
    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'name image').skip(desde).exec((err, hospitals) => {    
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
             });
        } else {            
            if (hospitals.length <=0) {
                return res.status(404).send({
                    ok: false,
                    message: 'No hay usuarios Registrados.'
                 });
            } else{

                Hospital.count({}, (err, totalHospitals) => {
                    res.status(200).send({
                        ok: true,  
                        totalHospitals: totalHospitals,                  
                        hospitals: hospitals
                        
                     });
                });               
            }
            
        }
    });    
});


// Get Hospital 
app.get('/:id', (req, res, next ) => {
    //User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {
    var id = req.params.id;
 
    Hospital.findById(id).populate('user', 'name email image').exec((err, hospital) => {    
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
             });
        } else {            
           // if (hospital.length <=0) {
            if (!hospital) {
                return res.status(404).send({
                    ok: false,
                    message: 'No existe el hospital.'
                 });
            } else{

                res.status(200).send({
                ok: true,                            
                hospital: hospital                        
                     
                });               
            }
            
        }
    });    
});


// Register Hospital
app.post('/', mdAuthenticattion.verificarToken, (req, res) => {
    
    var body = req.body;
    var hospital = new Hospital({
        name:  body.name,
        image: null,
        user: req.user._id
    });

    hospital.save((err, hospitalRegister) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
            });
        } else {            
            if (!hospitalRegister) {
                return res.status(404).send({
                    ok: false,
                    message: 'No se Registro el hospital.'
                });
            } else {
                res.status(201).send({
                    ok: true,
                    message: 'Hospital Registrado Correctamente.',
                    hospital: hospitalRegister
                });
            }        
        }
    });    
});

// Update Hopistal
app.put('/:id', mdAuthenticattion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!hospital) {
                return res.status(404).send({
                    ok: false,
                    message: 'Hopistal no registrado.'
                });
            } else {
                hospital.name = body.name;
                //hospital.image = body.image;
                //hospital.user = body.role;

                hospital.save((err, hospitalUpdate) => {
                    if (err) {
                        return res.status(400).send({
                            ok: false,
                            message: 'Error al actualizar el hospital.',
                            error: err
                        });
                    } else {                        
                        res.status(200).send({
                            ok: true,
                            message: 'Hospital Actualizado Correctamente.',
                            hospital: hospitalUpdate,                            
                            userToken: req.user
                        });
                    }
                });
            }
        }
    });
});

// Delete Hospital
app.delete('/:id', mdAuthenticattion.verificarToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDelete) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!hospitalDelete) {
                return res.status(404).send({
                    ok: false,
                    message: 'Hospital no Registrado.'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    message: 'Hospital Eliminado Correctamente.',
                    hospital: hospitalDelete
                });
            }       
        }

    });
});

module.exports = app;