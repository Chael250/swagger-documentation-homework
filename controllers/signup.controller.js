const express = require("express");
const user = express.Router();
const jwt = require("jsonwebtoken")
const config = require("config")
const {UserModel,validate} = require("../models/userModel")
const bcrypt = require("bcrypt")
const _= require("lodash")

user.post("/", async(req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let user = await UserModel.findOne({email: req.body.email});
    if(user) return res.status(400).send("The user already exists...")

    let newUser = new UserModel({
        name: req.body.name,
        email:req.body.email,
        password: req.body.password
    })
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password,salt)
    
    await newUser.save()
    const token = newUser.generateAuthToken()
    
    res.header("x-auth-token", token).send(_.pick(newUser,["name","stream"]))
})

module.exports = user