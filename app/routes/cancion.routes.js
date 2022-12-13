module.exports = (app) => {
  const cancion = require("../controllers/cancion.controller.js");

  //Estas son las rutas para el API
  //Registrar
  app.post("/cancion", cancion.create);

  //Listar
  app.get("/cancion", cancion.findAll);

  //Obtener
  app.get("/cancion/:id", cancion.findOne);

  //Buscador de canciones
  app.get("/cancion/buscador/:termino", cancion.buscador);

  //Actualizar
  app.put("/cancion/:id", cancion.update);

  //Eliminar
  app.delete("/cancion/:id", cancion.delete);

  //Añadir cancion a una playlist
  app.post("/cancion/playlist", cancion.addSongToPlaylist)

  //Eliminar cancion de una playlist
  app.delete("/cancion/playlist", cancion.deleteSongToPlaylist)

};