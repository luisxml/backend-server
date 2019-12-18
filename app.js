// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicialixar variables
var app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    
    if(err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m','Online');

});

// Rutas
app.get('/', (req, res, next ) => {

    res.status(200).send({
       ok: true,
       message: 'Petición al servidor realizada correctamente.'
    })

});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server Purto: 3000: \x1b[32m%s\x1b[0m','Online');
});