module.exports = (app) => {
  const cantante = require("../controllers/cantante.controller.js");

  //Estas son las rutas para el API
  //Registrar
  app.post("/cantante", cantante.create);

  //Listar
  app.get("/cantante", cantante.findAll);

  //Obtener
  app.get("/cantante/:id", cantante.findOne);

  //Actualizar
  app.put("/cantante/:id", cantante.update);

  //Eliminar
  app.delete("/cantante/:id", cantante.delete);
};