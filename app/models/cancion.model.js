const mongoose = require("mongoose");

/**
 * Esta es la definición de la estructura
 */
const CancionSchema = mongoose.Schema(
  {
    name: String,
    spotifyId: String,
    album: String,
    generos: [],
    cantantes: []
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cancion", CancionSchema);