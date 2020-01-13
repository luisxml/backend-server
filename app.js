'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

<<<<<<< HEAD
//mssql
var mssql = require('mssql');

// TEDIUS
//var Connection = require('tedious').Connection;

// Inicialixar variables
=======
mssql
var mssql = require('mssql');
var http = require('http');
var path = require('path');

// Inicializar variables
>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb
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
<<<<<<< HEAD
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadhRoutes = require('./routes/upload');
var imageRoutes = require('./routes/image');

// // Conexion a la base de datos MONGO DB
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    
//     if(err) throw err;
//     console.log('Base de datos \x1b[32m%s\x1b[0m','Online');

// });

// // Conexion a la base de datos MSSQL SERVER
// app.set('view engine', 'ejs');

// // PUERTO
 var port = process.env.PORT || 5000;

// VARIABLES DE CONEXION
var config = {
    user: 'serval',
    password: 'Cybers@c1',
    server: '192.168.0.3',
    //port:
    database: 'SERVAL_APP'
};


// error
var connection = mssql.connect(config, function(err, res){
    if (err){
        throw err;
    } else {
        console.log("conectado");
        app.listen(port, function(){
            console.log('api rest run en http://localhost:' + port);
        });
    }
});


// //CONEXION SQL SERVER CON TEDIOUS
// var config = { 
//     server: '192.168.0.3',
//     authentication: { 
//         type: 'default', 
//         options: { 
//             userName: 'serval', 
//             password: 'Cybers@c1',
//             database: 'serval_cyber' 
//         } 
//     }, 
//     options: {
//         encrypt:false 
//     } 
// }


// var connection = new Connection(config);  
// connection.on('connect', function(err) {  
//     // If no error, then good to proceed.
//     if (err){
//         throw err;
//     } else {
//         console.log("Connected");  
//         app.listen(port, function(){
//              console.log('api rest run en http://localhost:' + port);
//         });
//         //executeStatement();  
//     }    
// });  



// Server Index Config
// var serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serverIndex(__dirname + '/uploads'));
=======

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
>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb

// Rutas
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
<<<<<<< HEAD
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
=======


app.use('/api', appRoutes);
>>>>>>> 661bc162e9731e37e606fb54686b24ec2c48ccbb
