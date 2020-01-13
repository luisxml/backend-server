'use strict'

var express = require('express');

// Configs
var SEED = require('../config/config').SEED;

// bcryptjs
var bcrypt = require('bcryptjs');

// jwt
var jwt = require('jsonwebtoken');

var app = express();

//var User = require('../models/user');

var mdAuthenticattion = require('../middlewares/authenticated');

var mdAuthenticattion = require('../middlewares/authenticated');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// Renovar Token
app.get('/renewtoken',mdAuthenticattion.verificarToken, (req, res) => {

    var token = jwt.sign({user: req.user}, SEED, {expiresIn: 14400}) // expira en 4 horas
    
    return res.status(200).send({
        ok: true,
        mensaje: 'New Token!!',       
        token: token
    });   
    
});

// Autenticacion de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.image,
        imagen: payload.picture,
        google: true,
        payload: payload
    }
}

app.post('/google', async (req, res) => {
    
    var token = req.body.token || '';
    
    var googleUser = await verify(token)
    .catch(e => {
        return res.status(403).send({
            ok: false,             
            message: 'Token no Valido',
            token: token,
            error: error.message                          
        }); 
    });

    // var token = req.body.token || '';
    // var googleUser;
    // try {
    //     googleUser = await verify(token);
    // } catch (error) {
    //     return res.status(403).send({
    //         ok: false,
    //         mensaje: 'Token no válida',
    //         error: error.message
    //     });
    // }
    // return res.status(200).send({
    //     ok: true,
    //     mensaje: 'todo Ok!!',
    //     googleUser
    // });   

    
    
    User.findOne({email: googleUser.payload.email}, (err, UserDB) => {
        if (err) {
            res.status(500).send({
                ok: true,
                message: 'Error en la Petición.',
                error: err               
            }); 
        } else {
            if (UserDB) {               
                if (UserDB.google === false) {
                    return res.status(400).send({
                        ok: true,
                        message: 'Debe usar su autenticación normal.'               
                    }); 
                } else {
                    //userLogin.password = null;
                    var token = jwt.sign({user: UserDB}, SEED, {expiresIn: 14400}) // expira en 4 horas
                    res.status(200).send({
                        ok: true,
                        message: 'Login Correcto.',
                        user: UserDB,
                        id: UserDB._id,
                        token: token,
                        menu: menu(UserDB.role)
                    }); 
                }
            } else {                
                // El usuario no existe hay que crearlo
                var user = new User;
                
                user.name = googleUser.payload.name;
                user.email = googleUser.payload.email;
                user.image = googleUser.payload.picture;
                user.google = true;
                user.password = ':)';

                

                user.save( (err, UserDB) => {
                    if (err) {
                        res.status(500).send({
                            ok: true,
                            message: 'Error en la Petición.',
                            UserDB: err               
                        }); 
                    } else {
                        var token = jwt.sign({user: UserDB}, SEED, {expiresIn: 14400}) // expira en 4 horas
                        res.status(200).send({
                            ok: true,
                            message: 'Login Correcto.',
                            user: UserDB,
                            id: UserDB._id,
                            token: token,
                            menu: menu(UserDB.role)

                        }); 
                    }
                });
            }
        }
    });

    // return res.status(200).send({
    //     ok: true,
    //     message: 'Login Correcto.',
    //     token: token
    // }); 
});


// Autenticacion normal
app.post('/', (req, res) => {
    
    var body = req.body;

    User.findOne({email: body.email}, (err, userLogin) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if (!userLogin) {
                return res.status(404).send({
                    ok: false,
                    message: 'Email o Password Incorrecto.',
                    error: err
                }); 
            } else {

                if (!bcrypt.compareSync(body.password, userLogin.password)){
                    return res.status(404).send({
                        ok: false,
                        message: 'Email o Password Incorrecto.',
                        error: err
                    }); 
                } else {

                    // Crear token
                    userLogin.password = null;
                    var token = jwt.sign({user: userLogin}, SEED, {expiresIn: 14400}) // expira en 4 horas
                    res.status(200).send({
                        ok: true,
                        message: 'Login Correcto.',
                        user: userLogin,
                        id: userLogin._id,
                        token: token,
                        menu: menu(userLogin.role)
                    }); 
                }
                
            }
        }
    });    
});

//Obtener MENU
function menu(ROLE) {

    var menu = [{
        titulo: 'Principal',
        icono: 'mdi mdi-gauge',
        submenu: [
          { titulo: 'Dashboard', url: '/dashboard'},
          { titulo: 'PogressBar', url: '/progress'},
          { titulo: 'Graficas', url: '/graphics1'},
          { titulo: 'Promesas', url: '/promesas'}
        ]
      },
      {
        titulo: 'Mantenimiento',
        icono: 'mdi mdi-folder-lock-open',
        submenu: [
          // {titulo: 'Usuarios', url: '/users'},
          {titulo: 'Hopitales', url: '/hospitals'},
          {titulo: 'Medicos', url: '/doctors'}
        ]
      }
      ];
      console.log(ROLE);
      if (ROLE === 'ADMIN_ROLE') {
          menu[1].submenu.unshift({titulo: 'Usuarios', url: '/users'})
      }
    return menu;
}

module.exports = app;