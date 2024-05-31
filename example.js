const express = require("express");
const mongoose = require("mongoose");
const swaggerDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const swaggerJSDoc = require("swagger-jsdoc");
//--------------------------------------
// this is my connection of this to the database named students
const app = express();
app.use(express.json());
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: swaggerDocument,
  apis: [],
});
mongoose
  .connect("mongodb://127.0.0.1:27017/students")
  .then(() => {
    debug("Connected successfully to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
//this is to create the schema object.
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: Number,
});
// for creating the model
const UserModel = mongoose.model("User", userSchema);
//----- adding  a single student
app.get("/", (req, res) => {
  res.send("this is nelson");
});
app.post("/students", async (req, res) => {
  const student = new UserModel({
    name: req.body.name,
    grade: req.body.class,
    age: req.body.age,
  });
  try {
    const result = await student.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});
//--- find all students from the database
app.get("/students", (req, res) => {
  UserModel.find({})
    .then((users) => {
      if (users.length == 0)
        return res.status(404).send("There is no student.");
      res.status(200).send(users);
    })
    .catch((error) => {
      debug(error);
      res.status(500).send({ error: "Error fetching users" });
    });
});
//---- find a single student
app.get("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "no user found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//updating the user
app.put("/students/:id",async (req, res) => {
  try {
    const id = req.params.id;
    const { name, age, grade } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, age, grade },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//deleting  s single student based on his or her id
app.delete("/students/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    } else {
      res.status(200).json({ message: "Student deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//deleting  all students
app.delete("/students:id", async (req, res) => {
  const studentToDelete = await UserModel.findOneAndDelete(req.params.id);
  res.send(studentToDelete);
});
//starting a server
app.listen(4650, () => {
  debug("Server is running successfully on port 4650");
  app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
});







