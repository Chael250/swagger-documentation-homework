const express = require("express")
const teacher = express.Router()
const _=require("lodash")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {TeacherModel,validate} = require("../models/teacherModel")
teacher.use(express.json())

teacher.post("/", async(req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let user = await TeacherModel.findOne({email: req.body.email});
    if(user) return res.status(400).send("The user already exists...")

    let newUser = new TeacherModel({
        name: req.body.name,
        email: req.body.email,
       department: req.body.department,
       password: req.body.password
    })
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password,salt)
    
    await newUser.save()
    const token = newUser.generateAuthToken()
    
    res.header("x-auth-token", token).send(_.pick(newUser,["name","department"]))
})

module.exports = teacher