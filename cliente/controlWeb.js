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

  this.mostrarMsg = function (msg, additionalMsg, onClickFunction) {
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.innerHTML = `
    <div>
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <span>${msg}</span>
    </div>`;

    if (additionalMsg) {
      mensajeError.innerHTML += `
      <div id="reenviarCorreo">
          <span class="font-bold hover:underline cursor-pointer hover:text-red-600">${additionalMsg}</span>
      </div>`;
    }
    mensajeError.classList.remove("hidden");
    if (onClickFunction) {
      const reenviarCorreo = document.getElementById("reenviarCorreo");
      reenviarCorreo.addEventListener("click", onClickFunction);
    }
  };

  this.mostrarToast = function (msg, gravity, position, color) {
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

    toastConfig.position = position ? position : toastConfig.position;
    toastConfig.gravity = gravity ? gravity : toastConfig.gravity;
    toastConfig.style.background = color ? color : toastConfig.style.background;

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

  this.validarEmail = function (email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("VALIDACION", emailPattern.test(email));
    return emailPattern.test(email);
  };

  let captchaValidado = false;

  this.mostrarRegistro = function () {
    $("#fmInicioSesion").remove();
    $("#registro").load("./cliente/registro.html", function () {
      $("#btnRegistro").on("click", function () {
        let email = $("#email").val();

        if (!cw.validarEmail(email)) {
          cw.mostrarMsg("Introduce un email válido");
          return;
        }
        var recaptchaContainer = document.getElementById("recaptchaContainer");
        if (recaptchaContainer.innerHTML.trim() === "") {
          grecaptcha.ready(function () {
            grecaptcha.render("recaptchaContainer", {
              sitekey: "6LeD_OMoAAAAAJpglLq5dNlNdabIHSrCJW-E5Dar",
              callback: function (token) {
                rest.verificacionRecaptcha(token, function (validado) {
                  captchaValidado = validado;
                });
                console.log("captcha", captchaValidado);
              },
              theme: "light",
            });
          });
        }

        console.log("REGISTRO");
        event.preventDefault();
        let nick = $("#nick").val();

        let pwd = $("#pwd").val();

        if (nick && email && pwd) {
          $("#mensajeError").empty();
          try {
            if (captchaValidado) {
              rest.registrarUsuario(nick, email, pwd);
              captchaValidado = false;
            }
            console.log(nick, email, pwd);
          } catch (error) {
            cw.mostrarMsg("Error en la verificación reCAPTCHA");
          }
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
    cw.limpiarInicio();
    $("#inicio").load("./cliente/inicio.html", function () {
      cw.mostrarHome();
      $("#navbar").load("./cliente/navbar.html", function () {
        $("#btnSalir").on("click", function () {
          cw.salir();
        });

        $("#homeVisible").on("click", function () {
          console.log("HOME");
          cw.mostrarHome();
        });

        $("#crearPartidaVisible").on("click", function () {
          console.log("CREAR PARTIDA");
          cw.mostrarCrearPartida();
        });

        $("#explorarPartidosVisible").on("click", function () {
          console.log("EXPLORAR PARTIDOS");
          cw.mostrarExplorarPartida();
        });
      });
    });
  };

  this.mostrarHome = function () {
    if ($("#home").is(":empty")) {
      cw.limpiarInicio();
      $("#home").load("./cliente/home.html", function () {
        // Agregar esta clase: class="w-full"
        $("#home").removeClass("hidden");
      });
    }
  };

  this.mostrarCrearPartida = async function () {
    if ($("#crearPartida").is(":empty")) {
      cw.limpiarInicio();

      console.log("MOSTRAR CREAR PARTIDA");
      let crearPartidaDiv = document.getElementById("crearPartida");

      if (crearPartidaDiv.innerHTML === "") {
        $("#crearPartida").load("./cliente/crearPartida.html", function () {
          $("#crearPartida").removeClass("hidden");
          $("#btnInfoPartida").on("click", function () {
            event.preventDefault();
            let email = $.cookie("nick");
            let nombrePartida = $("#nombrePartida").val();
            let cantidadJugadores = $("#cantidadJugadores").val();
            let duracion = $("#duracionPartida").val();
            let numGoles = $("#numGoles").val();
            if (
              email &&
              nombrePartida &&
              cantidadJugadores &&
              (duracion || numGoles)
            ) {
              $("#mensajeError").empty();
              cw.mostrarInfoPartida(
                email,
                nombrePartida,
                cantidadJugadores,
                duracion,
                numGoles
              );
              
            } else {
              cw.mostrarMsg("Introduce los campos obligatorios");
            }
          });
        });
      }
    }
  };

  this.mostrarInfoPartida = function (
    email,
    nombrePartida,
    cantidadJugadores,
    duracion,
    numGoles
  ) {
    infoPartida = document.getElementById("infoPartida");
    infoPartida.classList.remove("hidden");
    $("#infoPartida").load("./cliente/infoPartida.html", function () {
      let iPartidaElement = document.getElementById("iPartida");
      comunDiv = document.createElement("div");
      comunDiv.className = "flex flex-col w-full mb-2";
      comunDiv.innerHTML = `<div class="flex flex-col w-full mb-2">
                <div class="mb-2">
                    <p class="text-xl text-gray-800 font-bold">· Nombre de la partida:</p>
                    <p class="text-lg text-gray-600 font-semibold tracking-tighter">${nombrePartida}</p>
                </div>
            </div>

            <div class="flex flex-col w-full mb-2">
                <div class="mb-2">
                    <p class="text-xl text-gray-800 font-bold tracking-tight">· Cantidad de jugadores:</p>
                    <p class="text-lg text-gray-600 font-semibold tracking-tighter">${cantidadJugadores} jugadores</p>
                </div>
            </div>
            <div class="flex flex-col w-full">
                <p class="text-xl text-gray-800 font-bold tracking-tight">· Tipo de Partido:</p>
                `

      if (numGoles != "" && duracion != "") {
        comunDiv.innerHTML += `<div class="flex flex-row justify-between p-1">
                    <div class="flex flex-col ml-4 text-center">
                        <p class="text-xl text-gray-800 font-bold tracking-tight">Duración</p>
                        <p class="text-lg text-gray-600 font-semibold tracking-tighter">${duracion} minutos</p>
                    </div>
                    <div class="flex flex-col ml-4 text-center">
                        <p class="text-xl text-gray-800 font-bold tracking-tight">Número de goles</p>
                        <p class="text-lg text-gray-600 font-semibold tracking-tighter">${numGoles} goles</p>
                    </div>
                </div>
            </div>`;
      }else if (numGoles != "" && duracion == "") {
        comunDiv.innerHTML += `<div class="flex flex-row justify-between p-1">
                    <div class="flex flex-col ml-4 text-center">
                        <p class="text-xl text-gray-800 font-bold tracking-tight">Duración</p>
                        <p class="text-lg text-gray-600 font-semibold tracking-tighter">Por defecto: 5 minutos</p>
                    </div>
                    <div class="flex flex-col ml-4 text-center">
                        <p class="text-xl text-gray-800 font-bold tracking-tight">Número de goles</p>
                        <p class="text-lg text-gray-600 font-semibold tracking-tighter">${numGoles} goles</p>
                    </div>
                </div>
            </div>`;
      }else if (duracion != "" && numGoles == "") {
        comunDiv.innerHTML += `<div class="flex flex-row justify-between p-1">
            <div class="flex flex-col ml-4 text-center">
              <p class="text-xl text-gray-800 font-bold tracking-tight">Duración</p>
              <p class="text-lg text-gray-600 font-semibold tracking-tighter">${duracion} minutos</p>
            </div>
          </div>
        </div>`;
      }


      iPartidaElement.appendChild(comunDiv);

      $("#cancelarPartida").on("click", function () {
        $("#infoPartida").addClass("hidden");
      });

      $("#crearPartidaBtn").on("click", function () {
        rest.crearPartida(
          email,
          nombrePartida,
          cantidadJugadores,
          duracion,
          numGoles
        );
        //Redirigir al juego PROXIMAMENTE
        cw.mostrarInicio();
      });
    });
  };

  this.mostrarExplorarPartida = async function () {
    if ($("#explorarPartidas").is(":empty")) {
      cw.limpiarInicio();
      console.log("MOSTRAR EXPLORAR PARTIDA");
      $("#explorarPartidas").load(
        "./cliente/explorarPartidos.html",
        async function () {
          console.log("MOSTRAR EXPLORAR PARTIDA");
          $("#explorarPartidas").removeClass("hidden");
          if (document.getElementById("otp-input").innerHTML == "") {
            const otpContainer = document.getElementById("otp-input");

            for (let i = 0; i < 8; i++) {
              const input = document.createElement("input");
              input.type = "text";
              input.maxLength = 1;
              input.placeholder = "_";
              input.className =
                "w-12 h-12 text-center font-semibold justify-center flex text-2xl border-none rounded";

              input.addEventListener("keydown", function (e) {
                const key = e.key;

                if (key === "Backspace") {
                  if (!e.target.value) {
                    const prevInput = e.target.previousElementSibling;
                    if (prevInput) {
                      prevInput.focus();
                    }
                  } else {
                    e.target.value = "";
                  }
                } else {
                  const actualInput = e.target;
                  if (key.length > 1) {
                    e.preventDefault();
                    return;
                  }
                  actualInput.value = key;
                  const nextInput = e.target.nextElementSibling;

                  if (nextInput) {
                    if (!nextInput.value) {
                      nextInput.value = " ";
                    }
                    nextInput.focus();
                  }
                }
              });

              otpContainer.appendChild(input);
            }
          }

          await rest.obtenerPartidas(function (partidas) {
            const partidasPadre = document.getElementById("partidas");
            const noPartidas = document.getElementById("no-partidas");
            console.log("PartidasPadre", partidasPadre);
            console.log("PARTIDASWEb", partidas);
            const cantidadPartidas = Object.keys(partidas).length;
            console.log("CANTIDAD PARTIDAS", cantidadPartidas);

            if (cantidadPartidas === 0) {
              console.log("NO HAY PARTIDAS");

              const noPartidasDiv = document.createElement("div");
              noPartidasDiv.classList.add(
                "flex",
                "flex-col",
                "justify-center",
                "items-center",
                "h-full"
              );
              noPartidasDiv.innerHTML = `
              <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="text-center">
                  <p class="text-lg text-gray-700 mb-4">En este momento, no hay ninguna partida disponible para poder unirte</p>
                  <div class=" w-full  items-center justify-center mb-4 px-32">
                  <div class="border-t border-gray-200 w-full" /></div>
                  <p class="m-3">¿Por qué no creas una?</p>
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Crear Partida</button>
                </div>
                <div class=" overflow-hidden animate__animated animate__slideInRight">
                  <lottie-player src="./cliente/img/lottie/triste.json" background="transparent" speed="1"
                  class="w-32 h-32" loop autoplay></lottie-player>
                </div>
              </div>
          
              `;

              noPartidasDiv.addEventListener("click", () => {
                // Aquí puedes agregar la lógica para redirigir al usuario a la página de creación de partidas
                // Por ejemplo:
                // window.location.href = "ruta de la página para crear partidas";
                cw.mostrarCrearPartida();
              });

              noPartidas.appendChild(noPartidasDiv);
              return;
            }

            for (let clave in partidas) {
              noPartidas.style.display = "none";
              let partida = partidas[clave];
              const nuevaPartidaDiv = document.createElement("div");
              nuevaPartidaDiv.className =
                "border rounded-xl p-2 m-2 flex-col flex cursor-pointer shadow-md min-w-max h-40";

              if (partida.estado === "esperando") {
                nuevaPartidaDiv.innerHTML = `
                    <div class="flex-1">
                        <h3 class="font-semibold text-xl">${partida.nombrePartida}</h3>
                        <p class="text-sm">${partida.creador}</p>
                    </div>
                    <div class="flex items-center bottom-0 justify-between">
                        <div class="items-center justify-center flex flex-row bg-neutral rounded-box text-neutral-content w-40">
                          <span class="relative flex h-3 w-3 m-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </span>
                          <p class="text-xl text-white font-bold">Esperando...</p>
                        </div>
                        <div class="flex items-center justify-center">
                            <i class="fas fa-users text-xl mr-2"></i>
                            <p class="text-xl font-bold">${partida.jugadoresConectados}/${partida.cantidadJugadores}</p>
                        </div>
                    </div>
                `;
              } else if (partida.estado === "empezada") {
                nuevaPartidaDiv.innerHTML = `
                    <div class="flex-1">
                        <h3 class="font-semibold text-xl">${partida.nombrePartida}</h3>
                        <p class="text-sm">${partida.creador}</p>
                    </div>
                    <div class="flex items-center bottom-0 justify-between">
                        <div class="items-center justify-center flex-row">
                            <div class="flex flex-rol items-center justify-center p-2 bg-neutral rounded-box text-neutral-content">
                                <span class="relative flex h-3 w-3 m-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <span class="countdown font-mono text-2xl">
                                    <span style="--value:${partida.duracion};"></span> :
                                    <span style="--value:00;"></span>
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <i class="fas fa-users text-xl mr-2"></i>
                            <p class="text-xl font-bold">${partida.jugadoresConectados}/${partida.cantidadJugadores}</p>
                        </div>
                    </div>
                `;
              }

              // Agregar el nuevo div al contenedor de partidas
              partidasPadre.appendChild(nuevaPartidaDiv);
            }
          });
        }
      );
    }
  };

  this.limpiarInicio = function () {
    $("#explorarPartidas").empty();
    $("#crearPartida").empty();
    $("#home").empty();
    $("#home").addClass("hidden");
    $("#crearPartida").addClass("hidden");
    $("#explorarPartidas").addClass("hidden");
  };

  this.salir = function () {
    $.removeCookie("nick");
    location.reload();
    rest.cerrarSesion();
  };
}
