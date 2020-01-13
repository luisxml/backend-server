'use strict'

// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//mssql
var mssql = require('mssql');

// Inicialixar variables
var app = express();

// CORS
//         var origen = req.headers.origin;

//         if (whiteList.indexOf(origen) >= -1) {
//             res.header('Access-Control-Allow-Origin', origen);
//         }

//         res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//         res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//         res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from

    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS ");
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

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

// Conexion a la base de datos MONGO DB
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    
//     if(err) throw err;
//     console.log('Base de datos \x1b[32m%s\x1b[0m','Online');

// });

// Conexion a la base de datos MSSQL SERVER
app.set('view engine', 'ejs');

// PUERTO
var port = process.env.PORT || 5000;

// VARIABLES DE CONEXION
var config = {
    user: 'serval',
    password: 'Cybers@c1',
    server: '192.168.0.3',
    //port:
    database: 'SERVAL_CYBER'
};


// error
var connection = mssql.connect(config, function(err, res){
    if (err){
        throw err;
    } else {
        console.log("conectado");
        app.listen(port, function(){
            console.log('api rest run en http://localhost' + port);
        });
    }
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


// // Escuchar peticiones
// app.listen(3000, () => {
//     console.log('Express Server Purto: 3000: \x1b[32m%s\x1b[0m','Online');
// });