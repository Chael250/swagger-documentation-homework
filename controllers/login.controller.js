const express = require("express");
const auth = express.Router();
const {TeacherModel} = require("../models/teacherModel");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//middlewares
auth.use(express.json())

auth.post("/", async (req,res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let user = await TeacherModel.findOne({email:req.body.email});

    if( ! user ) return res.status(400).send("Invalid email or password")

   const validPassword = await bcrypt.compare(req.body.password,user.password)
   if( ! validPassword ) return res.status(400).send("Invalid email or password")
   
    const token = user.generateAuthToken();

    res.send(token)

})

function validateUser(req){
    const schema = {
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(req,schema)
}

module.exports = auth;