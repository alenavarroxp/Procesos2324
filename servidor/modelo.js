const datos = require("./cad.js");
const correo = require("./email.js");

function Sistema(test) {
  this.usuarios = {};
  this.test = test;
  this.cad = new datos.CAD();

  this.agregarUsuario = function (usr) {
    let res = { nick: -1 };
    if (!this.usuarios[usr.nick]) {
      this.usuarios[usr.nick] = new Usuario(usr);
      res.nick = usr.nick;

      // if (!this.test) {
      //   this.usuarioOAuth({ email: usr.nick }, function (obj) {
      //     console.log("Usuario agregado: " + obj.email);
      //   });
      // } else {
      //   console.log("Usuario agregado: " + usr.nick);
      // }
    } else {
      console.log("El usuario ya existe: " + usr.nick);
    }
    return res;
  };

  this.obtenerUsuarios = function () {
    return this.usuarios;
  };

  this.usuarioActivo = function (nick) {
    if (this.usuarios[nick] == null) return { activo: false };
    return { activo: true };
  };

  this.obtenerTodosNicks = function () {
    return Object.keys(this.usuarios);
  };

  this.eliminarUsuario = function (nick) {
    console.log("Eliminar usuario: " + nick);
    if (this.usuarios[nick] == null) {
      // console.log("El usuario no existe: " + nick);
      return { nick: -1 };
    }
    delete this.usuarios[nick];
    console.log("Usuario eliminado: " + nick);
    return { nick: nick };
  };

  this.numeroUsuarios = function () {
    return { num: Object.keys(this.usuarios).length };
  };

  if (!this.test) {
    this.cad.conectar(function () {
      console.log("Conectado a Mongo Atlas");
    });
  }

  this.usuarioOAuth = function (usr, callback) {
    let copiaN = usr.nick;
    let copiaE = usr.email;
    usr.confirmada = true;
    this.cad.buscarOCrearUsuario(usr, (obj) => {
      let modelo = this;
      if (obj.email == null) {
        console.log("El usuario " + usr.email + " ya estaba registrado");
        obj.email = copiaE;
        const user = { nick: copiaN, email: obj.email };
        modelo.agregarUsuario(user);
        callback(user);
      } else {
        const user = { nick: copiaN, email: copiaE };
        modelo.agregarUsuario(user);
        callback(user);
      }
    });
  };

  this.registrarUsuario = function (obj, callback) {
    let modelo = this;

    this.cad.buscarUsuario(obj, function (usr) {
      console.log("usr", usr);
      if (!usr || usr.error == -2) {
        obj.key = Date.now().toString();
        obj.confirmada = false;
        modelo.cad.insertarUsuario(obj, function (res) {
          callback(res);
        });

        // modelo.usuarios[obj.nick] = new Usuario({email:obj.email, password: obj.password});
        // this.usuarios = modelo.usuarios;
        // console.log("USUARIOS", this.usuarios);
        correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
      } else {
        callback({ email: -1 });
      }
    });
  };

  this.iniciarSesion = function (obj, callback) {
    console.log("INICIAR SESION", obj);
    if (!obj.nick) {
      obj.nick = obj.email;
    }

    console.log("OBJ!", obj);

    this.cad.buscarUsuario(obj, (usr) => {
      let modelo = this;
      console.log("Usuario encontrado:", usr); // Agregar esta línea para depuración
      if (!usr) {
        callback({ error: "Usuario no registrado" }, null);
      } else {
        if (usr.error == -1) {
          callback({ error: "Contraseña incorrecta" }, null);
          return;
        } else if (usr.error == -2) {
          callback({ error: "Usuario no registrado en local" },null);
          return;
        }
        console.log("USUARIO LOGIN", usr);
        modelo.agregarUsuario(usr);
        callback(null, usr);
      }
    });
  };

  this.confirmarUsuario = function (email, key, callback) {
    let modelo = this;
    this.cad.confirmarUsuario(email, key, function (obj) {
      callback(obj);
    });
  };

  this.reenviarCorreo = function (obj, callback) {
    correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
    callback(obj);
  };

  this.crearPartida = function (obj, callback) {
    let modelo = this;
    this.cad.buscarPartida(obj, function (partida) {
      if (!partida) {
        obj.id = Date.now().toString();
        obj.estado = "esperando";
        console.log("OBJPPARTIDA", obj);
        modelo.cad.insertarPartida(obj, function (res) {
          console.log("RES", res);
          callback(res);
        });
      } else {
        console.log("PARTIDA", partida);
        callback(partida);
      }
    });
  };
}

function Usuario(usr) {
  this.nick = usr.email;
  this.email = usr.email;
  this.clave = usr.password;
}

module.exports.Sistema = Sistema;
