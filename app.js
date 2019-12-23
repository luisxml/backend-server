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
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadhRoutes = require('./routes/upload');
var imageRoutes = require('./routes/image');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    
    if(err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m','Online');

});

// Server Index Config
// var serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serverIndex(__dirname + '/uploads'));

// Rutas
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadhRoutes);
app.use('/api/image', imageRoutes);
app.use('/api', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server Purto: 3000: \x1b[32m%s\x1b[0m','Online');
});