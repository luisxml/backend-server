'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

mssql
var mssql = require('mssql');
var http = require('http');
var path = require('path');

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS ");
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

// Importar Rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

// Conexion a la base de datos MSSQL SERVER
app.set('view engine', 'ejs');

// Configuracion de Conexion
var config = {
    user: 'serval',
    password: 'Cybers@c1',
    server: '192.168.0.3',
    //port:
    database: 'SERVAL_APP'
};

// Test
var connection = mssql.connect(config, function(err, res){
    if (err){
        throw err;
    } else {         
        console.log('Base de datos \x1b[32m%s\x1b[0m','Online');    
        // Escuchar peticiones
    app.listen(3000, () => {
        console.log('Express Server Purto: 3000: \x1b[32m%s\x1b[0m','Online');
    });    
    }
});

// Rutas
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);


app.use('/api', appRoutes);