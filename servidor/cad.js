var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

function CAD() {
  this.usuarios;
  this.partidas;

  // this.obtenerUsuarios = function (callback) {
  //   // tengo que hacer un fetch a la base de datos para que me devuelvan todos los usuarios
  //   this.usuarios.find({}).toArray(function (err, result) {
  //     if (err) throw err;
  //     console.log("result", result);
  //     callback(result);
  //   });
  // };
  this.buscarUsuario = function (obj, callback) {
    buscar(this.usuarios, { email: obj.email }, callback);
  };

  this.insertarUsuario = function (usuario, callback) {
    console.log("INSERTARUSUARIO");
    insertar(this.usuarios, usuario, callback);
  };

  function buscar(coleccion, criterio, callback) {
    let col = coleccion;
    coleccion.find(criterio).toArray(function (error, coleccion) {
      if (coleccion.length == 0) {
        callback(undefined);
      } else {
        callback(coleccion[0]);
      }
    });
  }

  function insertar(coleccion, elemento, callback) {
    coleccion.insertOne(elemento, function (err, result) {
      if (err) {
        console.log("error");
      } else {
        console.log("Nuevo elemento creado");
        callback(elemento);
      }
    });
  }

  this.buscarOCrearUsuario = function (usr, callback) {
    buscarOCrear(this.usuarios, usr, callback);
  };

  function buscarOCrear(coleccion, criterio, callback) {
    coleccion.findOneAndUpdate(
      criterio,
      { $set: criterio },
      { upsert: true, returnDocument: "after", projection: { email: 1 } },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          console.log("Elemento actualizado");
          console.log(doc.value.email);
          callback({ email: doc.value.email });
        }
      }
    );
  }

  this.confirmarUsuario = function (email, key, callback) {
    confirmar(this.usuarios, email, key, callback);
  };

  function confirmar(coleccion, email, key, callback) {
    coleccion.findOneAndUpdate(
      { email: email, key: key },
      { $set: { confirmada: true } },
      { returnDocument: "after" },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          console.log("Elemento actualizado");
          console.log(doc.value);
          callback(doc.value);
        }
      }
    );
  }

  this.buscarPartida = function (partida, callback) {
    buscar(this.partidas, {nombrePartida:partida.nombrePartida}, callback);
  };
 

  this.insertarPartida = function (partida, callback) {
    console.log("INSERTARPARTIDA");
    insertar(this.partidas, partida, callback);
  };

  this.conectar = async function (callback) {
    let cad = this;
    let client = new mongo(
      "mongodb+srv://usr:usr@cluster0.2yazo9w.mongodb.net/?retryWrites=true&w=majority"
    );
    await client.connect();
    const database = client.db("sistema");
    cad.usuarios = database.collection("usuarios");
    cad.partidas = database.collection("partidas");
    callback(database);
  };
}

module.exports.CAD = CAD;
