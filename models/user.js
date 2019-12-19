'use strict'

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio.']},
    email: { type: String, unique: true, required: [true, 'El email es obligatorio.']},
    password: { type: String, required: [true, 'El password es obligatorio']},
    image: { type: String, required: false},
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos  }
});

userSchema.plugin(uniqueValidator, {message: 'El {PATH} ya se encuentra registrado con otra cuenta'});
module.exports = mongoose.model('User', userSchema);

