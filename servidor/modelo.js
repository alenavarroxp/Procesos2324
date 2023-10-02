function Sistema() {
  this.usuarios = {};
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
    if (this.usuarios[nick] == null) return { res: false };
    return { res: true };
  };

  this.obtenerTodosNicks = function () {
    return Object.keys(this.usuarios);
  };

  this.eliminarUsuario = function (nick) {
    if (this.usuarios[nick] == null) {
      console.log("El usuario no existe: " + nick);
      return { res: false };
    }
    delete this.usuarios[nick];
    console.log("Usuario eliminado: " + nick);
    return { res: true };
  };

  this.numeroUsuarios = function () {
    return { num: Object.keys(this.usuarios).length };
  };
}

function Usuario(nick) {
  this.nick = nick;
}

module.exports.Sistema = Sistema;
