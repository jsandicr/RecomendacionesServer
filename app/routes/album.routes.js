module.exports = (app) => {
  const album = require("../controllers/album.controller.js");

  //Estas son las rutas para el API
  //Registrar
  app.post("/album", album.create);

  //Listar
  app.get("/album", album.findAll);

  //Obtener
  app.get("/album/:id", album.findOne);

  //Actualizar
  app.put("/album/:id", album.update);

  //Eliminar
  app.delete("/album/:id", album.delete);
};