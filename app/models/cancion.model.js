const mongoose = require("mongoose");

/**
 * Esta es la definición de la estructura
 */
const CancionSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    spotifyId: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cancion", CancionSchema);