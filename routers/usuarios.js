const express = require("express");
const usuarioModel = require("../models/usuario.model");
const ruta = express.Router();
const Joi = require("joi");

const usuarioValidacion = Joi.object({
  nombre: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

  email: Joi.string()
    .email()
    .pattern(
      new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
      )
    ),
});

ruta.post("/", (req, res) => {
  let body = req.body;
  const { error, value } = usuarioValidacion.validate({
    nombre: body.nombre,
    password: body.password,
    email: body.email,
  });
  if (!error) {
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
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

ruta.put("/:id", (req, res) => {
  let body = req.body;
  let id = req.params.id;
  let resultado = actualizarUsuario(id, body);
  resultado
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

ruta.delete("/:id", (req, res) => {
  let id = req.params.id;
  let resultado = eliminarUsuario(id);
  resultado
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

ruta.get("/", (req, res) => {
  let resultado = listarUsuariosActivos();
  resultado
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      res.status(400).send(err);
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

const actualizarUsuario = async (id, body) => {
  let usuario = await usuarioModel.findByIdAndUpdate(
    id,
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

const eliminarUsuario = async (id) => {
  let usuario = await usuarioModel.findByIdAndUpdate(
    id,
    {
      $set: {
        estado: false,
      },
    },
    { new: true }
  );
  return usuario;
};

const listarUsuariosActivos = async () => {
  let usuarios = await usuarioModel.find({ estado: true });
  return usuarios;
};

module.exports = ruta;
