const usuarios = require("./routers/usuarios");
const cursos = require("./routers/cursos");
const auth = require("./routers/auth");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
mongoose
  .connect(config.get("configDB.HOST"), {
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
app.use("/api/cursos", cursos);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`escuchando el puerto ${port}`);
});
