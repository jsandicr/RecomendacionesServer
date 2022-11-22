const mongoose = require("mongoose");

/**
 * Esta es la definición de la estructura
 */
const GeneroSchema = mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Genero", GeneroSchema);