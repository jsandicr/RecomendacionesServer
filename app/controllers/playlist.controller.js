const neo4j = require('neo4j-driver')

//Referencia al modelo
const PlayList = require("../models/playlist.model.js");

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
      message: "El nombre de la playlist no puede ser vacío",
    });
  }

  //Se forma
  const playlist = new PlayList({
    name: req.body.name
  });

  //Se guarda
  session
    //Encuentra el nodo Song con el id enviado y retorna las relaciones de tipo Genre y Singer
    .run('CREATE (P:playlist { name: "'+playlist.name+'" })')
    .then( () => {
      let respuesta = 'Playlist almacenado con exito'
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};

//Relacionar canciones a playlist
/*
MATCH(S:song),
(P:playlist)
WHERE ID(S) = 0 AND ID(P) = 15
CREATE (P)-[:PLAYLIST]->(S)*/

/**
 * Se obtienen todos los registros
 * @param {*} req Solicitud web
 * @param {*} res Respuesta de registros en JSON
 */
exports.findAll = (req, res) => {
  session
    .run('MATCH(P:playlist) return ID(P), P')
    .then((result) => {
      let respuesta = []
      if(result.records[0]){
        result.records.forEach((result) => {
          let playlist = {
            id: 0,
            name: ''
          }
          playlist.id = result._fields[0].low
          playlist.name = result._fields[1].properties.name
          respuesta.push(playlist)
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
    .run('MATCH(P:playlist)-[:PLAYLIST]->(N:song) WHERE ID(P) = '+req.params.id+' RETURN ID(P),P,N')
    .then((result) => {
      const playlist = new PlayList({
        id: '',
        name: '',
        songs: []
      })
      if(result.records[0]){
        playlist.id = result.records[0]._fields[0].low
        playlist.name = result.records[0]._fields[1].properties.name
        result.records.forEach((result) => {
          if(!(playlist.songs.includes(result._fields[2].properties.name))){
            playlist.songs.push(result._fields[2].properties.name)
          }
        })
        res.send(playlist)
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
    .run('MATCH(P:playlist) WHERE ID(P) = '+req.params.id+' SET P.name = "'+req.body.name+'" RETURN P')
    .then( () => {
      let respuesta = 'Playlist actualizada con exito';
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
    .run('MATCH(P:playlist) WHERE ID(P) = '+req.params.id+' DETACH DELETE P')
    .then( () => {
      let respuesta = 'Playlist eliminado con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};