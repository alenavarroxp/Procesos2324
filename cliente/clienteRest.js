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
        cw.mostrarToast(msg,top);
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

  this.registrarUsuario = function (nick,email, password) {
    $.ajax({
      type: "POST",
      url: "/registrarUsuario",
      data: JSON.stringify({nick:nick, email: email, password: password }),
      success: function (data) {
        console.log("data", data)
        if (data.nick != undefined) {
          console.log("Usuario " + data.nick + " ha sido registrado");
          // $.cookie("nick", data.nick)
          cw.limpiar();
          cw.mostrarInicioSesion();
          cw.mostrarToast("Usuario " + data.nick + " ha sido registrado");
        } else {
          console.log("El usuario ya está registrado");
          cw.mostrarMsg("El usuario ya está registrado");
        }
      },
      error: function (xhr, textStatus, errorThrown){
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      }, 
      contentType: "application/json",
    })
  };

  this.iniciarSesion = function (email, password){
    $.ajax({
      type: "POST",
      url: "/iniciarSesion",
      data: JSON.stringify({ email: email, password: password }),
      success: function (data) {
        if(data.error){
          cw.mostrarMsg(data.error);
        }
        if (data.email) {
          console.log("Usuario " + data.email + " ha iniciado sesion");
          cw.limpiar();
          $.cookie("nick", data.email)
          cw.mostrarToast("Bienvenido al sistema, " + data.email,top);
          cw.mostrarInicio();
        } 
      },
      error: function (xhr, textStatus, errorThrown){
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    })
  }
   
}
