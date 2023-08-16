const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const { MONGO_DB_CONNECTION } = require("../db");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

mongoose
  .connect(MONGO_DB_CONNECTION)
  .catch((err) => console.error("Error de conexión a la base de datos:", err));

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  { collection: "Users" }
);

userSchema.plugin(uniqueValidator);
const Users = mongoose.model("Users", userSchema);

// GET - Obtener todos los usuarios
router.get("/users/all", async (req, res) => {
  try {
    const users = await Users.find().exec();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en la base de datos 500");
  }
});

// POST - Crear un nuevo usuario
router.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "user",
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al encriptar la contraseña");
  }
});

// PUT - Actualizar un usuario por ID
router.put("/users/:userId", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "user",
    };

    const user = await Users.findByIdAndUpdate(req.params.userId, updatedUser, {
      new: true,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al encriptar la contraseña");
  }
});

// DELETE - Eliminar un usuario por ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en la base de datos (delete)");
  }
});

module.exports = router;
