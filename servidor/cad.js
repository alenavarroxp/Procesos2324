var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

function CAD() {
  this.usuarios;
  this.partidas;
  
  this.obtenerUsuario = function (email, callback) {
    if(!this.usuarios || !this.usuarios.find){
      callback(undefined);
      return;
    }
    let col = this.usuarios;
    col.find({ email: email }).toArray(function (error, coleccion) {
      if (coleccion.length == 0) {
        callback(undefined);
      } else {
        callback(coleccion[0]);
      }
    });
  };
  
  this.buscarUsuario = function (obj, callback) {
    buscar(
      this.usuarios,
      { email: obj.email, password: obj.password },
      callback
    );
  };

  this.insertarUsuario = function (usuario, callback) {
    console.log("INSERTARUSUARIO");
    insertar(this.usuarios, usuario, callback);
  };

  function buscar(coleccion, criterio, callback) {
    let col = coleccion;
    coleccion
      .find({ email: criterio.email })
      .toArray(async function (error, coleccion) {
        console.log("Coleccion", coleccion);
        if (coleccion.length == 0) {
          callback(undefined);
        }
        coleccion.forEach(async (element) => {
          if (!element.password) {
            console.log("USUARIO CON OAUTH CAD");
            if (coleccion.length == 1) {
              callback({ error: -2 });
            }
            return;
          }
          console.log("ELEMENTO CON CONTRASEÑA", element);
          const isPasswordCorrect = await bcrypt.compare(
            criterio.password,
            element.password
          );
          if (isPasswordCorrect) callback(element);
          else callback({ error: -1 });
        });

        // if (coleccion.length == 0 || !coleccion[0].password) {
        //   callback(undefined);
        // } else {
        //   const isPasswordCorrect = await bcrypt.compare(
        //     criterio.password,
        //     coleccion[0].password
        //   );
        //   if (isPasswordCorrect) {
        //     callback(coleccion[0]);
        //   } else {
        //     callback({ error: -1 });
        //   }
        // }
      });
  }

  function insertar(coleccion, elemento, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      if (elemento.password) {
        bcrypt.hash(elemento.password, salt, (err, hash) => {
          console.log("ELEMENTO", elemento);
          console.log("HASH", hash);
          elemento.password = hash;
          coleccion.insertOne(elemento, function (err, result) {
            if (err) {
              console.log("error");
            } else {
              console.log("Nuevo elemento creado");
              callback(elemento);
            }
          });
        });
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
    buscar(this.partidas, { nombrePartida: partida.nombrePartida }, callback);
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
