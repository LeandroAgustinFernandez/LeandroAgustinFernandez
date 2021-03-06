const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//DOC EMBEBIDO
// const autorSchema = new mongoose.Schema({
//   nombre: { type: String, required: true },
//   email: { type: String, required: true },
// });

const cursoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  //POR REFERENCIA
  autor: { type: Schema.Types.ObjectId, ref: "Usuario" }, //NOMBRE DEL OTRO ESQUEMA
  //DOC EMBEBIDO
  // autor: autorSchema,
  descripcion: { type: String, required: false },
  estado: { type: Boolean, default: true },
  imagen: {
    type: String,
    required: false,
  },
  alumnos: { type: Number, default: 0 },
  califica: { type: Number, default: 0 },
});

module.exports = mongoose.model("Curso", cursoSchema);
