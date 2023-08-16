const express = require("express");
const mongoose = require("mongoose");
const { MONGO_DB_CONNECTION } = require("../db");

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
router.get("/branches/all", (req, res) => {
  Branches.find({}, (err, branches) => {
    if (err) {
      res.status(500).send("Error en la base de datos (all)");
    } else {
      res.status(200).json(branches);
    }
  });
});

// POST - Crear una nueva sucursal
router.post("/branches", (req, res) => {
  const newBranch = new Branches({
    branchName: req.body.branchName,
    image: req.body.image,
    user: req.body.user,
  });

  newBranch.save((err, branch) => {
    if (err) {
      res.status(500).send("Error en la base de datos (create)");
      console.log(err);
    } else {
      res.status(201).json(branch);
    }
  });
});

// PUT - Actualizar una sucursal por ID
router.put("/branches/:id", (req, res) => {
  const updatedBranch = {
    branchName: req.body.branchName,
    image: req.body.image,
    user: req.body.user,
  };

  Branches.findByIdAndUpdate(
    req.params.id,
    updatedBranch,
    { new: true },
    (err, branch) => {
      if (err) {
        res.status(500).send("Error en la base de datos (update)");
      } else {
        if (branch) {
          res.status(200).json(branch);
        } else {
          res.status(404).send("Sucursal no encontrada");
        }
      }
    }
  );
});

// DELETE - Eliminar una sucursal por ID
router.delete("/branches/:id", (req, res) => {
  Branches.findByIdAndDelete(req.params.id, (err, branch) => {
    if (err) {
      res.status(500).send("Error en la base de datos (delete)");
    } else {
      if (branch) {
        res.status(200).json({ message: "Sucursal eliminada exitosamente" });
      } else {
        res.status(404).send("Sucursal no encontrada");
      }
    }
  });
});

module.exports = router;
