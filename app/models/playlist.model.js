const mongoose = require("mongoose");

/**
 * Esta es la definición de la estructura
 */
const PlayListSchema = mongoose.Schema(
  {
    id: String,
    name: String,
    songs: []
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PlayList", PlayListSchema);