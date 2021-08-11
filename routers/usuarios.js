const express = require("express");
const usuarioModel = require("../models/usuario.model");
const ruta = express.Router();

// ruta.get("/", async (req, res) => {
//   res.json("Listo el GET de usuarios");
// });

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
