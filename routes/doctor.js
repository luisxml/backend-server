'use strict'

var express = require('express');

var mdAuthenticattion = require('../middlewares/authenticated');

var app = express();

var Doctor = require('../models/doctor');

// // Prueba de ruta de user
// app.get('/', (req, res, next ) => {

//     res.status(200).send({
//        ok: true,
//        message: 'Get prueba de hospital.'
//     })
// });

// Get Doctors
app.get('/:page', (req, res, next ) => {
   
   // Doctor.find({}).populate({path: 'hospital', populate: {path: 'user', model: 'User'}}).exec((err, doctors) => {

   if(req.params.page){
    var page = req.params.page;
    }else{
        var page = 1;
    }

    var itemsPerPage = 3;
    
    Doctor.find({}).populate('hospital').populate('user', 'name email').paginate(page, itemsPerPage, (err, doctors, total) => {
    //Doctor.find({}).populate('hospital').populate('user', 'name email').exec((err, doctors) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
             });
        } else {            
            if (doctors.length <=0) {
                return res.status(404).send({
                    ok: false,
                    message: 'No hay Doctores Registrados.'
                 });
            } else{
                res.status(200).send({
                    ok: true,
                    total : total,
                    doctors: doctors
                 });
            }
            
        }
    });    
});


// Register Doctor
app.post('/', mdAuthenticattion.verificarToken, (req, res) => {
    
    var body = req.body;
    var doctor = new Doctor({
        name:  body.name,
        image: null,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((err, doctorRegister) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la Petición.',
                error: err
            });
        } else {            
            if (!doctorRegister) {
                return res.status(404).send({
                    ok: false,
                    message: 'No se Registro el doctor.'
                });
            } else {
                res.status(201).send({
                    ok: true,
                    message: 'Doctor Registrado Correctamente.',
                    doctor: doctorRegister
                });
            }        
        }
    });
});

// Update Doctor
app.put('/:id', mdAuthenticattion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!doctor) {
                return res.status(404).send({
                    ok: false,
                    message: 'Doctor no registrado.'
                });
            } else {
                doctor.name = body.name;
                //hospital.image = null;
                //hospital.user = body.role;

                doctor.save((err, doctorUpdate) => {
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
                            doctor: doctorUpdate,                            
                            userToken: req.user
                        });
                    }
                });
            }
        }
    });
});

// Delete Doctor
app.delete('/:id', mdAuthenticattion.verificarToken, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorDelete) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!doctorDelete) {
                return res.status(404).send({
                    ok: false,
                    message: 'Doctor no Registrado.'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    message: 'Doctor Eliminado Correctamente.',
                    doctor: doctorDelete
                });
            }       
        }

    });
});


module.exports = app;