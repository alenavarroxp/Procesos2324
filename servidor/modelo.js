const datos = require("./cad.js");
const correo = require("./email.js");

function Sistema(test) {
  this.usuarios = {};
  this.partidas = {};
  this.test = test;
  this.cad = new datos.CAD();

  this.agregarUsuario = function (usr) {
    let res = { nick: -1 };
    if (!this.usuarios[usr.nick]) {
      this.usuarios[usr.nick] = new Usuario(usr);
      res.nick = usr.nick;
      console.log("Usuario agregado: " + usr.nick);
    } else {
      console.log("El usuario ya existe: " + usr.nick);
    }
    return res;
  };

  this.obtenerUsuario = function (email, callback) {
    console.log("AQUIOBJETENERUSUARIO");
    for (let usr in this.usuarios) {
      if (this.usuarios[usr].email == email) {
        callback(this.usuarios[usr]);
        return;
      }
    }
    callback({ email: null });
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

  this.recuperarUsuario = function (nick) {
    let modelo = this;
    if (!modelo.usuarios[nick]) {
      modelo.cad.obtenerUsuario(nick, function (usr) {
        if (usr.email == null) {
          console.log("El usuario " + nick + " no está registrado");
        } else {
          console.log("El usuario " + nick + " ha sido recuperado");
          modelo.agregarUsuario(usr);
        }
      });
    }
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
    usr.confirmada = true;
    this.cad.buscarOCrearUsuario(usr, function (obj) {
      if (obj.email == null) {
        console.log("El usuario " + usr.email + " ya estaba registrado");
        obj.email = copia;
      }
      callback(obj);
    });
  };

  this.registrarUsuario = function (obj, callback) {
    let modelo = this;

    this.cad.buscarUsuario(obj, function (usr) {
      console.log("usr", usr);
      if (!usr) {
        obj.key = Date.now().toString();
        obj.confirmada = false;
        modelo.cad.insertarUsuario(obj, function (res) {
          callback(res);
        });

        modelo.usuarios[obj.nick] = new Usuario(obj.email, obj.password);
        this.usuarios = modelo.usuarios;
        console.log("USUARIOS", this.usuarios);
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

    this.cad.buscarUsuario(obj, function (usr) {
      console.log("Usuario encontrado:", usr); // Agregar esta línea para depuración
      if (!usr) {
        callback({ error: "Usuario no registrado" }, null);
      } else {
        if (usr.error == -1) {
          callback({ error: "Contraseña incorrecta" }, null);
          return;
        }
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
    console.log("PARTIDAMODELOCREAR", obj);
    const id = Date.now().toString();
    const estado = "esperando";
    modelo.partidas[id] = new Partida(
      obj.email,
      obj.nombrePartida,
      obj.cantidadJugadores,
      obj.duracion,
      obj.numGoles,
      estado,
      obj.passCode
    );
    modelo.obtenerUsuario(obj.email, function (usr) {
      console.log("USUARIO OBTENIDO", usr);
      modelo.partidas[id].añadirJugador(usr);
    });
    this.partidas = modelo.partidas;
    console.log("PARTIDAS", this.partidas);
    callback({ id: id });
  };

  this.obtenerPartida = function (id, callback) {
    console.log("ID", id);
    console.log("PARTIDAS", this.partidas);
    if (!this.partidas[id]) {
      callback({ error: "Partida no encontrada" });
      return;
    } else {
      callback(this.partidas[id]);
    }
  };

  this.obtenerPartidas = function (callback) {
    console.log(this.partidas);
    callback(this.partidas);
  };

  this.unirsePartida = function (obj, callback) {
    console.log("USR y PASSCODE", obj);
    for (let partida in this.partidas) {
      if (this.partidas[partida].passCode == obj.passCode) {
        let check = this.partidas[partida].añadirJugador(obj.usr);
        console.log("PARTIDAS", this.partidas);
        switch (check) {
          case true:
            callback({ id: partida });
            return;
          case false:
            callback({ error: "La partida está llena" });
            return;
          case null:
            callback({ error: "El jugador ya está en la partida" });
            return;
          default:
            callback({ error: "Error" });
            return;
        }
      }
    }
    let error = "No se ha encontrado la partida con el código: " + obj.passCode;
    callback({ error: error });
  };
}

function Usuario(usr) {
  this.nick = usr.nick;
  this.email = usr.email;
  this.clave = usr.password;
}

function Partida(
  creador,
  nombrePartida,
  cantidadJugadores,
  duracion,
  numGoles,
  estado,
  passCode
) {
  this.creador = creador;
  this.nombrePartida = nombrePartida;
  this.cantidadJugadores = cantidadJugadores;

  if (duracion == "") {
    duracion = 5;
  }
  this.duracion = duracion;
  this.numGoles = numGoles;
  this.estado = estado;
  this.passCode = passCode;
  this.jugadores = {};
  this.jugadoresConectados = 0;

  this.añadirJugador = function (usr) {
    if (
      !this.jugadores[usr.nick] &&
      this.jugadoresConectados < this.cantidadJugadores
    ) {
      this.jugadores[usr.nick] = usr;
      this.jugadoresConectados = Object.keys(this.jugadores).length;
      console.log("Jugador agregado: " + usr.nick);
      return true;
    } else {
      if (this.jugadores[usr.nick]) {
        console.log("El jugador ya está en la partida: " + usr.nick);
        return null;
      } else {
        if (this.jugadoresConectados >= this.cantidadJugadores) {
          console.log("La partida está llena");
          return false;
        }
      }
    }
  };
}

module.exports.Sistema = Sistema;
