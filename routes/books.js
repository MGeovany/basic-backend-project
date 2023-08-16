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

const booksSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
      required: true,
    },
  },
  { collection: "Books" }
);

const Books = mongoose.model("Books", booksSchema);

// GET - Obtener todos los libros
router.get("/books/all", async (req, res) => {
  try {
    const books = await Books.find().exec();
    res.status(200).json(books);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en la base de datos 500");
  }
});

/// POST - Crear un nuevo libro
const ObjectId = mongoose.Types.ObjectId;

router.post("/books", async (req, res) => {
  try {
    if (
      !ObjectId.isValid(req.body.user) &&
      !ObjectId.isValid(req.body.branch)
    ) {
      return res.status(400).send("El valor de 'user' 'branch' no es válido");
    }
    const newBook = new Books({
      bookName: req.body.bookName,
      image: req.body.image,
      amount: req.body.amount,
      user: req.body.user,
      branchName: req.body.branchName,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el server");
  }
});

// PUT - Actualizar un libro por ID
router.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = {
      bookName: req.body.bookName,
      image: req.body.image,
      amount: req.body.amount,
      user: req.body.user,
      branchName: req.body.branchName,
    };

    const books = await Books.findByIdAndUpdate(req.params.id, updatedBook, {
      new: true,
    });

    if (books) {
      res.status(200).json(books);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

// DELETE - Eliminar un libro por ID
router.delete("/books/:id", async (req, res) => {
  try {
    const books = await Books.findByIdAndDelete(req.params.id);
    if (books) {
      res.status(200).json({ message: "Libo eliminado exitosamente" });
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en la base de datos (delete)");
  }
});

module.exports = router;
