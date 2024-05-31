const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config")

const teacherSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength: 255,
        unique:true
    },
    department:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    }

})

teacherSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, config.get("jwtPrivateKey"))
    return token;
}

const TeacherModel = mongoose.model("Teacher", teacherSchema);

function validateUser(teacher){
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        department: Joi.string().required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(teacher,schema)
}

module.exports.TeacherModel = TeacherModel
module.exports.validate = validateUser