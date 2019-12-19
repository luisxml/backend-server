'use strict'

var jwt = require('jsonwebtoken');

// Configs
var SEED = require('../config/config').SEED;


// Verificar token
exports.verificarToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(404).send({
                ok: false,
                message: 'Petición no Autorizada.',
                error: err
            });
        } 
            // return res.status(200).send({
            //     ok: true,
            //     //message: 'Petición no Autorizada.',
            //     decode: decode
            // });
        req.user = decode.user;
        next();
    });
}

    


