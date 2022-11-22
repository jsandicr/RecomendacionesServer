const neo4j = require('neo4j-driver')

//Referencia al modelo
const Genero = require("../models/genero.model.js");

let driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('', ''));
let session = driver.session();

/**
 * Para crear un nuevo registro
 * @param {*} req Solicitud desde Web
 * @param {*} res Respuesta del producto creado
 * @returns JSON
 */
exports.create = (req, res) => {
  //Se valida
  if (!req.body.name) {
    return res.status(400).send({
      message: "El nombre del genero no puede ser vacío",
    });
  }

  //Se forma
  const genero = new Genero({
    name: req.body.name
  });

  //Se guarda
  session
    .run('CREATE (G:genre { name: "'+genero.name+'" })')
    .then( () => {
      let respuesta = 'Genero almacenado con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Opss. Tuvimos un error registrando el genero.",
      });
    });
};

/**
 * Se obtienen todos los registros
 * @param {*} req Solicitud web
 * @param {*} res Respuesta de registros en JSON
 */
exports.findAll = (req, res) => {
  session
    .run('MATCH(n:genre) return n')
    .then((result) => {
      if(result.records[0]){
        let genre = []
        result.records.forEach((result) => {
          genre.push(result._fields[0].properties.name)
        })
        res.send( JSON.stringify(genre) )
      }else{
        res.send([])
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Opss. Tuvimos un error al obtener el genero " + req.params.id,
      });
    });
};

/**
 * Se encuentra el producto por ID
 * @param {*} req Solicitud web
 * @param {*} res Respuesta del producto en JSON
 */
exports.findOne = (req, res) => {
  session
    .run('MATCH(N:genre) WHERE ID(N) = '+req.params.id+' return ID(N), N')
    .then((result) => {
        let respuesta = {
          id: 0,
          name: ''
        }
        if(result.records[0]){
          respuesta.id = result.records[0]._fields[0].low
          respuesta.name = result.records[0]._fields[1].properties.name
          res.send(respuesta)
        }else{
          res.send([])
        }
    })
    .catch((err) => {
      console.log(err)
    });
};

/**
 * Actualiza un registro
 * @param {*} req Solicitud web
 * @param {*} res Respuesta del registro actualizado
 * @returns JSON
 */
exports.update = (req, res) => {
  // Valida
  if (!req.body.name) {
    return res.status(400).send({
      message: "El nombre del genero no puede estar vacio",
    });
  }

  session
    .run('MATCH(G:genre) WHERE ID(G) = '+req.params.id+' SET G.name = "'+req.body.name+'" RETURN G')
    .then( () => {
      let respuesta = 'Genero actualizado con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Opss. Tuvimos un error al actualizar el producto " + req.params.id,
      });
    });
  
};

/**
 * Eliminar un producto
 * @param {*} req Solicitud web
 * @param {*} res Respuesta del producto eliminado
 */
exports.delete = (req, res) => {
  session
    .run('MATCH(G:genre) WHERE ID(G) = '+req.params.id+' DETACH DELETE G')
    .then( () => {
      res.send('Genero eliminado con exito')
    })
    .catch((err) => {
      console.log(err)
    });
};