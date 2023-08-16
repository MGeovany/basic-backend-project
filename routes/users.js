const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const router = express.Router();

mongoose
  .connect("mongodb+srv")
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
router.get("/users/all", (req, res) => {
  Users.find({}, (err, users) => {
    if (err) {
      res.status(500).send("Error en la base de datos (all)");
    } else {
      res.status(200).json(users);
    }
  });
});

// POST - Crear un nuevo usuario
router.post("/users", (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "user",
    });

    newUser.save((err, user) => {
      if (err) {
        res.status(500).send("Error en la base de datos (create)");
      } else {
        res.status(201).json(user);
      }
    });
  } catch (error) {
    res.status(500).send("Error al encriptar la contraseña");
  }
});

// PUT - Actualizar un usuario por ID
router.put("/users/:id", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "user",
    };

    Users.findByIdAndUpdate(
      req.params.id,
      updatedUser,
      { new: true },
      (err, user) => {
        if (err) {
          res.status(500).send("Error en la base de datos (update)");
        } else {
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).send("Usuario no encontrado");
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send("Error al encriptar la contraseña");
  }
});

// DELETE - Eliminar un usuario por ID
router.delete("/users/:id", (req, res) => {
  Users.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send("Error en la base de datos (delete)");
    } else {
      if (user) {
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  });
});

module.exports = router;
