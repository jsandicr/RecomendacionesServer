const mongoose = require("mongoose");

/**
 * Esta es la definición de la estructura
 */
const CantanteSchema = mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cantante", CantanteSchema);