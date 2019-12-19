'use strict'

// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicialixar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    
    if(err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m','Online');

});

// Rutas
app.use('/api', appRoutes);
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server Purto: 3000: \x1b[32m%s\x1b[0m','Online');
});