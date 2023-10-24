function ControlWeb() {
  this.mostrarAgregarUsuario = function () {
    let cadena = '<div id="mAU" class="form-group">';
    cadena += '<label for="nick">Introduce el nick:</label>';
    cadena += '<input type="text" class="form-control" id="nick">';
    cadena +=
      '<button id="btnAU" type="submit" class="btn btn-primary" style="margin:10px">Agregar Usuario</button>';
    cadena +=
      '<div style="display: flex; justify-content: center; align-items: center;">';
    cadena +=
      '<div class= "animate__animated animate__bounceIn animate__delay-1s" style="margin: 40px;"><a href="/auth/google"><img src="./cliente/img/google_signin_buttons/web/2x/btn_google_signin_dark_focus_web@2x.png" style="height: 40px;"></a></div>';
    cadena +=
      '<div class= "animate__animated animate__bounceIn animate__delay-2s" style="margin: 40px;"><a href="/auth/github/"><img src="./cliente/img/github_signin_buttons/github-button.png" style="height: 40px;"></a></div>';
    cadena += "</div>";
    $("#au").append(cadena);
    $("#btnAU").on("click", function () {
      let nick = $("#nick").val();
      rest.agregarUsuario(nick);
      $("#mAU").remove();
    });
  };

  this.mostrarObtenerUsuarios = function () {
    let cadena = '<div id="mOU" class="form-group">';
    cadena +=
      '<button id="btnOU" type="submit" class="btn btn-primary">Obtener Usuarios</button>';
    cadena += "</div>";
    $("#au").append(cadena);
    $("#btnOU").on("click", function () {
      rest.obtenerUsuarios();
      $("#mOU").remove();
    });
  };

  this.mostrarNumeroUsuarios = function () {
    let cadena = '<div id="mNU" class="form-group">';
    cadena +=
      '<button id="btnNU" type="submit" class="btn btn-primary">Numero Usuarios</button>';
    cadena += "</div>";
    $("#au").append(cadena);
    $("#btnNU").on("click", function () {
      rest.numeroUsuarios();
      $("#mNU").remove();
    });
  };

  this.mostrarUsuarioActivo = function () {
    let cadena = '<div id="mUA" class="form-group">';
    cadena += '<label for="nick">Introduce el nick:</label>';
    cadena += '<input type="text" class="form-control" id="nick">';
    cadena +=
      '<button id="btnUA" type="submit" class="btn btn-primary">Usuario Activo</button>';
    cadena += "</div>";
    $("#au").append(cadena);
    $("#btnUA").on("click", function () {
      let nick = $("#nick").val();
      rest.usuarioActivo(nick);
      $("#mUA").remove();
    });
  };

  this.mostrarEliminarUsuario = function () {
    let cadena = '<div id="mEU" class="form-group">';
    cadena += '<label for="nick">Introduce el nick:</label>';
    cadena += '<input type="text" class="form-control" id="nick">';
    cadena +=
      '<button id="btnEU" type="submit" class="btn btn-primary">Eliminar Usuario</button>';
    cadena += "</div>";
    $("#au").append(cadena);
    $("#btnEU").on("click", function () {
      let nick = $("#nick").val();
      rest.eliminarUsuario(nick);
      $("#mEU").remove();
    });
  };

  this.mostrarMsg = function (msg) {
    $("#mMsg").remove();
    let cadena = '<h2 id="mMsg">' + msg + "</h2>";
    $("#msg").append(cadena);
  };

  this.comprobarSesion = function () {
    let nick = $.cookie("nick");
    if (nick) {
      cw.mostrarMsg("Bienvenido al sistema, " + nick);
    } else {
      cw.mostrarAgregarUsuario();
      cw.init();
    }
  };

  this.init = function () {
    let cw = this;
    google.accounts.id.initialize({
      client_id:
        "726975145917-reol4tr88j6m8a0mqehb0k6sop45mto2.apps.googleusercontent.com", //prod
      auto_select: false,
      callback: cw.handleCredentialsResponse,
    });
    google.accounts.id.prompt();
  };

  this.handleCredentialsResponse = function (response) {
    let jwt = response.credential;
    let user = JSON.parse(atob(jwt.split(".")[1]));
    console.log(user.name);
    console.log(user.email);
    console.log(user.picture);
    rest.enviarJwt(jwt);
  };

  this.limpiar = function () {
    $("#mAU").remove();
  };

  this.mostrarOpciones = function () {
    //Quiero mostrar un boton de Crear Partida y otro de Unirse Partida
    let cadena = '<div id="mOP" class="form-group">';
    cadena +=
      '<button id="btnCP" type="submit" class="btn btn-primary">Crear Partida</button>';
    cadena +=
      '<button id="btnUP" type="submit" class="btn btn-primary">Unirse Partida</button>';
    cadena += "</div>";
    $("#au").append(cadena);
    $("#btnCP").on("click", function () {
      //rest.crearPartida();
      this.mostrarCrearPartida();
    });
    $("#btnUP").on("click", function () {
      //rest.unirsePartida();
      // $("#mOP").remove();
    });
  }

  this.salir = function () {
    $.removeCookie("nick");
    location.reload();
  };
}
