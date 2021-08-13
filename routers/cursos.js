const express = require("express");
const ruta = express.Router();
const verificarToken = require("../middlewares/auth");
const cursoModel = require("../models/curso.model");
const Joi = require("joi");

const cursoValidacion = Joi.object({
  titulo: Joi.string().alphanum().min(3).max(30).required(),
  descripcion: Joi.string().alphanum().min(3).max(60),
});

ruta.get("/", verificarToken, (req, res) => {
  // res.json(req.data);
  let resultado = listarCursos();
  resultado
    .then((cursos) => {
      res.json(cursos);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  // res.json({message:`Bienvenidos al tren`})
});
ruta.post("/", verificarToken, (req, res) => {
  let body = req;
  const { error, value } = cursoValidacion.validate({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
  });
  if (!error) {
    let resultado = crearCurso(body);
    resultado
      .then((curso) => {
        res.json(curso);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

ruta.put("/:id", verificarToken, (req, res) => {
  let body = req.body;
  let id = req.params.id;
  const { error, value } = cursoValidacion.validate({
    titulo: body.titulo,
    descripcion: body.descripcion,
  });
  if (!error) {
    let resultado = actualizarCurso(id, body);
    resultado
      .then((curso) => {
        res.json(curso);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});
ruta.delete("/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let resultado = eliminarCurso(id);
  resultado
    .then((curso) => {
      res.json(curso);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

const crearCurso = async (req) => {
  let curso = new cursoModel({
    titulo: req.body.titulo,
    autor: req.data._id, //POR REFERENCIA
    // autor: req.data, //DOC EMBEBIDO
    descripcion: req.body.descripcion,
  });
  return await curso.save();
};

const actualizarCurso = async (id, body) => {
  let curso = await cursoModel.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        titulo: body.titulo,
        descripcion: body.descripcion,
      },
    },
    { new: true }
  );
  return curso;
};
const eliminarCurso = async (id) => {
  let curso = await cursoModel.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        estado: false,
      },
    },
    { new: true }
  );
  return curso;
};
const listarCursos = async () => {
  let cursos = await cursoModel.find().populate("autor", "nombre -_id"); //simbolo menos para excluir
  // let cursos = await cursoModel.find(); //DOC EMBEBIDO
  return cursos;
};

module.exports = ruta;
