function Sistema() {
  this.usuarios = {};
  this.agregarUsuario = function (nick) {
    if (this.usuarios[nick] != null) throw new Error("El usuario ya existe");
    this.usuarios[nick] = new Usuario(nick);
    console.log("Usuario agregado: " + nick);
  };
  this.obtenerUsuarios = function () {
    return this.usuarios;
  };

  this.usuarioActivo = function (nick) {
    if (this.usuarios[nick] == null) return false;
    return true;
  };

  this.obtenerNicks = function () {
    var nicks = [];
    for (var nick in this.usuarios) {
      nicks.push(nick);
    }
    return nicks;
  };

  this.eliminarUsuario = function (nick) {
    if (this.usuarios[nick] == null) throw new Error("El usuario no existe");
    delete this.usuarios[nick];
    console.log("Usuario eliminado: " + nick);
  };

  this.numeroUsuarios = function () {
    return Object.keys(this.usuarios).length;
  };
}

function Usuario(nick) {
  this.nick = nick;
}
