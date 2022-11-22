module.exports = (app) => {
  const genero = require("../controllers/genero.controller.js");

  //Estas son las rutas para el API
  //Registrar
  app.post("/genero", genero.create);

  //Listar
  app.get("/genero", genero.findAll);

  //Obtener
  app.get("/genero/:id", genero.findOne);

  //Actualizar
  app.put("/genero/:id", genero.update);

  //Eliminar
  app.delete("/genero/:id", genero.delete);
};