var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

function CAD() {
  this.usuarios;
  this.partidas;

  this.obtenerUsuario = function (email, callback) {
    if (!this.usuarios || !this.usuarios.find) {
      callback(undefined);
      return;
    }
    let col = this.usuarios;
    col.find({ email: email }).toArray(function (error, coleccion) {
      if (coleccion.length == 0) {
        callback(undefined);
      } else {
        console.log("LA COLECCION 0 ES ", coleccion[0]);
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
    insertar(this.usuarios, usuario, callback);
  };

  this.insertarUsuarioOAuth = function (usuario, callback) {
    insertarOAuth(this.usuarios, usuario, callback);
  };

  function buscar(coleccion, criterio, callback) {
    let col = coleccion;
    coleccion
      .find({ email: criterio.email })
      .toArray(async function (error, coleccion) {
        console.log("Coleccion BUSCAR", coleccion);
        if (coleccion.length == 0) {
          callback(undefined);
        }
        coleccion.forEach(async (element) => {
          if (!element.password) {
            console.log("USUARIO CON OAUTH CAD");
            if (coleccion.length == 1) {
              callback({
                error: -2,
                nick: element.nick,
                email: element.email,
                photo: element.photo,
              });
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

  this.eliminarUsuario = function (obj, callback) {
    console.log("ELIMINAR USUARIO CAD", obj);
    eliminar(
      this.usuarios,
      { email: obj.email, password: obj.password },
      callback
    );
  };

  function eliminar(coleccion, criterio, callback) {
    console.log("ELIMINA", coleccion, criterio);

    coleccion.deleteOne({ email: criterio.email });
    callback(criterio)

    
  }

  function insertarOAuth(coleccion, elemento, callback) {
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
    console.log("ALGO", email, key)
    confirmar(this.usuarios, email, key, callback);
  };

  function confirmar(coleccion, email, key, callback) {
    console.log("CONFIRMAR")
    coleccion.findOneAndUpdate(
      { email: email, key: key },
      { $set: { confirmada: true } },
      { returnDocument: "after" },
      function (err, doc) {
        console.log("DOC", doc);
        console.log("ERR", err);
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

  this.actualizarUsuario = function (usuario, callback) {
    actualizar(this.usuarios, usuario, callback);
  };

  function actualizar(coleccion, elemento, callback) {
    let col = coleccion;
    if (!elemento.newNick) {
      elemento.newNick = elemento.nick;
    }

    if (!elemento.newEmail) {
      elemento.newEmail = elemento.email;
    }

    if (!elemento.newPassword) {
      elemento.newPassword = elemento.password;
    }

    if (!elemento.newPhoto) {
      elemento.newPhoto = elemento.photo;
    }

    console.log("ELEMENTO PARA ACTUALIZAR", elemento);
    if (elemento.newPassword != elemento.password) {
      bcrypt.genSalt(
        10,
        async (err, salt) =>
          await bcrypt.hash(elemento.newPassword, salt, (err, hash) => {
            elemento.newPassword = hash;
            console.log("hash", hash);
            console.log("elemento new password", elemento.newPassword);
            col.findOneAndUpdate(
              {
                email: elemento.email,
                nick: elemento.nick,
              },
              {
                $set: {
                  email: elemento.newEmail,
                  nick: elemento.newNick,
                  password: elemento.newPassword,
                  photo: elemento.newPhoto,
                },
              },
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
          })
      );
    } else {
      if (!elemento.error) {
        col.findOneAndUpdate(
          {
            email: elemento.email,
            nick: elemento.nick,
          },
          {
            $set: {
              email: elemento.newEmail,
              nick: elemento.newNick,
              password: elemento.newPassword,
              photo: elemento.newPhoto,
            },
          },
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
      } else {
        col.findOneAndUpdate(
          {
            email: elemento.email,
            nick: elemento.nick,
          },
          {
            $set: {
              email: elemento.newEmail,
              nick: elemento.newNick,
              photo: elemento.newPhoto,
            },
          },
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
    }
  }

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
