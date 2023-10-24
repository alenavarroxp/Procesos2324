var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

function CAD() {
  this.usuarios;

  this.buscarOCrearUsuario = function (usr, callback) {
    //buscarOCrear(this.usuarios,{email:email},callback);
    buscarOCrear(this.usuarios, usr, callback);
  };

  function buscarOCrear(coleccion, criterio, callback) {
    coleccion.findOne(criterio, function (err, doc) {
      if (err) {
        throw err;
      }
      if (doc) {
        // Si el usuario ya existe, devolver un mensaje de error.
        callback({ error: "El usuario ya existe" });
      } else {
        // Si el usuario no existe, crearlo.
        coleccion.insertOne(criterio, function (err, result) {
          if (err) {
            throw err;
          }
          console.log("Elemento insertado");
          callback({ email: criterio.email });
        });
      }
    });
  }
  

  this.conectar = async function (callback) {
    let cad = this;
    let client = new mongo(
      "mongodb+srv://usr:usr@cluster0.2yazo9w.mongodb.net/?retryWrites=true&w=majority"
    );
    await client.connect();
    const database = client.db("sistema");
    cad.usuarios = database.collection("usuarios");
    callback(database);
  };
}

module.exports.CAD = CAD;
