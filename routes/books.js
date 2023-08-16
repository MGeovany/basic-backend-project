const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

mongoose
  .connect("mongodb+srv")
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
    sucursal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
      required: true,
    },
  },
  { collection: "Books" }
);

const Books = mongoose.model("Books", booksSchema);

// GET - Obtener todos los libros
router.get("/books/all", (req, res) => {
  Books.find({}, (err, books) => {
    if (err) {
      res.status(500).send("Error en la base de datos (all)");
    } else {
      res.status(200).json(books);
    }
  });
});

/// POST - Crear un nuevo libro
router.post("/books", (req, res) => {
  const newBook = new Books({
    bookName: req.body.bookName,
    image: req.body.image,
    amount: req.body.amount,
    user: req.body.user,
    sucursal: req.body.sucursal,
  });

  newBook.save((err, book) => {
    if (err) {
      res.status(500).send("Error en la base de datos (create)");
    } else {
      res.status(201).json(book);
    }
  });
});

// PUT - Actualizar un libro por ID
router.put("/books/:id", (req, res) => {
  const updatedBook = {
    bookName: req.body.bookName,
    image: req.body.image,
    amount: req.body.amount,
    user: req.body.user,
    sucursal: req.body.sucursal,
  };

  Books.findByIdAndUpdate(
    req.params.id,
    updatedBook,
    { new: true },
    (err, book) => {
      if (err) {
        res.status(500).send("Error en la base de datos (update)");
      } else {
        if (book) {
          res.status(200).json(book);
        } else {
          res.status(404).send("Libro no encontrado");
        }
      }
    }
  );
});

// DELETE - Eliminar un libro por ID
router.delete("/books/:id", (req, res) => {
  Books.findByIdAndDelete(req.params.id, (err, book) => {
    if (err) {
      res.status(500).send("Error en la base de datos (delete)");
    } else {
      if (book) {
        res.status(200).json({ message: "Libro eliminado exitosamente" });
      } else {
        res.status(404).send("Libro no encontrado");
      }
    }
  });
});

module.exports = router;
