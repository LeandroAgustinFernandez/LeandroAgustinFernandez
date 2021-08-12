const express = require("express");
const Bcrypt = require("bcrypt");
const usuarioModel = require("../models/usuario.model");
const ruta = express.Router();
// const Joi = require("joi");

ruta.post("/", (req, res) => {
  usuarioModel
    .findOne({ email: req.body.email })
    .then((datos) => {
      if (datos) {
        const passwordValido = Bcrypt.compareSync(
          req.body.password,
          datos.password
        );
        if (!passwordValido) {
          return res
            .status(400)
            .json({ error: "ok", msj: `Usuario o contraseña incorrecta` });
        }
        res.json(datos);
      } else {
        res.status(400).json({
          error: "ok",
          msj: `Usuario o contraseña incorrecta`,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        error: "ok",
        msj: `error en el servicio ${err}`,
      });
    });
});

module.exports = ruta;
