let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let neo4j = require('neo4j-driver')

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('', ''));
let session = driver.session();

//Se usa en el buscador. Recibe el parametro de busqueda y returna los nombre que hacen match
app.get('/buscar/:termino', (req, res) => {
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
})

app.get('/:id', (req, res) => {
  session
    //Encuentra el nodo Song con el id enviado y retorna las relaciones de tipo Genre y Singer
    .run('MATCH(C:song)-[:SINGER]->(S:singer),(N)-[:GENRE]->(G:genre) WHERE ID(N) = '+req.params.id.toString()+' RETURN ID(C), C, S, G')
    .then((result) => {
      let respuesta = {
        id: 0,
        name: '',
        genre: [],
        singers: []
      }
      respuesta.id = result.records[0]._fields[0].low
      respuesta.name = result.records[0]._fields[1].properties.name
      result.records.forEach((result, id) => {
        //Evita que se almacenen elementos repetidos
        if(respuesta.singers[id-1] !== result._fields[2].properties.name){
          respuesta.singers.push(result._fields[2].properties.name)
        }
      })
      result.records.forEach((result, id) => {
        //Evita que se almacenen elementos repetidos
        if(respuesta.genre[id-1] !== result._fields[3].properties.name){
          respuesta.genre.push(result._fields[3].properties.name)
        }
      })
      res.send(respuesta)
    })
    .catch((err) => {
      console.log(err)
    });
})

app.listen(3000, () => {
  console.log("El servidor está disponible en el puerto 3000");
});

module.exports = app;