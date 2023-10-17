const datos = require("./cad.js");

function Sistema() {
  this.usuarios = {};
  this.cad = new datos.CAD();
  this.agregarUsuario = function (nick) {
    let res = { nick: -1 };
    if (!this.usuarios[nick]) {
      this.usuarios[nick] = new Usuario(nick);
      res.nick = nick;
      console.log("Usuario agregado: " + nick);
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

  this.cad.conectar(function () {
    console.log("Conectado a Mongo Atlas");
  });

  this.obtenerOCrearUsuario = function (email) {
    this.cad.buscarOCrearUsuario(email, function (res) {
      console.log("Usuario obtenido o creado: " + res.email);
    });
  };
}

function Usuario(nick) {
  this.nick = nick;
  this.email;
  this.clave;
}

module.exports.Sistema = Sistema;
