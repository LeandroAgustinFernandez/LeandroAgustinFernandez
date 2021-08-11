const usuarios = require("./routers/usuarios");
const express = require("express");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/demo", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Conectado a mongoDB`);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usuarios", usuarios);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`escuchando el puerto ${port}`);
});
