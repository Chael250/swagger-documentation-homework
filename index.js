const mongoose = require("mongoose");
const route = require("./controllers/user");
const teacher = require("./controllers/teacher");
const auth = require("./controllers/login.controller")
const express = require("express");
const app = express();
const swaggerDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")
const swaggerJSDoc = require("swagger-jsdoc")
require('dotenv').config();
const debug = require("debug")

//Connection to database

mongoose
  .connect("mongodb://localhost/student-homework")
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Couldn't connect to db...", err));

//middlewares
app.use("/api/students", route);
app.use("/api/teacher", teacher);
app.use("/api/auth", auth);

app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

const port = process.env.PORT || 2500;
app.listen(port,() => {
  console.log(`Connectind to port ${port}...`);
  
}) 