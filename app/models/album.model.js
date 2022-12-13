const mongoose = require("mongoose");

/**
 * Esta es la definición de la estructura
 */
const AlbumSchema = mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Album", AlbumSchema);