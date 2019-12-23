'use strict'

var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

app.use(fileUpload());

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital'); 

// Prueba de ruta de server backend
app.put('/:tipo/:id', (req, res, next ) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipo de coleccion
    var tiposValidos = ['hospital', 'doctor', 'user']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'El tipo de colección no es valido.'
         });
    }

    if (!req.files) {
        res.status(400).send({
            ok: false,
            message: 'No se ha selecciono ningun un archivo.'
         });
    } else {
        // Obtener nombre del archivo
        var file = req.files.image;
        var fileName = file.name.split('.');
        var extFile = fileName[fileName.length - 1];

        //Validar extension de archivos
        var extValida = ['png', 'PNG', 'jpeg', 'JPEG', 'gif', 'GIF', 'jpg', 'JPG'];

        if (extValida.indexOf(extFile) < 0) {
            res.status(400).send({
                ok: false,
                message: 'Extensión de archivo no valida.'
            });           
        } else {
            // Nombre del archivo 
            var fileName = `${id}-${new Date().getMilliseconds()}.${extFile}`;

            //Mover el archivo temporal a un path
            var path = `./uploads/${tipo}/${fileName}`;

            file.mv(path, err => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error al intentar guardar el archivo.',
                        error: err
                    });
                } else {

                    subirArchivo(tipo, id, fileName, res);

                    // res.status(200).send({
                    //     ok: true,
                    //     message: 'Archivo Guardado Correctamente.',
                    //     nombre: extFile
                    // });
                }
            });           
        }        
    }
});

function subirArchivo(tipo, id, fileName, res){

    if (tipo === 'user'){
        User.findById(id, (err, user) => {
            if (err){
                res.status(500).send({
                    ok: false,
                    message: 'Error al intentar guardar el archivo.',
                    error: err
                });
            } else {
                if (!user){
                    res.status(404).send({
                        ok: false,
                        message: 'El usuario no existe.'
                    });
                } else {
                    var oldPath = './uploads/user/' + user.image;

                    // elimina la imagen anterior                   
                    if(fs.existsSync(oldPath)){
                        fs.unlinkSync(oldPath);
                    } 
                        user.image = fileName;
                        user.save( (err, userUpdate) => {
                            if (err){
                                res.status(500).send({
                                    ok: false,
                                    message: 'Error al intentar guardar el archivo.',
                                    error: err
                                });
                            } else {
                                userUpdate.password = null;
                                res.status(200).send({
                                    ok: true,
                                    message: 'Archivo Guardado Correctamente.',
                                    usuario: userUpdate
                                });
                            }
                        });
                    
                }
                
            }
        }); 
    }

    if (tipo === 'hospital'){
        Hospital.findById(id, (err, hospital) => {
            if (err){
                res.status(500).send({
                    ok: false,
                    message: 'Error al intentar guardar el archivo.',
                    error: err
                });
            } else {
                if (!hospital){
                    res.status(404).send({
                        ok: false,
                        message: 'El hospital no existe.'
                    });
                } else {
                    var oldPath = './uploads/hospital/' + hospital.image;

                    // elimina la imagen anterior                   
                    if(fs.existsSync(oldPath)){
                        fs.unlinkSync(oldPath);
                    } 
                        hospital.image = fileName;
                        hospital.save( (err,hospitalUpdate) => {
                            if (err){
                                res.status(500).send({
                                    ok: false,
                                    message: 'Error al intentar guardar el archivo.',
                                    error: err
                                });
                            } else {
                                res.status(200).send({
                                    ok: true,
                                    message: 'Archivo Guardado Correctamente.',
                                    hospital: hospitalUpdate
                                });
                            }
                        });
                    
                }
                
            }
        }); 
    }

    if (tipo === 'doctor'){
        Doctor.findById(id, (err, doctor) => {
            if (err){
                res.status(500).send({
                    ok: false,
                    message: 'Error al intentar guardar el archivo.',
                    error: err
                });
            } else {
                if (!doctor){
                    res.status(404).send({
                        ok: false,
                        message: 'El doctor no existe.'
                    });
                } else {
                    var oldPath = './uploads/doctor/' + doctor.image;

                    // elimina la imagen anterior                   
                    if(fs.existsSync(oldPath)){
                        fs.unlinkSync(oldPath);
                    } 
                        doctor.image = fileName;
                        doctor.save( (err,doctorUpdate) => {
                            if (err){
                                res.status(500).send({
                                    ok: false,
                                    message: 'Error al intentar guardar el archivo.',
                                    error: err
                                });
                            } else {
                                res.status(200).send({
                                    ok: true,
                                    message: 'Archivo Guardado Correctamente.',
                                    doctor: doctorUpdate
                                });
                            }
                        });
                    
                }
                
            }
        }); 
    }
}

module.exports = app;
