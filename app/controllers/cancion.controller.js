const neo4j = require('neo4j-driver')

//Referencia al modelo
const Cancion = require("../models/cancion.model.js");

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
      message: "El nombre de la cancion no puede ser vacío",
    });
  }

  //Se forma
  const cancion = new Cancion({
    name: req.body.name,
    spotifyId: req.body.spotifyId
  });

  //Se guarda
  session
    //Encuentra el nodo Song con el id enviado y retorna las relaciones de tipo Genre y Singer
    .run('CREATE (S:song { name: "'+cancion.name+'", spotifyId: "'+cancion.spotifyId+'" })')
    .then( () => {
      let respuesta = 'Cancion almacenado con exito'
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
  /*const cancion = new Cancion({
    id: 0,
    name: '',
    spotifyId: '',
    album: '',
    generos: [],
    cantantes: []
  });*/
  const canciones = [];
  session
    .run('OPTIONAL MATCH(A:album)-[:ALBUM]->(C:song)'+
    'OPTIONAL MATCH(S:singer)-[:SINGER]->(C:song)'+
    'OPTIONAL MATCH(G:genre)-[:GENRE]->(C:song)'+
    'return C,A,S,G')
    .then((result) => {
      if(result.records[0]){
        let lastCantante = ''
        let lastGenero = ''
        let generos = [];
        let cantantes = [];
        let lastSong = result.records[0]._fields[0].properties.name
        result.records.forEach((result) => {
          const cancion = new Cancion({
            id: 0,
            name: '',
            spotifyId: '',
            album: '',
            generos: [],
            cantantes: []
          });
          if(result._fields[0].properties.name == lastSong){
            cancion.name = result._fields[0].properties.name
            cancion.spotifyId = result._fields[0].properties.spotifyId
            cancion.album = result._fields[1].properties.name
            lastSong = result._fields[0].properties.name
            if(result._fields[2].properties.name != lastCantante){
              cantantes.push(result._fields[2].properties.name)
              lastCantante = result._fields[2].properties.name
            }
            if(result._fields[3].properties.name != lastGenero){
              generos.push(result._fields[3].properties.name)
              lastGenero = result._fields[3].properties.name
            }
            cancion.cantantes = cantantes
            cancion.generos = generos
          }
          else{
            //console.log(cancion)
            const nuevaCancion = cancion
            canciones.push(nuevaCancion)
            console.log(canciones)
            generos = []
            cantantes = []
            lastCantante = ''
            lastGenero = ''
            cancion.name = result._fields[0].properties.name
            cancion.spotifyId = result._fields[0].properties.spotifyId
            cancion.album = result._fields[1].properties.name
            lastSong = result._fields[0].properties.name
            if(result._fields[2].properties.name != lastCantante){
              cantantes.push(result._fields[2].properties.name)
              lastCantante = result._fields[2].properties.name
            }
            if(result._fields[3].properties.name != lastGenero){
              generos.push(result._fields[3].properties.name)
              lastGenero = result._fields[3].properties.name
            }
            cancion.cantantes = cantantes
            cancion.generos = generos
          }
        })
        res.send( canciones )
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
  let cancion = new Cancion({
    id: 0,
    name: '',
    spotifyId: '',
    album: '',
    generos: [],
    cantantes: []
  });
  session
    .run('OPTIONAL MATCH(A:album)-[:ALBUM]->(C:song) WHERE ID(C)='+req.params.id+
          ' OPTIONAL MATCH(S:singer)-[:SINGER]->(C:song) WHERE ID(C)='+req.params.id+
          ' OPTIONAL MATCH(G:genre)-[:GENRE]->(C:song) WHERE ID(C)='+req.params.id+
          ' return C,A,S,G')
    .then((result) => {
      if(result.records[0]){
        //console.log(result.records[1]._fields[3])
        cancion.id = result.records[0]._fields[0].low
        cancion.name = result.records[0]._fields[0].properties.name
        cancion.spotifyId = result.records[0]._fields[0].properties.spotifyId
        cancion.album = result.records[0]._fields[1].properties.name
        if(result.records[0]._fields[2] != null){
          let cantantes = []
          let lastCantante = ''
          result.records.forEach((result) => {
            if(result._fields[2].properties.name != lastCantante){
              cantantes.push(result._fields[2].properties.name)
              lastCantante = result._fields[2].properties.name
            }
          })
          cancion.cantantes = cantantes
        }
        if(result.records[0]._fields[3] != null){
          let generos = []
          let lastGenero = ''
          result.records.forEach((result) => {
            if(result._fields[2].properties.name != lastGenero){
              generos.push(result._fields[3].properties.name)
              lastGenero = result._fields[3].properties.name
            }
          })
          cancion.generos = generos
        }
        res.send(cancion)
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
      message: "El nombre de la cancion no puede estar vacio",
    });
  }

  session
    .run('MATCH(S:song) WHERE ID(S) = '+req.params.id+' SET S.name = "'+req.body.name+'", S.spotifyId = "'+req.body.spotifyId+'" RETURN A')
    .then( () => {
      let respuesta = 'Cancion actualizado con exito';
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
    .run('MATCH(S:song) WHERE ID(S) = '+req.params.id+' DETACH DELETE S')
    .then( () => {
      let respuesta = 'Cancion eliminada con exito';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};

exports.buscador = (req, res) => {
  session
    .run('MATCH(n:song) where toLower(n.name) =~ ".*'+req.params.termino.toLowerCase()+'.*"  return ID(n), n.name LIMIT 5')
    .then((result) => {
      if(result.records[0]){
        let respuestas = []
        result.records.forEach((result) => {
          let respuesta = {
            id: 0,
            name: ''
          }
          respuesta.id = result._fields[0].low
          respuesta.name = result._fields[1]
          respuestas.push(respuesta)
        })
        res.send( respuestas )
      }else{
        res.send([])
      }
    })
    .catch((err) => {
      console.log(err)
    });
}

exports.addSongToPlaylist = (req, res) => {
  // Valida
  if (!req.body.idSong) {
    return res.status(400).send({
      message: "La cancion no puede estar vacio",
    });
  }

  if (!req.body.idPlaylist) {
    return res.status(400).send({
      message: "La playlist no puede estar vacio",
    });
  }

  session
    .run('MATCH (N:song),(P:playlist) WHERE ID(N) = '+req.body.idSong+' AND ID(P) = '+req.body.idPlaylist+' CREATE (P)-[:PLAYLIST]->(N) RETURN N')
    .then( () => {
      let respuesta = 'Cancion agregada a la playlist';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};

exports.deleteSongToPlaylist = (req, res) => {
  // Valida
  if (!req.body.idSong) {
    return res.status(400).send({
      message: "La cancion no puede estar vacio",
    });
  }

  if (!req.body.idPlaylist) {
    return res.status(400).send({
      message: "La playlist no puede estar vacio",
    });
  }

  session
    .run('MATCH(P:playlist)-[R:PLAYLIST]->(S:song) WHERE ID(S) = '+req.body.idSong+' AND ID(P) = '+req.body.idPlaylist+' DETACH DELETE R')
    .then( () => {
      let respuesta = 'Cancion agregada a la playlist';
      res.send(JSON.stringify(respuesta))
    })
    .catch((err) => {
      console.log(err)
    });
};