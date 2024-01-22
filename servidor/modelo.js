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
      if (!usr.clave && Object.values(this.usuarios).length > 0) {
        for (let user in this.usuarios) {
          if (this.usuarios[user].email == usr.email) return;
        }
      }
      this.usuarios[usr.nick] = new Usuario(usr);
      res.nick = usr.nick;
    } else {
      console.log("El usuario ya existe: " + usr.nick);
    }
    return res;
  };

  this.obtenerUsuario = function (email, callback) {
    for (let usr in this.usuarios) {
      console.log("usr", usr);
      if (this.usuarios[usr].email == email) {
        callback(this.usuarios[usr]);
        return;
      }
    }
    callback({ email: null });
  };

  this.obtenerUsuarioBD = function (email, callback) {
    this.cad.obtenerUsuario(email, function (usr) {
      console.log("USUARIO EN BD", usr);
      callback(usr);
    });
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
    // console.log("Eliminar usuario: " + nick);
    // console.log("USUARIOS ANTES DE ELIMINAR", this.usuarios)
    if (this.usuarios[nick] == null) {
      // console.log("El usuario no existe: " + nick);
      return { nick: -1 };
    }
    delete this.usuarios[nick];
    console.log("Usuario eliminado: " + nick);
    // console.log("USUARIOS DESPUES DE ELIMINAR", this.usuarios)
    return { nick: nick };
  };

  this.eliminarUsuarioBD = function (usr, callback) {
    console.log("Eliminar usuario: " + usr.nick)
    this.cad.eliminarUsuario(usr, function (res) {
      console.log("Usuario eliminado de la BD: " + usr);
      callback(res);
    });
  };

  this.recuperarUsuario = async function (nick) {
    let modelo = this;
    console.log("USUARIOS EN RECUPERAR USUARIO", modelo.usuarios);
    if (!modelo.usuarios[nick]) {
      console.log("no estaba en local")
      await modelo.cad.obtenerUsuario(nick, function (usr) {
        if (!usr) {
          console.log("El usuario " + nick + " no está registrado");
          return;
        }
        if (usr.email == null) {
          console.log("El usuario " + nick + " no está registrado");
        } else {
          console.log("El usuario " + nick + " ha sido recuperado");
          console.log("USUARIOS EN EL LOCAL", modelo.usuarios);
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

    correo.conectar(function (res) {
      console.log("Variables secretas obtenidas");
    });
  }

  this.usuarioOAuth = function (usr, callback) {
    let copiaN = usr.nick;
    let copiaE = usr.email;
    let copiaP = usr.photo;
    usr.confirmada = true;
    this.cad.buscarUsuario(usr, (obj) => {
      let modelo = this;

      if (!obj) {
        console.log("USUA", usr);
        modelo.cad.insertarUsuarioOAuth(usr, function (res) {
          callback(res);
        });
        // console.log("El usuario " + usr.email + " ya estaba registrado");
        // obj.email = copiaE;
        // const user = { nick: copiaN, email: obj.email, photo: copiaP };
        // modelo.agregarUsuario(user);
        // callback(user);
      } else {
        const user = {
          nick: copiaN,
          email: copiaE,
          photo: copiaP,
          clave: undefined,
        };
        modelo.agregarUsuario(user);
        callback(user);
      }
    });
  };

  this.registrarUsuario = function (obj, callback) {
    let modelo = this;
    console.log("OBJREGISTRAR", obj);

    this.cad.buscarUsuario(obj, function (usr) {
      console.log("usr", usr);
      if (!usr || usr.error == -2) {
        obj.key = Date.now().toString();
        obj.confirmada = false;
        modelo.cad.insertarUsuario(obj, function (res) {
          callback(res);
        });
        modelo.usuarios[obj.nick] = new Usuario({
          nick: obj.nick,
          email: obj.email,
          password: obj.password,
          photo: obj.photo,
        });
        this.usuarios = modelo.usuarios;
        console.log("USUARIOSIIII", this.usuarios);
        if (!modelo.test) {
          console.log("ENVIAR CORREO");
          correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
        }
      } else {
        callback({ email: -1 });
      }
    });
  };

  this.actualizarUsuario = function (obj, callback) {
    let modelo = this;
    console.log("OBJACTUALIZAR", obj);
    this.cad.buscarUsuario(obj, function (usr) {
      console.log("USUARIO ENCONTRADO", usr);
      if (!usr) {
        callback({ error: "Usuario no encontrado" });
      } else {
        if (usr.error == -1) {
          callback({ error: "Contraseña actual incorrecta" });
          return;
        }
        usr.newNick = obj.newNick;
        usr.newEmail = obj.newEmail;
        usr.newPhoto = obj.newPhoto;
        usr.newPassword = obj.newPassword;
        modelo.cad.actualizarUsuario(usr, function (res) {
          res.oldEmail = usr.email;
          res.oldNick = usr.nick;
          modelo.actualizarUsuarioLocal(res);
          callback(res);
        });
      }
    });
  };

  this.actualizarUsuarioLocal = function (usr) {
    console.log("LOCAL", usr);
    console.log("users", this.usuarios);
    for (let user in this.usuarios) {
      console.log("USUARIO", this.usuarios[user]);
      if (
        this.usuarios[user].email == usr.oldEmail &&
        this.usuarios[user].nick == usr.oldNick
      ) {
        delete this.usuarios[user];
        const updateUser = new Usuario({
          nick: usr.nick,
          email: usr.email,
          password: usr.password,
          photo: usr.photo,
        });
        this.usuarios[usr.nick] = updateUser;
        console.log("USUARIOS Local tras update", this.usuarios);
      }
    }
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
          callback({ error: "Usuario no registrado en local" }, null);
          return;
        }
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
    const id = Date.now().toString();
    const estado = "esperando";
    modelo.partidas[id] = new Partida(
      id,
      obj.email,
      obj.nombrePartida,
      obj.cantidadJugadores,
      obj.duracion,
      obj.numGoles,
      estado,
      obj.passCode
    );
    modelo.obtenerUsuario(obj.email, function (usr) {
      modelo.partidas[id].añadirJugador(usr);
    });
    this.partidas = modelo.partidas;
    callback({ id: id });
  };

  this.obtenerPartida = function (id, callback) {
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
    for (let partida in this.partidas) {
      if (this.partidas[partida].passCode == obj.passCode) {
        let check = this.partidas[partida].añadirJugador(obj.usr);
        // console.log("PARTIDAS", this.partidas);
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

  this.salirPartida = function (partida, usr, callback) {
    if (!this.partidas[partida.id]) {
      callback({ error: "Partida no encontrada" });
      return;
    } else {
      let check = this.partidas[partida.id].salirPartida(usr);

      if (this.partidas[partida.id].jugadoresConectados == 0) {
        this.eliminarPartida(partida.id);
      }

      switch (check) {
        case true:
          callback({ partida: this.partidas[partida.id] });
          return;
        case false:
          callback({ error: "El jugador no está en la partida" });
          return;
        default:
          callback({ error: "Error" });
          return;
      }
    }
  };

  this.eliminarPartida = function (id) {
    if (!this.partidas[id]) {
      console.log("Partida no encontrada");
      return;
    } else {
      delete this.partidas[id];
      console.log("Partida eliminada");
    }
  };

  this.unirseAEquipo = function (partida, usr, equipo, callback) {
    if (!this.partidas[partida.id]) {
      console.log("goals");
      return;
    }
    let check = this.partidas[partida.id].unirseAEquipo(usr, equipo);
    switch (check) {
      case true:
        callback({ partida: this.partidas[partida.id] });
        return;
      case undefined:
        callback({ error: "El jugador ya está en el equipo" });
        return;
      case false:
        callback({ error: "El jugador no está en la partida" });
        return;
      default:
        callback({ error: "Error" });
        return;
    }
  };
  this.salirEquipo = function (partida, usr, equipo, callback) {
    if (!this.partidas[partida.id]) return;
    let check = this.partidas[partida.id].salirEquipo(usr, equipo);
    switch (check) {
      case true:
        callback({ partida: this.partidas[partida.id] });
        return;
      case undefined:
        callback({ error: "El jugador no está en el equipo" });
        return;
      case false:
        callback({ error: "El jugador no está en la partida" });
        return;
      default:
        callback({ error: "Error" });
        return;
    }
  };

  this.actualizarEstadoPartida = function (partida, estado, callback) {
    if (!this.partidas[partida.id]) return;
    this.partidas[partida.id].estado = estado;
    callback(this.partidas[partida.id]);
  };

  this.actualizarPartidaGol = function (partida, equipo, callback) {
    console.log("ACTUALIZAR PARTIDA GOL EN SISTEMA", partida, equipo);
    if (!this.partidas[partida.id]) return;
    this.partidas[partida.id].actualizarPartidaGol(equipo);
    console.log("PARTIDAS", this.partidas[partida.id].equipos);
    callback(this.partidas[partida.id]);
  };
}

function Usuario(usr) {
  this.nick = usr.nick;
  this.email = usr.email;
  this.clave = usr.password;
  this.photo = usr.photo;
}

function Partida(
  id,
  creador,
  nombrePartida,
  cantidadJugadores,
  duracion,
  numGoles,
  estado,
  passCode
) {
  this.id = id;
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
  this.equipos = { equipoAzul: new Equipo(), equipoRojo: new Equipo() };

  this.añadirJugador = function (usr) {
    if (
      !this.jugadores[usr.nick] &&
      this.jugadoresConectados < this.cantidadJugadores
    ) {
      this.jugadores[usr.nick] = usr;
      this.jugadoresConectados = Object.keys(this.jugadores).length;
      if (this.jugadoresConectados == this.cantidadJugadores) {
        this.estado = "completa";
      }
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

  this.unirseAEquipo = function (usr, equipo) {
    if (this.jugadores[usr.nick]) {
      const añadido = this.equipos[equipo].unirseAEquipo(usr);
      // console.log("EQUIPOS EN LA PARTIDA", this.equipos);
      return añadido;
    } else {
      console.log("El jugador no está en la partida: " + usr.nick);
      return false;
    }
  };

  this.salirEquipo = function (usr, equipo) {
    if (this.jugadores[usr.nick]) {
      const eliminado = this.equipos[equipo].salirEquipo(usr);
      return eliminado;
    } else {
      console.log("El jugador no está en la partida: " + usr.nick);
      return false;
    }
  };

  this.salirPartida = function (usr) {
    if (this.jugadores[usr.nick]) {
      delete this.jugadores[usr.nick];
      this.jugadoresConectados = Object.keys(this.jugadores).length;
      if (this.jugadoresConectados < this.cantidadJugadores) {
        if (this.estado != "jugando") this.estado = "esperando";
      }
      // Comprobar si el jugador está en un equipo y eliminarlo
      for (let equipo in this.equipos) {
        if (this.equipos[equipo].jugadores[usr.nick]) {
          this.equipos[equipo].salirEquipo(usr);
        }
      }
      console.log("Jugador eliminado: " + usr.nick);
      return true;
    } else {
      console.log("El jugador no está en la partida: " + usr.nick);
      return false;
    }
  };

  this.actualizarPartidaGol = function (equipo) {
    console.log("paramtero equipo", equipo);
    console.log("This equipos equipo", this.equipos);
    this.equipos[equipo].actualizarPartidaGol();
  };
}

function Equipo() {
  this.jugadores = {};
  this.goles = 0;

  this.unirseAEquipo = function (usr) {
    if (!this.jugadores[usr.nick]) {
      this.jugadores[usr.nick] = usr;
      console.log("Jugador agregado: " + usr.nick);
      return true;
    } else {
      console.log("El jugador ya está en este equipo: " + usr.nick);
      return undefined;
    }
  };

  this.salirEquipo = function (usr) {
    console.log("JUGADORES EN EQUIPO", this.jugadores);
    if (this.jugadores[usr.nick]) {
      delete this.jugadores[usr.nick];
      console.log("Jugador eliminado: " + usr.nick);
      return true;
    } else {
      console.log("El jugador no está en este equipo: " + usr.nick);
      return undefined;
    }
  };

  this.actualizarPartidaGol = function () {
    console.log("GOLES ANTES", this.goles);
    this.goles++;
    console.log("GOLES DESPUES", this.goles);
  };
}

module.exports.Sistema = Sistema;
