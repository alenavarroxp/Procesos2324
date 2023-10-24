const datos = require("./cad.js");

function Sistema(test) {
  this.usuarios = {};
  this.test = test;
  this.cad = new datos.CAD();
  this.agregarUsuario = function (nick) {
    let res = { nick: -1 };
    if (!this.usuarios[nick]) {
      this.usuarios[nick] = new Usuario(nick);
      res.nick = nick;
      this.usuarioOAuth({ email: nick }, function (obj) {
        console.log("Usuario agregado: " + obj.email);
      });
    } else {
      console.log("El usuario ya existe: " + nick);
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
    if (this.usuarios[nick] == null) {
      console.log("El usuario no existe: " + nick);
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
    let copia = usr;
    this.cad.buscarOCrearUsuario(usr, function (obj) {
      if (obj.email == null) {
        console.log("El usuario " + usr.email + " ya estaba registrado");
        obj.email = copia;
      }
      callback(obj);
    });
  };

  this.registrarUsuario = function (email, pwd, callback) {
    let nuevoUsuario = new Usuario();
    nuevoUsuario.email = email;
    nuevoUsuario.clave = pwd;
    this.usuarioOAuth({ email: nuevoUsuario.email }, function (obj) {
      if (obj.error) {
        callback({ error: "El usuario ya existe" });
      } else {
        console.log("Usuario registrado", nuevoUsuario);
        callback({ email: nuevoUsuario.email });
      }
    });
  };
}

function Usuario(nick) {
  this.nick = nick;
  this.email;
  this.clave;
}

module.exports.Sistema = Sistema;
