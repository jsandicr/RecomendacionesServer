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

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

let driver = neo4j.driver('bolt://localhost:7687/Canciones', neo4j.auth.basic('', ''));
let session = driver.session();

require("./app/routes/genero.routes.js")(app);
require("./app/routes/cantante.routes.js")(app);
require("./app/routes/album.routes.js")(app);
require("./app/routes/playlist.routes.js")(app);
require("./app/routes/cancion.routes.js")(app);

app.listen(3000, () => {
  console.log("El servidor está disponible en el puerto 3000");
});

module.exports = app;