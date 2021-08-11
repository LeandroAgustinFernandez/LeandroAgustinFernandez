const express = require("express");
const usuarioModel = require("../models/usuario.model");
const ruta = express.Router();

ruta.get("/", async (req, res) => {
  res.json("Listo el GET de usuarios");
});

ruta.post("/", (req, res) => {
  let body = req.body;
  let resultado = crearUsuario(body);
  resultado
    .then((doc) => {
      res.json({
        valor: doc,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.put("/:email", (req, res) => {
  let body = req.body;
  let email = req.params.email;
  let resultado = actualizarUsuario(email, body);
  resultado
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

ruta.delete("/:email", (req, res) => {
  let email = req.params.email;
  let resultado = eliminarUsuario(email);
  resultado
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

const crearUsuario = async (body) => {
  let usuario = new usuarioModel({
    email: body.email,
    nombre: body.nombre,
    password: body.password,
  });
  return await usuario.save();
};

const actualizarUsuario = async (email, body) => {
  let usuario = await usuarioModel.findOneAndUpdate(
    email,
    {
      $set: {
        nombre: body.nombre,
        password: body.password,
      },
    },
    { new: true }
  );
  return usuario;
};

const eliminarUsuario = async (email) => {
  let usuario = await usuarioModel.findOneAndUpdate(
    email,
    {
      $set: {
        estado: false,
      },
    },
    { new: true }
  );
  return usuario;
};
module.exports = ruta;
