module.exports = (app) => {
  const playlist = require("../controllers/playlist.controller.js");

  //Estas son las rutas para el API
  //Registrar
  app.post("/playlist", playlist.create);

  //Listar
  app.get("/playlist", playlist.findAll);

  //Obtener
  app.get("/playlist/:id", playlist.findOne);

  //Actualizar
  app.put("/playlist/:id", playlist.update);

  //Eliminar
  app.delete("/playlist/:id", playlist.delete);
};