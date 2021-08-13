const express = require("express");
const config = require("config");
const Bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
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
        // const jsonwebtoken = JWT.sign(
        //   {
        //     _id: datos._id,
        //     nombre: datos.nombre,
        //     email: datos.email,
        //   },
        //   `password`
        // );
        const jsonwebtoken = JWT.sign(
          {
            data: {
              _id: datos._id,
              nombre: datos.nombre,
              email: datos.email,
            },
          },
          config.get("configToken.SEED"),
          { expiresIn: config.get("configToken.expiration") }
        );
        // res.json(datos);
        res.json({
          usuario: {
            _id: datos._id,
            nombre: datos.nombre,
            email: datos.email,
          },
          token: jsonwebtoken,
        });
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
