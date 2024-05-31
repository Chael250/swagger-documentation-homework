const express = require("express");
const app = express.Router();
const Joi = require("joi");
const _=require('lodash');
const {UserModel,validate} = require("../models/userModel")
const authMiddleware = require("../middleware/authMiddleware")

app.use(express.json());

//Get request

app.get("/", async (req, res) => {
  const students = await UserModel.find().sort("name");
  if (!students) return res.send("No student registered...");

  res.send(students);
});

//Getting a single user

app.get("/:id", async (req, res) => {
  const oneStudent = await UserModel.findById(req.params.id);
  if (!oneStudent) return res.status(404).send("Such ID doesn't exist");

  res.send(oneStudent);
});

//Posting to the DB

app.post("/", authMiddleware,async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newStudent = new UserModel({
    name: req.body.name,
    stream: req.body.stream,
  });

  await newStudent.save();

  res.send(newStudent);
});

//Updating the DB

app.put("/:id", authMiddleware,async (req, res) => {
  const { error } = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const student = await UserModel.findByIdAndUpdate(
    req.params.id,_.pick(req.body,["name","stream"]),{new:true}
    // { name: req.body.name, stream: req.body.stream },
    // { new: true }
  );
  if(!student) res.status(404).send("Such ID doesn't...")

  res.send(student)
});

//Deleting from DB

app.delete("/:id", authMiddleware,async (req,res) => {
  const student = await UserModel.findByIdAndDelete(req.params.id);
  if(!student) return res.status(400).send(error.details[0].message)

  res.send("Deleted successfully...")
})

//Joi validation



module.exports = app
