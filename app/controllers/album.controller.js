const neo4j = require('neo4j-driver')

//Referencia al modelo
const Album = require("../models/album.model.js");

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
      message: "El nombre del album no puede ser vacío",
    });
  }

  //Se forma
  const album = new Album({
    name: req.body.name
  });

  //Se guarda
  session
    //Encuentra el nodo Song con el id enviado y retorna las relaciones de tipo Genre y Singer
    .run('CREATE (A:album { name: "'+album.name+'" })')
    .then( () => {
      let respuesta = 'Album almacenado con exito'
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};

//Relacionar canciones a album
/*MATCH(S:song),
(A:album)
WHERE ID(S) = 0 AND ID(A) = 16
CREATE (A)-[:ALBUM]->(S)*/

/**
 * Se obtienen todos los registros
 * @param {*} req Solicitud web
 * @param {*} res Respuesta de registros en JSON
 */
exports.findAll = (req, res) => {
  session
    .run('MATCH(A:album) return ID(A), A')
    .then((result) => {
      let respuesta = []
      if(result.records[0]){
        result.records.forEach((result) => {
          let album = {
            id: 0,
            name: ''
          }
          album.id = result._fields[0].low
          album.name = result._fields[1].properties.name
          respuesta.push(album)
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
    .run('MATCH(A:album) WHERE ID(A) = '+req.params.id+' return ID(A), A')
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
      message: "El nombre del album no puede estar vacio",
    });
  }

  session
    .run('MATCH(A:album) WHERE ID(A) = '+req.params.id+' SET A.name = "'+req.body.name+'" RETURN A')
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
    .run('MATCH(A:album) WHERE ID(A) = '+req.params.id+' DETACH DELETE A')
    .then( () => {
      let respuesta = 'Album eliminado con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};