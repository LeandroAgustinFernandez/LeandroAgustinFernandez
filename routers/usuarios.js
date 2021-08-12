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
ruta.post("/", (req, res) => {
  let body = req.body;
  usuarioModel.findOne({ email: req.body.email }, (err, usu) => {
    if (err) {
      return res.status(400).json({ error: `Server Error` });
    }
    if (usu) {
      return res.status(400).json({ error: `El correo ya existe` });
    }
  });
  const { error, value } = usuarioValidacion.validate({
    nombre: body.nombre,
    password: body.password,
    email: body.email,
  });
  if (!error) {
    let resultado = crearUsuario(body);
    resultado
      .then((response) => {
        res.json({
          nombre: response.nombre,
          email: response.email,
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
ruta.put("/:email", (req, res) => {
  let email = req.params.email;
  let body = req.body;
  const { error, value } = usuarioValidacion.validate({
    nombre: body.nombre,
    password: body.password,
  });
  if (!error) {
    let resultado = actualizarUsuario(email, body);
    resultado
      .then((response) => {
        res.json({
          nombre: response.nombre,
          email: response.email,
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({ error: error.details[0].message });
  }
});
ruta.delete("/:email", (req, res) => {
  let email = req.params.email;
  let resultado = eliminarUsuario(email);
  resultado
    .then((response) => {
      res.json({
        nombre: response.nombre,
        email: response.email,
      });
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
    { email: email },
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
    { email: email },
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
  let usuarios = await usuarioModel
    .find({ estado: true })
    .select({ nombre: 1, email: 1 });
  return usuarios;
};

// const existeEmail = (email) => {
//   let usuario = usuarioModel.findOne(email, (err, usu) => {
//     if (err) {
//       return false;
//     } else if (usu) {
//       return
//     }
//   });
// };

module.exports = ruta;
