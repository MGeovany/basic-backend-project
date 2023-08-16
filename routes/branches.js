const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const { MONGO_DB_CONNECTION } = require("../db");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

mongoose
  .connect(MONGO_DB_CONNECTION)
  .catch((err) => console.error("Error de conexión a la base de datos:", err));

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { collection: "Branches" }
);

const Branches = mongoose.model("Branches", branchSchema);

// GET - Obtener todas las sucursales
router.get("/branches/all", async (req, res) => {
  try {
    const branches = await Branches.find().exec();
    res.status(200).json(branches);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en la base de datos 500");
  }
});

// POST - Crear una nueva sucursal
const ObjectId = mongoose.Types.ObjectId;

// POST - Crear una nueva sucursal
router.post("/branches", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.body.user)) {
      return res.status(400).send("El valor de 'user' no es válido");
    }

    const newBranch = new Branches({
      branchName: req.body.branchName,
      image: req.body.image,
      user: req.body.user,
    });
    const savedBranch = await newBranch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el server");
  }
});

// PUT - Actualizar una sucursal por ID
router.put("/branches/:branchId", async (req, res) => {
  try {
    const updatedBranch = {
      branchName: req.body.branchName,
      image: req.body.image,
      user: req.body.user,
    };

    const branch = await Branches.findByIdAndUpdate(
      req.params.branchId,
      updatedBranch,
      {
        new: true,
      }
    );

    if (branch) {
      res.status(200).json(branch);
    } else {
      res.status(404).send("Sucursal no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

// DELETE - Eliminar una sucursal por ID
router.delete("/branches/:id", async (req, res) => {
  try {
    const branch = await Branches.findByIdAndDelete(req.params.id);
    if (branch) {
      res.status(200).json({ message: "Sucursal eliminado exitosamente" });
    } else {
      res.status(404).send("Sucursal no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en la base de datos (delete)");
  }
});

module.exports = router;
