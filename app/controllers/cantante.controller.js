const neo4j = require('neo4j-driver')

//Referencia al modelo
const Cantante = require("../models/cantante.model.js");

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
      message: "El nombre del cantante no puede ser vacío",
    });
  }

  //Se forma
  const cantante = new Cantante({
    name: req.body.name
  });

  //Se guarda
  session
    //Encuentra el nodo Song con el id enviado y retorna las relaciones de tipo Genre y Singer
    .run('CREATE (C:singer { name: "'+cantante.name+'" })')
    .then( () => {
      let respuesta = 'Cantate almacenado con exito'
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};

/**
 * Se obtienen todos los registros
 * @param {*} req Solicitud web
 * @param {*} res Respuesta de registros en JSON
 */
exports.findAll = (req, res) => {
  session
    .run('MATCH(n:singer) return ID(n), n')
    .then((result) => {
      let respuesta = []
      if(result.records[0]){
        result.records.forEach((result) => {
          let cantante = {
            id: 0,
            name: ''
          }
          cantante.id = result._fields[0].low
          cantante.name = result._fields[1].properties.name
          respuesta.push(cantante)
        })
        res.send( respuesta )
      }else{
        res.send([])
      }
    })
    .catch((err) => {
      console.log(err)
    });
};

/**
 * Se encuentra el producto por ID
 * @param {*} req Solicitud web
 * @param {*} res Respuesta del producto en JSON
 */
exports.findOne = (req, res) => {
  session
    .run('MATCH(N:singer) WHERE ID(N) = '+req.params.id+' return ID(N), N')
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
      message: "El nombre del cantante no puede estar vacio",
    });
  }

  session
    .run('MATCH(C:singer) WHERE ID(C) = '+req.params.id+' SET C.name = "'+req.body.name+'" RETURN C')
    .then( () => {
      let respuesta = 'Cantate actualizado con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};

/**
 * Eliminar un producto
 * @param {*} req Solicitud web
 * @param {*} res Respuesta del producto eliminado
 */
exports.delete = (req, res) => {
  session
    .run('MATCH(C:singer) WHERE ID(C) = '+req.params.id+' DETACH DELETE C')
    .then( () => {
      let respuesta = 'Cantate eliminado con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};