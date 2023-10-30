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
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.innerHTML = `<i class="fas fa-exclamation-circle text-red-500 mr-2"></i><span>${msg}</span>`;
    mensajeError.classList.remove("hidden");
  };

  this.mostrarToast = function (msg, position) {
    const toastConfig = {
      text: msg,
      duration: 5000,
      newWindow: true,
      close: false,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      avatar: "",
      style: {
        background: "rgb(37,99,235)",
        color: "#fff", // Color del texto en blanco
        display: "flex",
        alignItems: "center",
      },
    };

    if (position) {
      toastConfig.gravity = position;
    }

    Toastify(toastConfig).showToast();
  };

  this.comprobarSesion = function () {
    let nick = $.cookie("nick");
    if (nick) {
      cw.mostrarToast("Bienvenido al sistema, " + nick, top);
      cw.mostrarInicio();
    } else {
      // cw.mostrarAgregarUsuario();
      // cw.limpiar();
      cw.mostrarInicioSesion();
      cw.init();
    }
  };

  this.init = function () {
    let cw = this;
    google.accounts.id.initialize({
      client_id:
        "726975145917-reol4tr88j6m8a0mqehb0k6sop45mto2.apps.googleusercontent.com", //local
      // "726975145917-rae33a02hgmi3pjid1dh2dq334igsvqr.apps.googleusercontent.com", //prod
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
    $("#fmInicioSesion").remove();
    $("#fmRegistro").remove();
    $("#mOP").remove();
  };

  this.mostrarRegistro = function () {
    $("#fmInicioSesion").remove();
    $("#registro").load("./cliente/registro.html", function () {
      $("#btnRegistro").on("click", function () {
        event.preventDefault();
        let nick = $("#nick").val();
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (nick && email && pwd) {
          rest.registrarUsuario(nick, email, pwd);
          console.log(nick,email, pwd);
        } else {
          cw.mostrarMsg("Introduce los campos obligatorios");
        }
      });
    });
  };

  this.mostrarInicioSesion = function () {
    $("#fmRegistro").remove();
    $("#mOP").remove();
    $("#inicioSesion").load("./cliente/inicioSesion.html", function () {
      $("#btnInicioSesion").on("click", function () {
        event.preventDefault();
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (email && pwd) {
          rest.iniciarSesion(email, pwd);
          console.log("INICIO SESION ", email, pwd);
        } else {
          cw.mostrarMsg("Introduce un email y una contraseña");
        }
      });
    });
  };

  this.mostrarInicio = function () {
    $("#inicio").load("./cliente/inicio.html", function () {
      $("#btnSalir").on("click", function () {
        cw.salir();
      });

      $("#btnCrearPartida").on("click", function () {
        cw.mostrarCrearPartida();
      });

      $("#btnUnirsePartida").on("click", function () {
        cw.mostrarUnirsePartida();
      });
    });
  };

  this.animarInicio = function () {
    return new Promise ((resolve)=>{
      
    const crearPartida = document.getElementById("crearPartida");
    const unirsePartida = document.getElementById("unirsePartida");

    crearPartida.classList.add("animate__animated", "animate__slideOutLeft");
    unirsePartida.classList.add("animate__animated", "animate__slideOutRight");

    setTimeout(function () {
      crearPartida.style.display = "none";
      unirsePartida.style.display = "none";

      setTimeout(function () {
        crearPartida.classList.remove("animate__fadeOutLeft");
        unirsePartida.classList.remove("animate__fadeOutRight");

        crearPartida.style.display = "block";
        unirsePartida.style.display = "block";

        resolve();
      }, 50); // Ajusta este tiempo para permitir que los elementos se muestren antes de retirar las clases de animación
    }, 1000); // Ajusta el tiempo según la duración de la animación
    })

  };

  this.mostrarCrearPartida = async function () {
    await cw.animarInicio();
    $("#inicio").remove();
    $("#crearPartida").load("./cliente/crearPartida.html", function () {});
  };

  this.mostrarUnirsePartida = async function () {
    await cw.animarInicio();
    $("#inicio").remove();
    $("#unirsePartida").load("./cliente/unirsePartida.html", function () {});
  };

  this.salir = function () {
    $.removeCookie("nick");
    location.reload();
  };
}
