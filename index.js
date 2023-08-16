const express = require("express");
const users = require("./routes/users");
const books = require("./routes/books");
const branches = require("./routes/branches");
const app = express();

app.listen(3000, () => {
  console.log("La aplicación está funcionando en el puerto 3000");
});

app.use("/", users);
app.use("/", books);
app.use("/", branches);
