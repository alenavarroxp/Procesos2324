function ClienteRest() {
  this.agregarUsuario = function (nick) {
    var cli = this;

    $.getJSON("/agregarUsuario/" + nick, function (data) {
      let msg = "El nick " + nick + " ya está ocupado";
      if (data.nick != -1) {
        console.log("Usuario " + nick + " ha sido registrado");
        msg = "Bienvenido al sistema, " + nick;
        $.cookie("nick", nick);
      } else {
        console.log("El nick ya está ocupado");
      }
      cw.limpiar();
      cw.mostrarMsg(msg);
      cw.mostrarOpciones();
    });
  };

  this.agregarUsuario2 = function (nick) {
    $.ajax({
      type: "GET",
      url: "/agregarUsuario/" + nick,
      success: function (data) {
        if (data.nick != -1) {
          console.log("Usuario " + nick + " ha sido registrado");
        } else {
          console.log("El nick ya está ocupado");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.obtenerUsuario = function (email, callback) {
    $.getJSON("/obtenerUsuario/" + email, function (data) {
      callback(data);
    });
  };

  this.obtenerUsuarios = function () {
    $.getJSON("/obtenerUsuarios", function (data) {
      console.log(data);
    });
  };

  this.numeroUsuarios = function () {
    $.getJSON("/numeroUsuarios", function (data) {
      console.log(data);
    });
  };

  this.usuarioActivo = function (nick) {
    $.getJSON("/usuarioActivo/" + nick, function (data) {
      if (data.activo) {
        console.log("El usuario " + nick + " está activo");
      } else {
        console.log("El usuario " + nick + " no está activo");
      }
    });
  };

  this.eliminarUsuario = function (nick) {
    $.getJSON("/eliminarUsuario/" + nick, function (data) {
      if (data.nick != -1) {
        console.log("Usuario " + nick + " ha sido eliminado");
      } else {
        console.log("El nick no está registrado");
      }
    });
  };

  this.recuperarUsuario = function (nick) {
    $.getJSON("/recuperarUsuario/" + nick, function (data) {
      if (data.nick != -1) {
        console.log("Usuario " + nick + " ha sido recuperado");
      } else {
        console.log("El nick no está registrado");
      }
    });
  };

  this.enviarJwt = function (jwt) {
    $.ajax({
      type: "POST",
      url: "/enviarJwt",
      data: JSON.stringify({ jwt: jwt }),
      success: function (data) {
        let msg = "El nick " + data.nick + " está ocupado";
        if (data.nick != -1) {
          console.log("Usuario " + data.nick + " ha sido registrado");
          msg = "Bienvenido al sistema, " + data.nick;
          $.cookie("nick", data.nick);
        } else {
          19;
          console.log("El nick ya está ocupado");
        }
        cw.limpiar();
        cw.mostrarToast(msg, top);
        cw.mostrarInicio();
      },
      error: function (xhr, textStatus, errorThrown) {
        //console.log(JSON.parse(xhr.responseText));
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
      //dataType:'json'
    });
  };

  this.verificacionRecaptcha = function (token, callback) {
    $.ajax({
      type: "POST",
      url: "/verificacionRecaptcha",
      data: JSON.stringify({ token: token }),
      success: function (data) {
        if (data.success) {
          console.log("Captcha correcto");
          callback(true);
        } else {
          console.log("Captcha incorrecto");
          callback(false);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.registrarUsuario = function (nick, email, password) {
    $.ajax({
      type: "POST",
      url: "/registrarUsuario",
      data: JSON.stringify({ nick: nick, email: email, password: password }),
      success: function (data) {
        console.log("data", data);
        if (data.nick != undefined) {
          console.log("Usuario " + data.nick + " ha sido registrado");
          // $.cookie("nick", data.nick)
          cw.mostrarToast("Consulta tu correo para confirmar tu cuenta", top);
          cw.limpiar();
          cw.mostrarInicioSesion();
          cw.mostrarToast("Usuario " + data.nick + " ha sido registrado");
        } else {
          console.log("El usuario ya está registrado");
          cw.mostrarMsg("El usuario ya está registrado");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.iniciarSesion = function (email, password) {
    $.ajax({
      type: "POST",
      url: "/iniciarSesion",
      data: JSON.stringify({ email: email, password: password }),
      success: function (data) {
        console.log("DATA", data.usr);
        if (data.usr.confirmada == false) {
          cw.mostrarMsg(
            "Tienes que confirmar tu cuenta para acceder",
            "Reenviar correo de confirmación",
            function () {
              $.ajax({
                type: "POST",
                url: "/reenviarCorreo",
                data: JSON.stringify({
                  email: data.usr.email,
                  key: data.usr.key,
                }),
                success: function (data) {
                  cw.mostrarToast("Correo reenviado a " + data.email, top);
                },
                error: function (xhr, textStatus, errorThrown) {
                  console.log("Status: " + textStatus);
                  console.log("Error: " + errorThrown);
                },
                contentType: "application/json",
              });
            }
          );
          return;
        }
        if (data.usr.error) {
          cw.mostrarMsg(data.usr.error);
        }
        if (data.usr.email) {
          console.log("Usuario " + data.usr.email + " ha iniciado sesion");
          cw.limpiar();
          $.cookie("nick", data.usr.email);
          cw.mostrarToast("Bienvenido al sistema, " + data.usr.email, top);
          cw.mostrarInicio();
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.crearPartida = function (
    email,
    nombrePartida,
    cantidadJugadores,
    duracion,
    numGoles,
    passCode
  ) {
    $.ajax({
      type: "POST",
      url: "/crearPartida",
      data: JSON.stringify({
        email: email,
        nombrePartida: nombrePartida,
        cantidadJugadores: cantidadJugadores,
        duracion: duracion,
        numGoles: numGoles,
        passCode: passCode,
      }),
      success: function (data) {
        if (data.error) {
          cw.mostrarMsg(data.error);
        }
        if (data) {
          cw.obtenerPartida(data.id);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.obtenerPartida = function (IDPartida, callback) {
    $.getJSON("/obtenerPartida/" + IDPartida, function (data) {
      if (data.error) {
        cw.mostrarToast(data.error, top);
      } else {
        callback(data);
      }
    });
  };

  this.obtenerPartidas = function (callback) {
    $.getJSON("/obtenerPartidas", function (data) {
      console.log(data);
      callback(data);
    });
  };

  this.unirsePartida = function (usr, passCode) {
    $.ajax({
      type: "POST",
      url: "/unirsePartida",
      data: JSON.stringify({ usr: usr, passCode: passCode }),
      success: function (data) {
        console.log("DARA", data);
        if (data.error) {
          cw.mostrarToast(data.error, top);
        } else {
          if (data.id) {
            cw.mostrarToast("Te has unido a la partida", top);
          }
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };

  this.cerrarSesion = function () {
    $.getJSON("/cerrarSesion", function () {
      console.log("Sesion cerrada");
      $.removeCookie("nick");
    });
  };
}
