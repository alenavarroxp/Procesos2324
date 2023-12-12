function ControlWeb() {
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
      rest.recuperarUsuario(nick);
      cw.mostrarToast("Bienvenido al sistema, " + nick, top);
      cw.mostrarInicio();
    } else {
      // cw.mostrarAgregarUsuario();
      // cw.limpiar();
      cw.mostrarInicioSesion();
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
      // cw.mostrarPartido();
      $("#navbar").load("./cliente/navbar.html", function () {
        rest.obtenerUsuario($.cookie("nick"), function (usr) {
          $("#username").text(usr.nick);
          // $("#imgUsuario").attr("src", usr.img);
        });
        partido = document.getElementById("partido");
        $("#btnSalir").on("click", function () {
          if ($("#partido").is(":empty")) {
            cw.salir();
          } else {
            cw.mostrarToast(
              "No puedes salir de la partida mientras estás jugando",
              top
            );
          }
        });
        $("#homeVisible").on("click", function () {
          if ($("#partido").is(":empty")) {
            cw.mostrarHome();
          } else {
            cw.mostrarToast(
              "No puedes salir de la partida mientras estás jugando",
              top
            );
          }
        });

        $("#crearPartidaVisible").on("click", function () {
          if ($("#partido").is(":empty")) {
            cw.mostrarCrearPartida();
          } else {
            cw.mostrarToast(
              "No puedes salir de la partida mientras estás jugando",
              top
            );
          }
        });

        $("#explorarPartidosVisible").on("click", function () {
          if ($("#partido").is(":empty")) {
            cw.mostrarExplorarPartida();
          } else {
            cw.mostrarToast(
              "No puedes salir de la partida mientras estás jugando",
              top
            );
          }
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

  this.generarPassCode = function (longitud) {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let passCode = "";

    for (let i = 0; i < longitud; i++) {
      const indiceRandom = Math.floor(Math.random() * caracteres.length);
      passCode += caracteres.charAt(indiceRandom);
    }
    console.log("PASSCODE GENERADO", passCode);

    return passCode;
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
            let passCode = cw.generarPassCode(8);
            if (
              email &&
              nombrePartida &&
              cantidadJugadores &&
              (duracion || numGoles) &&
              passCode
            ) {
              $("#mensajeError").empty();
              cw.mostrarInfoPartida(
                email,
                nombrePartida,
                cantidadJugadores,
                duracion,
                numGoles,
                passCode
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
    numGoles,
    passCode
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
                `;

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
      } else if (numGoles != "" && duracion == "") {
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
      } else if (duracion != "" && numGoles == "") {
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
          numGoles,
          passCode
        );
      });
    });
  };

  this.obtenerPartida = function (IDPartida) {
    rest.obtenerPartida(IDPartida, function (partida) {
      socket.emit("obtenerPartidas");
      cw.mostrarPartido(partida);
      const obj = {
        user: $.cookie("nick"),
        partida: partida,
      };
      socket.emit("cantidadJugadores", partida);
      setTimeout(() => {
        socket.emit("mensajeBienvenida", obj);
      }, 5001);
    });
  };

  this.crearInputsUnirse = function (otpContainer, isModal) {
    for (let i = 0; i < 8; i++) {
      const input = document.createElement("input");
      if (isModal) input.id = "otp-modal-" + i;
      else input.id = "otp-" + i;
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
  };

  this.mostrarExplorarPartida = async function () {
    if ($("#explorarPartidas").is(":empty")) {
      cw.limpiarInicio();
      console.log("MOSTRAR EXPLORAR PARTIDA");
      $("#explorarPartidas").load(
        "./cliente/explorarPartidos.html",
        async function () {
          socket.emit("obtenerPartidas");
          console.log("MOSTRAR EXPLORAR PARTIDA");
          $("#explorarPartidas").removeClass("hidden");
          if (document.getElementById("otp-input").innerHTML == "") {
            const otpContainer = document.getElementById("otp-input");
            cw.crearInputsUnirse(otpContainer, false);

            let pegarBoton = document.getElementById("pegarCodigo");
            let icono = document.getElementById("icono");
            let texto = document.getElementById("texto");

            pegarBoton.addEventListener("mouseenter", () => {
              icono.style.opacity = "0";
              pegarBoton.className =
                "absolute -right-4 -top-9 text-white bg-blue-600 font-bold py-1 px-8 rounded-full transition-opacity duration-200 ease-in-out";
              texto.style.opacity = "1";
            });

            pegarBoton.addEventListener("mouseleave", () => {
              icono.style.opacity = "1";
              pegarBoton.className =
                "absolute -right-4 -top-9 text-white bg-blue-500 font-bold py-1 px-2 rounded-full transition-opacity duration-200 ease-in-out";
              texto.style.opacity = "0";
            });

            pegarBoton.addEventListener("click", () => {
              navigator.clipboard
                .readText()
                .then((text) => {
                  const maxLength = Math.min(text.length, 8);

                  for (let i = 0; i < maxLength; i++) {
                    const inputId = `otp-${i}`;
                    const inputElement = document.getElementById(inputId);

                    // Verificar que el input exista
                    if (inputElement) {
                      inputElement.value = text[i];
                    }
                  }
                })
                .catch((err) => {
                  console.error("Failed to read clipboard contents: ", err);
                });
            });
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
              partidasPadre.classList.add("hidden");
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
                  <div class=" overflow-hidden animate__animated animate__slideInRight justify-center items-center flex">
                  <lottie-player src="./cliente/img/lottie/triste.json" background="transparent" speed="1"
                  class="w-24 h-24" loop autoplay></lottie-player>
                </div>
                  <div class="border-t border-gray-200 w-full mt-4" /></div>
                  <p class="m-3">¿Por qué no creas una?</p>
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Crear Partida</button>
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

            partidas = cw.ordenarPartidas(partidas);
            cw.renderizarPartidasOrdenadas(partidas);
          });

          $("#unirsePartidaPassCode").on("click", function () {
            event.preventDefault();
            let passCode = "";
            const inputs = document.querySelectorAll("#otp-input > input");
            inputs.forEach((input) => {
              passCode += input.value;
            });
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              rest.unirsePartida(usr, passCode);
            });
          });

          socket.on("obtenerPartidas", function (partidas) {
            const partidasOrdenadas = cw.ordenarPartidas(partidas);
            cw.renderizarPartidasOrdenadas(partidasOrdenadas);
          });

        }
      );
    }
  };

  this.ordenarPartidas = function (partidas) {
    const ordenEstado = {
      completa: 1,
      esperando: 2,
      //AÑADIR JUGANDO
    };
    const partidasOrdenadas = Object.values(partidas).sort((a, b) => {
      const estadoA = a.estado;
      const estadoB = b.estado;

      const ordena = ordenEstado[estadoA] || Number.MAX_SAFE_INTEGER;
      const ordenb = ordenEstado[estadoB] || Number.MAX_SAFE_INTEGER;

      return ordena - ordenb;
    });
    return partidasOrdenadas;
  };

  this.renderizarPartidasOrdenadas = function (partidas) {
    const partidasPadre = document.getElementById("partidas");
    const noPartidas = document.getElementById("no-partidas");
    if (partidasPadre) partidasPadre.innerHTML = "";
    if (!noPartidas) return;
    for (let clave in partidas) {
      noPartidas.style.display = "none";
      partidasPadre.classList.remove("hidden");
      let partida = partidas[clave];
      console.log("PARTIDA", partida);
      const nuevaPartidaDiv = document.createElement("div");
      nuevaPartidaDiv.id = "part-" + partida.passCode;
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
      } else if (partida.estado === "completa") {
        nuevaPartidaDiv.innerHTML = `
            <div class="flex-1">
                <h3 class="font-semibold text-xl">${partida.nombrePartida}</h3>
                <p class="text-sm">${partida.creador}</p>
            </div>
            <div class="flex items-center bottom-0 justify-between">
                <div class="items-center justify-center flex-row">
                    <div class="flex flex-rol items-center justify-center px-2 py-1 bg-neutral rounded-box text-neutral-content">
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
      nuevaPartidaDiv.addEventListener("click", () => {
        cw.mostrarModalUnirtePartida(partida);
      });
    }
    if(Object.keys(partidas).length == 0){
      noPartidas.style.display = "block";
      partidasPadre.classList.add("hidden");
    }
  };

  this.mostrarModalUnirtePartida = function (partida) {
    const modalUnirse = document.getElementById("modalUnirse");
    const infoUnirse = document.getElementById("infoUnirse");
    infoUnirse.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full mb-4">
        <h1 class="text-2xl text-gray-800 font-bold">Información de la partida</h1>
          <div class="flex items-center bg-gray-200 p-2 mt-6 rounded-lg">
          
            <div class="flex flex-col items-center mr-4">
              <p class="text-sm text-gray-900 font-bold px-8">NOMBRE</p>
              <p class="text-md text-gray-600 tracking-tighter">${partida.nombrePartida}</p>
            </div>
            <div class="flex flex-col items-center mr-4">
              <p class="text-sm text-gray-900 font-bold px-8">JUGADORES</p>
              <p class="text-md text-gray-600 tracking-tighter">${partida.cantidadJugadores}</p>
            </div>
            <div class="flex flex-col items-center">
              <p class="text-sm text-gray-900 font-bold px-8">DURACIÓN</p>
              <p class="text-md text-gray-600 tracking-tighter">${partida.duracion} minutos</p>
            </div>
          </div>

          <div class="mt-3 flex items-center">
            <h2 class="text-lg text-gray-800 font-bold mr-2">Creador:</h2>
            <h2 class="text-md text-gray-600 font-semibold tracking-tighter">${partida.creador}</h2>
          </div>


          <div class="mt-2 flex">
            <h1 class="text-xl text-gray-800 font-bold">Ingresa el código</h1>
            <button id="pegarUCodigo" type="button"
              class="absolute right-16 ml-2 text-white bg-blue-500 font-bold py-1 px-2 rounded-full transition-opacity duration-200 ease-in-out">
                <i id="Uicono" class="fas fa-clone transition-opacity duration-300 ease-in-out"></i>
                <span id="Utexto" class="absolute inset-0 flex items-center justify-center font-semibold text-white opacity-0 transition-opacity duration-100 ease-in-out">Pegar</span>
            </button>
          </div>
          <div class="flex flex-col items-center justify-center w-full mt-1">
            <div id="modal-input" class="flex flex-row justify-center"></div>
          </div>
          <div class="flex flex-col items-center justify-center w-full mt-4">
            <button id="unirsePartidaModalPassCode" class="bg-blue-500 text-white font-bold text-xxs py-1 px-2 rounded-full">Unirse a la partida</button>
          </div>
        </div>
      `;
    const modalInput = document.getElementById("modal-input");
    cw.crearInputsUnirse(modalInput, true);

    let pegarBoton = document.getElementById("pegarUCodigo");
    let icono = document.getElementById("Uicono");
    let texto = document.getElementById("Utexto");

    pegarBoton.addEventListener("mouseenter", () => {
      icono.style.opacity = "0";
      pegarBoton.className =
        "absolute right-16 ml-2 text-white bg-blue-500 font-bold py-1 px-8 rounded-full transition-opacity duration-200 ease-in-out";
      texto.style.opacity = "1";
    });

    pegarBoton.addEventListener("mouseleave", () => {
      icono.style.opacity = "1";
      pegarBoton.className =
        "absolute right-16 ml-2 text-white bg-blue-500 font-bold py-1 px-2 rounded-full transition-opacity duration-200 ease-in-out";
      texto.style.opacity = "0";
    });

    pegarBoton.addEventListener("click", () => {
      navigator.clipboard
        .readText()
        .then((text) => {
          const maxLength = Math.min(text.length, 8);

          for (let i = 0; i < maxLength; i++) {
            const inputId = `otp-modal-${i}`;
            const inputElement = document.getElementById(inputId);

            if (inputElement) {
              inputElement.value = text[i];
            }
          }
        })
        .catch((err) => {
          console.error("Failed to read clipboard contents: ", err);
        });
    });

    $("#unirsePartidaModalPassCode").on("click", function () {
      event.preventDefault();
      let passCode = "";
      const inputs = document.querySelectorAll("#modal-input > input");
      inputs.forEach((input) => {
        passCode += input.value;
      });
      if (passCode == partida.passCode) {
        rest.obtenerUsuario($.cookie("nick"), function (usr) {
          rest.unirsePartida(usr, passCode);
        });
      } else {
        cw.mostrarToast(
          "El código introducido no es correcto",
          "top",
          "right",
          "rgb(255, 59, 48)"
        );
      }
    });

    modalUnirse.showModal();
  };

  this.mostrarPartido = function (partida) {
    console.log("MOSTRAR PARTIDO", partida);
    $("#navbar").addClass("hidden");
    $("#navBarBtn").addClass("hidden");
    $("#container").addClass("hidden");
    $("#partido").removeClass("hidden");

    $("#partido").load("./cliente/juego/partido.html", function () {
      //Inicializar el juego
      cw.mostrarLoadingGame(partida);
      socket.emit("joinRoom", partida.passCode);
      $("#partido").removeClass("hidden");
      $("#GUI").load("./cliente/juego/GUI.html", function () {
        //PASSCODE
        const passCodeDiv = document.getElementById("passCode");
        const passCode = `<h1 class="text-white leading-none tracking-tighter justify-end items-center flex font-bold mt-2 text-2xl mr-2">Código de la partida: <span class="inline-block animate__animated animate__zoomInDown ml-2 text-yellow-500 pointer-events-auto hover:text-yellow-700">${partida.passCode}</span>
        </h1>`;
        passCodeDiv.innerHTML = passCode;

        //SALIR BUTTON
        const salirDiv = document.getElementById("salirDiv");
        const salir = `<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 cursor-pointer pointer-events-auto" id="salirBtn">Salir</button>`;
        salirDiv.innerHTML = salir;

        $("#salirBtn").on("click", function () {
          rest.obtenerUsuario($.cookie("nick"), function (usr) {
            socket.emit("salirPartida", { usr, partida });
            $("#partido").empty()
            $("#navbar").removeClass("hidden");
            $("#navBarBtn").removeClass("hidden");
            $("#container").removeClass("hidden");
            $("#GUI").empty();
            cw.mostrarInicio();

          });
        });

        //ESPERANDO JUGADORES
        socket.on("cantidadJugadores", (partida) => {
          console.log("CANTIDAD JUGADORES CONTROL WEB", partida);
          if (partida.estado === "esperando") {
            const waitingDiv = document.getElementById("waitingDiv");
            const waiting = `<h1 class="text-white">Esperando jugadores... ${partida.jugadoresConectados} / ${partida.cantidadJugadores}</h1>`;
            waitingDiv.innerHTML = waiting;
          } else if (partida.estado === "completa")
            if (waitingDiv.innerHTML != "") {
              waitingDiv.innerHTML = "";
            }
        });
        if (partida.estado === "esperando") {
          const waitingDiv = document.getElementById("waitingDiv");
          const waiting = `<h1 class="text-white">Esperando jugadores... ${partida.jugadoresConectados} / ${partida.cantidadJugadores}</h1>`;
          waitingDiv.innerHTML = waiting;
        }

        //CHAT
        const chatPadre = document.getElementById("chat");

        // Evento que maneja la recepción de mensajes de chat desde el servidor
        socket.on("chatMessage", (message) => {
          const chatMessages = document.getElementById("chatMessages");
          const newMessage = document.createElement("div");
          if (!message.username) {
            newMessage.textContent = `${message}`;
            newMessage.classList.add(
              "text-yellow-500",
              "p-1",
              "rounded-md",
              "mb-1",
              "text-sm"
            );
            newMessage.style.wordWrap = "break-word";
          } else {
            newMessage.textContent = `${message.username}: ${message.message}`;
            newMessage.classList.add(
              "text-white",
              "p-2",
              "rounded-md",
              "mb-1",
              "mr-2",
              "text-sm"
            );
            newMessage.style.wordWrap = "break-word";
          }

          chatMessages.appendChild(newMessage);

          // Scroll hacia abajo para enfocar el último mensaje

          // Mostrar el chat cuando se recibe un nuevo mensaje
          chatPadre.classList.remove("hidden");
          chatMessagesContainer.classList.remove("hidden");
          chatMessages.scrollTop = chatMessages.scrollHeight;
          // Reiniciar el temporizador para ocultar el chat
          clearTimeout(timeoutId);
          // Ocultar el chat después de 5 segundos
          timeoutId = setTimeout(() => {
            // chatMessagesContainer.classList.add('animate__fadeOut');

            setTimeout(() => {
              chatMessagesContainer.classList.add("hidden");
              // chatMessagesContainer.classList.remove('animate__fadeOut');
              chatPadre.classList.add("hidden");
            }, 1000);
          }, 5000);
        });
        // Evento que maneja el envío de mensajes desde el cliente al servidor
        document
          .getElementById("sendMessageButton")
          .addEventListener("click", function () {
            const messageText = document.getElementById("chatInputText").value;

            if (messageText.trim() !== "") {
              // Envía el mensaje al servidor
              socket.emit("sendMessage", {
                passCode: partida.passCode,
                username: $.cookie("nick"),
                message: messageText,
              });

              // Limpiar el campo de entrada después de enviar el mensaje
              document.getElementById("chatInputText").value = "";
            }
          });

        const chatMessagesContainer = document.getElementById("chatMessages");
        let timeoutId;

        //quiero detectar que el raton esté sobre el chat
        chatMessagesContainer.addEventListener("mouseenter", function () {
          clearTimeout(timeoutId);
        });

        chatMessagesContainer.addEventListener("mouseleave", function () {
          clearTimeout(timeoutId);

          timeoutId = setTimeout(() => {
            // chatMessagesContainer.classList.add('animate__fadeOut');

            setTimeout(() => {
              chatMessagesContainer.classList.add("hidden");
              // chatMessagesContainer.classList.remove('animate__fadeOut');
              chatPadre.classList.add("hidden");
            }, 1000);
          }, 5000);
        });

        document
          .getElementById("chatInputText")
          .addEventListener("focus", function () {
            clearTimeout(timeoutId);
            // chatMessagesContainer.classList.remove('animate__fadeOut');
            chatMessagesContainer.classList.remove("hidden");

            chatMessagesContainer.scrollTop =
              chatMessagesContainer.scrollHeight;
          });

        document
          .getElementById("chatInputText")
          .addEventListener("blur", function () {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
              // chatMessagesContainer.classList.add('animate__fadeOut');

              setTimeout(() => {
                chatMessagesContainer.classList.add("hidden");
                // chatMessagesContainer.classList.remove('animate__fadeOut');
                chatPadre.classList.add("hidden");
              }, 1000);
            }, 5000);
          });

        document.addEventListener("keydown", function (event) {
          if (event.key === "Escape") {
            chatPadre.classList.add("hidden");
            chatMessagesContainer.classList.add("hidden");
          }

          if (event.key === "t" || event.key === "T") {
            if (chatPadre.classList.contains("hidden")) {
              event.preventDefault();
              chatPadre.classList.remove("hidden");
              chatMessagesContainer.classList.remove("hidden");
              document.getElementById("chatInputText").focus();
            }
          }
        });

        // ...

        document
          .getElementById("chatInputText")
          .addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
              event.preventDefault(); // Evitar que el Enter realice un salto de línea en el campo de entrada

              const messageText = this.value.trim();

              if (messageText.trim() !== "") {
                // Envía el mensaje al servidor
                socket.emit("sendMessage", {
                  passCode: partida.passCode,
                  username: $.cookie("nick"),
                  message: messageText,
                });

                // Limpiar el campo de entrada después de enviar el mensaje
                document.getElementById("chatInputText").value = "";
              }
            }
          });

        document
          .getElementById("closeChat")
          .addEventListener("click", function () {
            chatPadre.classList.add("hidden");
            chatMessagesContainer.classList.add("hidden");
          });

        //ELEGIR EQUIPO
        const checkboxB = document.getElementById("checkbTeam");
        const checkJoinB = document.getElementById("checkbJoin");
        const veriCheckB = document.getElementById("veribCheck");
        const checkboxR = document.getElementById("checkrTeam");
        const checkJoinR = document.getElementById("checkrJoin");
        const veriCheckR = document.getElementById("verirCheck");

        checkboxB.addEventListener("change", function () {
          if (checkboxB.checked) {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              window.juego.addPlayer(partida.passCode, usr, "equipoAzul");
              socket.emit("unirseAEquipo", {
                partida: partida,
                usr: usr,
                equipo: "equipoAzul",
              });
            });

            checkboxR.disabled = true;
            veriCheckR.innerHTML = `<ion-icon name="close-outline" class="text-4xl text-gray-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            checkJoinB.classList.remove("hidden");
            checkboxB.disabled = true;
            setTimeout(() => {
              checkJoinB.classList.add("hidden");
              checkboxB.disabled = false;
              veriCheckB.innerHTML = `<ion-icon name="checkmark-outline" class="text-4xl text-blue-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            }, 2500);
          } else {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              window.juego.removePlayer(usr, "equipoAzul");
              socket.emit("salirEquipo", {
                partida: partida,
                usr: usr,
                equipo: "equipoAzul",
              });
            });
            checkboxR.disabled = false;
            veriCheckR.innerHTML = ``;
            veriCheckB.innerHTML = ``;
          }
        });

        checkboxR.addEventListener("change", function () {
          if (checkboxR.checked) {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              window.juego.addPlayer(partida.passCode, usr, "equipoRojo");
              socket.emit("unirseAEquipo", {
                partida: partida,
                usr: usr,
                equipo: "equipoRojo",
              });
            });
            checkboxB.disabled = true;
            veriCheckB.innerHTML = `<ion-icon name="close-outline" class="text-4xl text-gray-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            checkJoinR.classList.remove("hidden");
            checkboxR.disabled = true;
            setTimeout(() => {
              checkJoinR.classList.add("hidden");
              checkboxR.disabled = false;
              veriCheckR.innerHTML = `<ion-icon name="checkmark-outline" class="text-4xl text-red-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            }, 2500);
          } else {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              window.juego.removePlayer(usr, "equipoRojo");
              socket.emit("salirEquipo", {
                partida: partida,
                usr: usr,
                equipo: "equipoRojo",
              });
            });
            checkboxB.disabled = false;
            veriCheckB.innerHTML = ``;
            veriCheckR.innerHTML = ``;
          }
        });

        socket.on("actualizarContadorEquipo", function (obj) {
          partida = obj;
          if(!obj) return;
          if (obj.equipos["equipoAzul"]) {
            const cantidadBlue = document.getElementById("cantidadBlue");
            cantidadBlue.innerHTML =
              "Jugadores: " +
              Object.values(obj.equipos["equipoAzul"].jugadores).length;
          }
          if (obj.equipos["equipoRojo"]) {
            const cantidadRed = document.getElementById("cantidadRed");
            cantidadRed.innerHTML =
              "Jugadores: " +
              Object.values(obj.equipos["equipoRojo"].jugadores).length;
          }
        });

        socket.on("playerCreado", function (obj) {
          console.log("PLAYER CREADOWEBBBBBBBBBB", obj);
          window.juego.addOtherPlayer(obj.player, obj.equipo, obj.position);
        });
      });
    });
  };

  this.mostrarLoadingGame = function (partida) {
    console.log("MOSTARARLOADING");
    $("#loading").load("./cliente/juego/loading.html", function () {
      setTimeout(function () {
        $("#loading").addClass("animate__fadeOut");
        setTimeout(function () {
          $("#loading").addClass("hidden");
        }, 1000);
      }, 5000);
    });
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
