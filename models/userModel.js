const mongoose = require("mongoose");
const express = require('express');
const Joi = require("joi")

//login schema
const loginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    stream:{
        type:String,
        required: true
    },
    
})



const UserModel = mongoose.model("User", loginSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().required(),
        stream: Joi.string().required()
    }
    return Joi.validate(user,schema)
}

module.exports.UserModel = UserModel
module.exports.validate = validateUser