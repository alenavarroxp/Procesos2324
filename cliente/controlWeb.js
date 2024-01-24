function ControlWeb(playwright) {
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
        // "726975145917-reol4tr88j6m8a0mqehb0k6sop45mto2.apps.googleusercontent.com", //local
      "726975145917-rae33a02hgmi3pjid1dh2dq334igsvqr.apps.googleusercontent.com", //prod
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
  if (playwright) {
    captchaValidado = true;
  }

  this.mostrarRegistro = function () {
    $("#fmInicioSesion").remove();
    $("#registro").load("./cliente/registro.html", function () {
      // Configurar el evento change para el input file
      $("#photoReg").on("change", function (e) {
        const imagen = $("#imgUsuarioReg");
        const existingImage = $("#imagenPerfil");

        const file = e.target.files[0];
        const reader = new FileReader();
        cw.cambiarFotoPerfil(imagen, existingImage, file, reader);

        // Limpiar el valor actual del input file
        $("#photoReg").val("");
      });

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
        let photo = $("#imagenPerfil").attr("src");
        console.log("PHOTO", photo);
        let pwd = $("#pwd").val();

        if (nick && email && pwd) {
          $("#mensajeError").empty();
          try {
            if (captchaValidado) {
              rest.obtenerUsuarioBD(email, function (obj) {
                console.log("USREMAIL", obj.email);
                if (obj.email != undefined) {
                  cw.mostrarMsg("Ya existe un usuario con ese email");
                  return;
                }
                rest.registrarUsuario(nick, email, pwd, photo);
                if (!playwright) {
                  captchaValidado = false;
                } else {
                  captchaValidado = true;
                }
              });
            } else {
              cw.mostrarMsg("Verifica el captcha");
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

  this.cambiarFotoPerfil = function (imagen, existingImage, file, reader) {
    console.log("cambio de foto de perfil");
    reader.onload = function (e) {
      // Si ya hay una imagen, la reemplazamos; de lo contrario, creamos una nueva
      if (existingImage.length) {
        console.log("EXISTE IMAGEN");
        existingImage.attr({
          src: e.target.result,
          alt: "Foto de perfil",
        });
      } else {
        console.log("NO EXISTE IMAGEN");
        const imgElement = $("<img id='imagenPerfil'>")
          .attr({
            src: e.target.result,
            alt: "Foto de perfil",
          })
          .addClass(
            "w-28 h-28 bg-gray-400 rounded-full mb-2 cursor-pointer pointer-events-auto"
          )
          .on("click", function () {
            // Al hacer clic en la imagen, activamos el input file
            $("#photoReg").val(""); // Limpiamos el valor actual del input file
            $("#photoReg").click();
          });

        imagen.append(imgElement);
      }
      $("#noImage").addClass("hidden");
    };
    reader.readAsDataURL(file);
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
      $("#navbar").load("./cliente/navbar.html", async function () {
        await rest.obtenerUsuario($.cookie("nick"), function (usr) {
          console.log("usr", usr);
          $("#username").text(usr.nick);
          if (usr.photo) {
            $("#imgUsuario").removeClass("hidden");
            $("#noPhoto").addClass("hidden");
            $("#imgUsuario").attr("src", usr.photo);
          } else {
            $("#imgUsuario").addClass("hidden");
            $("#noPhoto").removeClass("hidden");
          }
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

        $("#editProfile").on("click", function () {
          cw.mostrarEditarPerfil();
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

  this.mostrarEditarPerfil = function () {
    $("#home").empty();
    $("#crearPartida").empty();
    $("#explorarPartidas").empty();
    if ($("#editarPerfil").is(":empty"))
      $("#editarPerfil").load("./cliente/editProfile.html", function () {
        const imagen = $("#imgUsuario");
        $("#photoReg").on("change", function (e) {
          const actualProfile = $("#actualProfile");
          const existingImage = $("#imagenPerfil");

          const file = e.target.files[0];
          const reader = new FileReader();
          cw.cambiarFotoPerfil(actualProfile, existingImage, file, reader);

          const actualImage = document.getElementById("actualImage");
          actualImage.classList.add("hidden");

          // Limpiar el valor actual del input file
          $("#photoReg").val("");
        });
        rest.obtenerUsuario($.cookie("nick"), function (usr) {
          const actualImage = document.getElementById("actualImage");

          if (usr.clave) {
            const noOAuth = document.getElementById("noOAuth");

            // HTML que quieres agregar
            const passwordElement = `
    <!-- Contraseña actual -->
    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600">Contraseña actual (*)</label>
        <input type="password" id="currentPassword" name="currentPassword" class="mt-1 p-2 border rounded-md w-full" />
    </div>

    <!-- Nueva Contraseña -->
    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600">Contraseña</label>
        <input type="password" id="passwordInput" name="password" class="mt-1 p-2 border rounded-md w-full" />
    </div>

    <!-- Repetir contraseña -->
    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600">Repetir contraseña</label>
        <input type="password" id="passwordRepeat" name="passwordRepeat" class="mt-1 p-2 border rounded-md w-full" />
    </div>

    <!-- Correo electrónico -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600">Correo electrónico</label>
                <input type="email" id="emailInput" name="email" class="mt-1 p-2 border rounded-md w-full" />
            </div>
`;

            // Agregar el HTML al elemento con id "noOAuth"
            noOAuth.innerHTML = passwordElement;
          }
          if (usr.photo) {
            const imgElement = document.createElement("img");
            imgElement.src = usr.photo;
            imgElement.alt = "Foto de perfil";
            imgElement.classList.add("w-28", "h-28", "rounded-full", "mb-2");
            actualImage.appendChild(imgElement);
          } else {
            const divElement = document.createElement("div");
            divElement.classList.add(
              "relative",
              "mb-1",
              "inline-flex",
              "items-center",
              "justify-center",
              "w-28",
              "h-28",
              "bg-gray-200",
              "rounded-full",
              "dark:bg-gray-800"
            );

            const iElement = document.createElement("i");
            iElement.classList.add(
              "fas",
              "fa-user",
              "text-4xl",
              "relative",
              "z-10"
            );

            divElement.appendChild(iElement);
            actualImage.appendChild(divElement);
          }

          console.log("USUARIO", usr);
          $("#usernameInput").attr("placeholder", usr.nick);
          $("#emailInput").attr("placeholder", usr.email);
        });

        $("#saveChanges").on("click", function (e) {
          e.preventDefault();
          const username = $("#usernameInput").val();
          const email = $("#emailInput").val();
          const photo = $("#imagenPerfil").attr("src");
          const password = $("#passwordInput").val();
          const confirmPassword = $("#passwordRepeat").val();
          const currentPassword = $("#currentPassword").val();

          if (email) {
            if (!cw.validarEmail(email)) {
              cw.mostrarMsg("Introduce un email válido");
              return;
            }
          }

          if (password !== confirmPassword) {
            cw.mostrarMsg("Las contraseñas no coinciden");
            return;
          } else {
            $("#mensajeError").empty();
          }

          if (username || email || photo || password || currentPassword) {
            $("#mensajeError").empty();
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              if (username) usr.newNick = username;
              if (email) usr.newEmail = email;
              if (photo) usr.newPhoto = photo;
              if (password) usr.newPassword = password;
              console.log("USR", usr);
              usr.password = currentPassword;
              if (email) {
                rest.obtenerUsuarioBD(email, function (obj) {
                  console.log("USREMAIL", obj.email);
                  if (obj.email != undefined) {
                    cw.mostrarMsg("Ya existe un usuario con ese email");
                    return;
                  }
                  rest.actualizarUsuario(usr);
                });
              } else {
                rest.actualizarUsuario(usr);
              }
            });
          } else {
            cw.mostrarMsg("Introduce al menos un campo");
          }
        });
      });
  };

  this.actualizarNavbar = function () {
    console.log("ACTUALIZAR NAVBAR");
    rest.obtenerUsuario($.cookie("nick"), function (usr) {
      console.log("USR", usr);
      console.log("USR", usr);
      if (usr.photo) {
        $("#imgUsuario").attr("src", usr.photo);
      } else {
        $("#imgUsuario").addClass("hidden");
        $("#noPhoto").removeClass("hidden");
      }

      $("#username").text(usr.nick);
      $("#emailValue").text(usr.email);
    });
  };

  this.mostrarHome = function () {
    if ($("#home").is(":empty")) {
      cw.limpiarInicio();
      $("#home").load("./cliente/home.html", function () {
        $("#home").removeClass("hidden");
        const diffComponent = document.getElementById("diffComponent");
        const crearPartidaDiff = document.getElementById("CrearPartidaDiff");
        const explorarPartidasDiff = document.getElementById(
          "ExplorarPartidaDiff"
        );
        crearPartidaDiff.addEventListener("click", () => {
          diffComponent.classList.remove("animate__slideInDown");
          diffComponent.classList.add("animate__slideOutUp");
          setTimeout(() => {
            cw.mostrarCrearPartida();
          }, 850);
        });
        explorarPartidasDiff.addEventListener("click", () => {
          diffComponent.classList.remove("animate__slideInDown");
          diffComponent.classList.add("animate__slideOutUp");
          setTimeout(() => {
            cw.mostrarExplorarPartida();
          }, 850);
        });
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
      rest.obtenerUsuario($.cookie("nick"), function (usr) {
        const obj = {
          user: usr,
          partida: partida,
        };
        socket.emit("cantidadJugadores", partida);
        setTimeout(() => {
          socket.emit("mensajeBienvenida", obj);
        }, 5001);
      });
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
      jugando: 3,
      finalizada: 4,
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
    console.log("PARTIDAS RENDEREIZAR PARTIDAS ORDENADAS", partidas);
    for (let clave in partidas) {
      noPartidas.style.display = "none";
      partidasPadre.classList.remove("hidden");
      let partida = partidas[clave];
      console.log("PARTIDA", partida);
      const nuevaPartidaDiv = document.createElement("div");
      nuevaPartidaDiv.id = "part-" + partida.passCode;
      nuevaPartidaDiv.className =
        "border rounded-xl p-2 m-2 flex-col flex cursor-pointer shadow-md min-w-max h-40";

      if (partida.estado.estado === "esperando") {
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
      } else if (partida.estado.estado === "completa") {
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
      } else if (partida.estado.estado === "jugando") {
        nuevaPartidaDiv.innerHTML = `
            <div class="flex-1">
                <h3 class="font-semibold text-xl">${partida.nombrePartida}</h3>
                <p class="text-sm">${partida.creador}</p>
            </div>
            <div class="flex items-center bottom-0 justify-between">
                <div class="items-center justify-center flex-row">
                    <div class="flex flex-rol items-center justify-center px-2 py-1 bg-neutral rounded-box text-neutral-content">
                        <span class="relative flex h-3 w-3 m-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span class="countdown font-mono text-2xl">
                            <span style="--value:${partida.duracion};"></span> :
                            <span style="--value:00;"></span>
                        </span>
                    </div>
                </div>`;
      } else if (partida.estado.estado === "finalizada") {
        nuevaPartidaDiv.innerHTML = `
                    <div class="flex-1">
                        <h3 class="font-semibold text-xl"><span class="font-bold">FINALIZADA</span> ${partida.nombrePartida}</h3>
                        <p class="text-sm">${partida.creador}</p>
                    </div>
                    <div>
                        <div>
                            <p class="text-xl font-bold text-blue-500">Equipo Azul: <span class="text-black text-2xl">${partida.equipos["equipoAzul"].goles}</span></p>
                        </div>
                        <div>
                            <p class="text-xl font-bold text-red-500">Equipo Rojo: <span class="text-black text-2xl">${partida.equipos["equipoRojo"].goles}</span></p>
                        </div>
                    </div>
                `;
      }

      // Agregar el nuevo div al contenedor de partidas
      partidasPadre.appendChild(nuevaPartidaDiv);
      nuevaPartidaDiv.addEventListener("click", () => {
        if (partida.estado.estado === "esperando")
          cw.mostrarModalUnirtePartida(partida);
      });
    }
    if (Object.keys(partidas).length == 0) {
      console.log("NO HAY PARTIDAS");
      partidasPadre.classList.add("hidden");
      const noPartidasDiv = document.getElementById("no-partidas")
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

      noPartidas.style.display = "block";
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
          modalUnirse.close();
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
  this.removeBabylonScripts = function () {
    var babylonScript = document.querySelector(
      'script[src="https://cdnjs.cloudflare.com/ajax/libs/babylonjs/6.36.1/babylon.js"]'
    );
    var loadersScript = document.querySelector(
      'script[src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"]'
    );

    if (babylonScript && loadersScript) {
      babylonScript.parentNode.removeChild(babylonScript);
      loadersScript.parentNode.removeChild(loadersScript);
    }
  };

  this.formatTime = function (minutes, seconds) {
    if (seconds !== undefined) {
      // Si seconds está definido
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return `${minutes}:${seconds}`;
    } else {
      // Si seconds no está definido, se asume como 0
      return `${minutes}:00`;
    }
  };

  this.contador = function (contadorTiempo, partida, email) {
    socket.emit("contadorServidor", { partida: partida, email: email });

    socket.on("contadorCliente", (obj) => {
      if (email == obj.email) {
        let tiempoFormateado = cw.formatTime(obj.minutes, obj.seconds);
        contadorTiempo.textContent = tiempoFormateado;
        contadorTiempo.className = "text-3xl font-bold animate__animated";
        if (
          obj.color == "red" &&
          (obj.seconds == 10 || obj.seconds == 5 || obj.seconds == 0)
        ) {
          contadorTiempo.className =
            "text-3xl font-bold animate__animated animate__heartBeat";
        }

        contadorTiempo.style.color = obj.color;
        if (obj.minutes == 0 && obj.seconds == 0) {
          rest.obtenerPartida(partida.id, function (partida) {
            socket.emit("partidaFinalizada", {
              partida: partida,
              email: email,
              abandono: false,
            });
          });
        }
      }
    });
  };

  this.mostrarPartido = function (partida) {
    console.log("MOSTRAR PARTIDO", partida);
    $("#navbar").addClass("hidden");
    $("#navBarBtn").addClass("hidden");
    $("#container").addClass("hidden");
    $("#partido").removeClass("hidden");

    $("#partido").load("./cliente/juego/partido.html", function () {
      const user = $.cookie("nick");
      setTimeout(() => {
        if (window.juego) window.juego.setPassCode(partida.passCode);
        console.log("WINDOW JUEGO", window.juego);
      }, 2500);

      window.addEventListener("beforeunload", async function (e) {
        e.preventDefault();
        if (e.eventPhase == 2) {
          rest.obtenerUsuario($.cookie("nick"), function (usr) {
            socket.emit("salirPartida", { usr, partida });
            socket.emit("actualizarJugadoresReady", { partida });
            $("#partido").empty();
            $("#navbar").removeClass("hidden");
            $("#navBarBtn").removeClass("hidden");
            $("#container").removeClass("hidden");
            $("#GUI").empty();
            const equipo = cw.getEquipoUsuario(usr, partida);
            window.juego.removePlayer(partida.passCode, usr, equipo);
            cw.mostrarInicio();
          });
        }
      });

      window.addEventListener("mouseout", function (event) {
        // Verificar si el puntero del ratón está fuera de la ventana
        if (
          event.clientY <= 0 ||
          event.clientY >= window.innerHeight ||
          event.clientX <= 0 ||
          event.clientX >= window.innerWidth
        ) {
          // Redirigir el puntero del ratón de nuevo a la ventana
          window.moveTo(event.clientX, event.clientY);
        }
      });

      //Inicializar el juego
      cw.mostrarLoadingGame(partida);
      socket.emit("joinRoom", partida.passCode);
      $("#partido").removeClass("hidden");
      $("#GUI").load("./cliente/juego/GUI.html", function () {
        socket.emit("actualizarContadorEquipo", partida);

        //CONTADOR
        const contadorTiempo = document.getElementById("contadorTiempo");
        console.log();
        contadorTiempo.textContent = cw.formatTime(partida.duracion);
        //PASSCODE
        const passCodeDiv = document.getElementById("passCode");
        const passCode = `<h1 class="text-white leading-none tracking-tighter justify-end items-center flex font-bold mt-2 text-2xl mr-2">Código de la partida: <span id="codeGame" class="inline-block animate__animated animate__zoomInDown ml-2 text-yellow-500 pointer-events-auto hover:text-yellow-700">${partida.passCode}</span>
        </h1>`;
        passCodeDiv.innerHTML = passCode;

        //SALIR BUTTON
        const salirDiv = document.getElementById("salirDiv");
        const salir = `<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 cursor-pointer pointer-events-auto" id="salirBtn">Salir</button>`;
        salirDiv.innerHTML = salir;

        $("#salirBtn").on("click", function () {
          cw.removeBabylonScripts();
          rest.obtenerUsuario($.cookie("nick"), function (usr) {
            if (usr.email == $.cookie("nick")) {
              socket.emit("salirPartida", { usr, partida });
            }
            socket.emit("actualizarJugadoresReady", { partida });
            $("#partido").empty();
            $("#navbar").removeClass("hidden");
            $("#navBarBtn").removeClass("hidden");
            $("#container").removeClass("hidden");
            $("#GUI").empty();
            cw.mostrarInicio();
            const equipo = cw.getEquipoUsuario(usr, partida);
            window.juego.removePlayer(partida.passCode, usr, equipo);
            location.reload(true);
          });
        });

        //ESPERANDO JUGADORES
        socket.on("cantidadJugadores", (partida) => {
          console.log("CANTIDAD JUGADORES CONTROL WEB", partida);
          const waitingDiv = document.getElementById("waitingDiv");
          if (partida.estado === "esperando") {
            const waiting = `<h1 class="text-white">Esperando jugadores... ${partida.jugadoresConectados} / ${partida.cantidadJugadores}</h1>`;
            if (waitingDiv) waitingDiv.innerHTML = waiting;
          } else if (partida.estado.estado === "completa")
            if (waitingDiv.innerHTML != "") {
              waitingDiv.innerHTML = "";
            }

          if (partida.estado.estado === "jugando") {
            const numJugadoresAzul = Object.values(
              partida.equipos["equipoAzul"].jugadores
            ).length;
            const numJugadoresRojo = Object.values(
              partida.equipos["equipoRojo"].jugadores
            ).length;

            if (numJugadoresAzul == 0 || numJugadoresRojo == 0) {
              rest.obtenerUsuario($.cookie("nick"), function (usr) {
                socket.emit("partidaFinalizada", {
                  partida: partida,
                  email: usr.email,
                  abandono: true,
                });
              });
            }
          }
        });
        if (partida.estado.estado === "esperando") {
          const waitingDiv = document.getElementById("waitingDiv");
          console.log("waitingDiv ", waitingDiv);
          const waiting = `<h1 class="text-white">Esperando jugadores... ${partida.jugadoresConectados} / ${partida.cantidadJugadores}</h1>`;
          waitingDiv.innerHTML = waiting;
        }

        //CHAT
        const chatPadre = document.getElementById("chat");

        // Evento que maneja la recepción de mensajes de chat desde el servidor
        socket.on("chatMessage", (message) => {
          console.log("CHAT MESSAGE", message);
          const chatMessages = document.getElementById("chatMessages");
          const newMessage = document.createElement("div");
          if (!message.user) {
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
            const photoChat = document.createElement("div");
            if (message.user.photo) {
              photoChat.innerHTML = `<div class="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center"><img src="${message.user.photo}" class="w-8 h-8 rounded-full"></div>`;
            } else {
              photoChat.innerHTML = `<div class="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center"><i id="noPhoto" class="fas fa-user text-black text-xl relative z-10"></i></div>`;
            }
            newMessage.appendChild(photoChat);
            newMessage.classList.add(
              "text-white",
              "p-2",
              "rounded-md",
              "mb-1",
              "mr-2",
              "text-sm",
              "flex",
              "items-center"
            );
            // Contenedor para el texto del mensaje
            const messageContainer = document.createElement("div");
            messageContainer.style.overflowWrap = "break-word";
            messageContainer.style.maxWidth = "93.5%";
            messageContainer.style.flexShrink = 1; // Permitir que el texto se reduzca en lugar de expandirse

            // Contenido del mensaje
            const textMessage = document.createElement("div");
            textMessage.textContent = `${message.user.nick}: ${message.message}`;
            textMessage.style.overflow = "hidden";

            // Agregar elementos al DOM
            messageContainer.appendChild(textMessage);
            newMessage.appendChild(messageContainer);
          }
          if (chatMessages) {
            chatMessages.appendChild(newMessage);
            chatPadre.classList.remove("hidden");
            chatMessagesContainer.classList.remove("hidden");
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }

          // Reiniciar el temporizador para ocultar el chat
          clearTimeout(timeoutId);
          // Ocultar el chat después de 5 segundos
          timeoutId = setTimeout(() => {
            setTimeout(() => {
              chatMessagesContainer.classList.add("hidden");
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
              rest.obtenerUsuario($.cookie("nick"), function (usr) {
                socket.emit("sendMessage", {
                  passCode: partida.passCode,
                  user: usr,
                  message: messageText,
                });
              });

              // Limpiar el campo de entrada después de enviar el mensaje
              document.getElementById("chatInputText").value = "";
            }
          });

        const chatMessagesContainer = document.getElementById("chatMessages");
        const chatInputText = document.getElementById("chatInputText");
        let timeoutId;

        chatInputText.addEventListener("input", function () {
          clearTimeout(timeoutId);
        });

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
                rest.obtenerUsuario($.cookie("nick"), function (usr) {
                  socket.emit("sendMessage", {
                    passCode: partida.passCode,
                    user: usr,
                    message: messageText,
                  });
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
        const startButton = document.getElementById("startButton");

        checkboxB.addEventListener("change", function () {
          if (checkboxB.checked) {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              if (window.juego)
                window.juego.addPlayer(partida.passCode, usr, "equipoAzul");
              socket.emit("unirseAEquipo", {
                partida: partida,
                usr: usr,
                equipo: "equipoAzul",
              });
            });
            startButton.disabled = true;
            checkboxR.disabled = true;
            veriCheckR.innerHTML = `<ion-icon name="close-outline" class="text-4xl text-gray-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            checkJoinB.classList.remove("hidden");
            checkboxB.disabled = true;
            setTimeout(() => {
              checkJoinB.classList.add("hidden");
              checkboxB.disabled = false;
              startButton.disabled = false;
              veriCheckB.innerHTML = `<ion-icon name="checkmark-outline" class="text-4xl text-blue-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            }, 2500);
          } else {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              window.juego.removePlayer(partida.passCode, usr, "equipoAzul");
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
              if (window.juego)
                window.juego.addPlayer(partida.passCode, usr, "equipoRojo");
              socket.emit("unirseAEquipo", {
                partida: partida,
                usr: usr,
                equipo: "equipoRojo",
              });
            });
            startButton.disabled = true;
            checkboxB.disabled = true;
            veriCheckB.innerHTML = `<ion-icon name="close-outline" class="text-4xl text-gray-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            checkJoinR.classList.remove("hidden");
            checkboxR.disabled = true;
            setTimeout(() => {
              checkJoinR.classList.add("hidden");
              checkboxR.disabled = false;
              startButton.disabled = false;
              veriCheckR.innerHTML = `<ion-icon name="checkmark-outline" class="text-4xl text-red-500 animate__animated animate__jackInTheBox"></ion-icon>`;
            }, 2500);
          } else {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              window.juego.removePlayer(partida.passCode, usr, "equipoRojo");
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

        socket.on("actualizarJugadoresReady", function (obj) {
          console.log("ACTUALIZAR JUGADORES READY", obj);
          const jugadoresReady = document.getElementById("jugadoresReady");
          console.log("JUGADORES READY", jugadoresReady);
          if (jugadoresReady) jugadoresReady.innerHTML = "";

          const veribCheck = document.getElementById("veribCheck");
          const verirCheck = document.getElementById("verirCheck");
          const checkbTeam = document.getElementById("checkbTeam");
          const checkrTeam = document.getElementById("checkrTeam");
          const startButton = document.getElementById("startButton");
          const startText = document.getElementById("startText");
          const spin = document.getElementById("spin");

          if (veriCheckB && veriCheckR && checkbTeam && checkrTeam) {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              console.log("obj", obj.partida.equipos);
              console.log("usr", usr);
              if (
                !obj.partida.equipos["equipoAzul"].jugadores[usr.nick] &&
                !obj.partida.equipos["equipoRojo"].jugadores[usr.nick]
              ) {
                veribCheck.innerHTML = ``;
                verirCheck.innerHTML = ``;
                veribCheck.classList.replace("left-3", "left-2");
                verirCheck.classList.replace("left-3", "left-2");
                checkbTeam.disabled = false;
                checkbTeam.checked = false;
                checkrTeam.disabled = false;
                checkrTeam.checked = false;

                if (startText) {
                  startButton.disabled = false;
                  startText.textContent = "EMPEZAR";
                }
                //Eliminar el spinner
                if (spin) spin.parentNode.removeChild(spin);
              }

              const lockB = document.getElementById("lockB");
              const lockR = document.getElementById("lockR");
              console.log("lockB", lockB);
              console.log("lockR", lockR);
              if (lockB && lockR) {
                if (obj.partida.equipos["equipoAzul"].jugadores[usr.nick]) {
                  veribCheck.innerHTML = `<ion-icon name="checkmark-outline" class="text-4xl text-blue-500 animate__animated animate__jackInTheBox"></ion-icon>`;
                  checkbTeam.disabled = false;
                  checkbTeam.checked = true;
                  veribCheck.classList.replace("left-3", "left-2");
                  veriCheckR.innerHTML = `<ion-icon name="close-outline" class="text-4xl text-gray-500 animate__animated animate__jackInTheBox md hydrated" role="img"></ion-icon>`;
                  checkrTeam.disabled = true;
                  checkrTeam.checked = false;
                  verirCheck.classList.replace("left-3", "left-2");
                } else if (
                  obj.partida.equipos["equipoRojo"].jugadores[usr.nick]
                ) {
                  verirCheck.innerHTML = `<ion-icon name="checkmark-outline" class="text-4xl text-red-500 animate__animated animate__jackInTheBox"></ion-icon>`;
                  checkrTeam.disabled = false;
                  checkrTeam.checked = true;
                  verirCheck.classList.replace("left-3", "left-2");
                  veriCheckB.innerHTML = `<ion-icon name="close-outline" class="text-4xl text-gray-500 animate__animated animate__jackInTheBox md hydrated" role="img"></ion-icon>`;
                  checkbTeam.disabled = true;
                  checkbTeam.checked = false;
                  veribCheck.classList.replace("left-3", "left-2");
                } else {
                  veribCheck.innerHTML = ``;
                  verirCheck.innerHTML = ``;
                  veribCheck.classList.replace("left-3", "left-2");
                  verirCheck.classList.replace("left-3", "left-2");
                  checkbTeam.disabled = false;
                  checkbTeam.checked = false;
                  checkrTeam.disabled = false;
                  checkrTeam.checked = false;
                }
                if (startText) {
                  startButton.disabled = false;
                  startText.textContent = "EMPEZAR";
                }
                if (spin) spin.parentNode.removeChild(spin);
              }
            });
          }
        });

        socket.on("actualizarContadorEquipo", function (obj) {
          console.log("ACTUALIZAR CONTADOR EQUIPO", obj);
          partida = obj;
          if (!obj) return;
          if (obj.equipos["equipoAzul"]) {
            const cantidadBlue = document.getElementById("cantidadBlue");
            const bluePlayers = document.getElementById("bluePlayers");
            console.log("cantidadBlueDiv", cantidadBlue);
            if (cantidadBlue && bluePlayers) {
              cantidadBlue.innerHTML =
                "Jugadores: " +
                Object.values(obj.equipos["equipoAzul"].jugadores).length;

              const bluePlayersContainer = document.createElement("div");
              bluePlayersContainer.className =
                "avatar-group -space-x-4 rtl:space-x-reverse";

              for (let i in obj.equipos["equipoAzul"].jugadores) {
                const jugador = obj.equipos["equipoAzul"].jugadores[i];
                const jugadorDiv = document.createElement("div");
                jugadorDiv.className = "avatar";

                const avatarContainer = document.createElement("div");
                avatarContainer.className =
                  "w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center";

                if (jugador.photo) {
                  const avatarImage = document.createElement("img");
                  avatarImage.src = jugador.photo;
                  avatarContainer.appendChild(avatarImage);
                } else {
                  const avatarImage = document.createElement("i");
                  avatarImage.className = "fas fa-user text-2xl relative";
                  avatarContainer.appendChild(avatarImage);
                }

                jugadorDiv.appendChild(avatarContainer);
                bluePlayersContainer.appendChild(jugadorDiv);
              }

              bluePlayers.innerHTML = "";
              bluePlayers.appendChild(bluePlayersContainer);
            }
          }
          if (obj.equipos["equipoRojo"]) {
            const cantidadRed = document.getElementById("cantidadRed");
            const redPlayers = document.getElementById("redPlayers");
            if (cantidadRed && redPlayers) {
              cantidadRed.innerHTML =
                "Jugadores: " +
                Object.values(obj.equipos["equipoRojo"].jugadores).length;

              const redPlayersContainer = document.createElement("div");
              redPlayersContainer.className =
                "avatar-group -space-x-4 rtl:space-x-reverse";

              for (let i in obj.equipos["equipoRojo"].jugadores) {
                const jugador = obj.equipos["equipoRojo"].jugadores[i];
                const jugadorDiv = document.createElement("div");
                jugadorDiv.className = "avatar";

                const avatarContainer = document.createElement("div");
                avatarContainer.className =
                  "w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center";

                if (jugador.photo) {
                  const avatarImage = document.createElement("img");
                  avatarImage.src = jugador.photo;
                  avatarContainer.appendChild(avatarImage);
                } else {
                  const avatarImage = document.createElement("i");
                  avatarImage.className = "fas fa-user text-2xl relative";
                  avatarContainer.appendChild(avatarImage);
                }

                jugadorDiv.appendChild(avatarContainer);
                redPlayersContainer.appendChild(jugadorDiv);
              }

              redPlayers.innerHTML = "";
              redPlayers.appendChild(redPlayersContainer);
            }
          }

          let jugadoresEnEquipos = 0;

          for (let i in obj.equipos) {
            jugadoresEnEquipos += Object.values(
              obj.equipos[i].jugadores
            ).length;
          }
          console.log("JUGADORES EN EQUIPOS", jugadoresEnEquipos);

          let startButton = document.getElementById("startButton");
          if (!startButton) return;
          if (jugadoresEnEquipos == obj.cantidadJugadores) {
            startButton.classList.remove("hidden");
          } else {
            startButton.classList.add("hidden");
          }
        });
        startButton.addEventListener("click", function () {
          //QUiero mostrar un modal, que tenga un boton de cancelar y otro de empezar pero solo si algun equipo tiene 0 jugadores
          //Si no, que se empiece directamente
          if (
            Object.values(partida.equipos["equipoAzul"].jugadores).length ==
              0 ||
            Object.values(partida.equipos["equipoRojo"].jugadores).length == 0
          ) {
            //Mostrar modal pero de advertencia de que hay un equipo sin jugadores
            const modal = document.getElementById("modalStart");
            const info = document.getElementById("infoStart");
            const warningMessageDiv = document.createElement("div");
            // Y en este warningMessage, quiero meter un mensaje de que hay un equipo sin jugadores
            const warningMessage = `<div class="flex flex-col items-center justify-center w-full mt-2">
            <h1 class="text-2xl text-gray-800 font-bold">⚠️ ¡Advertencia! ⚠️</h1>
            <p class="text-gray-700 text-center mt-2">Hay un equipo sin jugadores, la partida no puede comenzar.</p>
            <button id="cancelarBtn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 cursor-pointer pointer-events-auto">Cancelar</button>
            </div>`;
            warningMessageDiv.innerHTML = warningMessage;
            info.appendChild(warningMessageDiv);

            modal.showModal();
            document
              .getElementById("cancelarBtn")
              .addEventListener("click", function () {
                modal.close();
                setTimeout(() => {
                  info.innerHTML = "";
                }, 500);
              });
          } else {
            rest.obtenerUsuario($.cookie("nick"), function (usr) {
              const modal = document.getElementById("modalStart");
              console.log("MODAL", modal);
              const isOpen = modal.open;
              socket.emit("jugadorReady", {
                usr: usr,
                partida: partida,
                isOpen: isOpen,
              });

              const startButton = document.getElementById("startButton");
              startButton.disabled = true;
              startButton.innerHTML = `<div class="flex flex-row items-center justify-center">
              <p id="startText" class="text-white">Esperando</p>
              <div id="spin" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2 mr-1"></div>
              </div>`;

              const checkBlue = document.getElementById("checkbTeam");
              const checkRed = document.getElementById("checkrTeam");
              checkBlue.disabled = true;
              checkRed.disabled = true;

              const veribCheck = document.getElementById("veribCheck");
              const verirCheck = document.getElementById("verirCheck");
              //Quiero poner un candado en los checkbox de los equipos
              veribCheck.classList.replace("left-2", "left-3");
              verirCheck.classList.replace("left-2", "left-3");
              veribCheck.innerHTML = `<i id="lockB" class="fas fa-lock text-3xl text-blue-500 animate__animated animate__jackInTheBox"></i>`;
              verirCheck.innerHTML = `<i id="lockR" class="fas fa-lock text-3xl text-red-500 animate__animated animate__jackInTheBox"></i>`;
            });
          }
        });

        socket.on("playerCreado", function (obj) {
          try {
            console.log("PLAYER CREADOWEBBBBBBBBBB", obj);
            if (window.juego)
              window.juego.addOtherPlayer(obj.player, obj.equipo, obj.position);
          } catch (err) {}
        });

        socket.on("playerEliminado", function (obj) {
          console.log("PLAYER ELIMINADO", obj);
          window.juego.removeOtherPlayer(obj.player);
        });

        socket.on("marcarGol", function (obj) {
          console.log("MARCAR GOL", obj);
          console.log("PARTIDA ANTES DE MARCAR GOLE", partida);
          window.juego.resetGameToGol();
          rest.obtenerUsuario($.cookie("nick"), function (usr) {
            if (usr.email == obj.usr.email) {
              console.log("EMAIL", obj.usr.email, usr.email);
              cw.marcarGol(partida, obj);
            }
          });
        });

        socket.on("actualizarPartidaGol", function (obj) {
          const prevPartida = partida;
          partida = obj;
          cw.actualizarContadorGoles(prevPartida, partida);
          cw.mostrarGol(partida);
        });

        socket.on("jugadorReady", function (obj) {
          const startButton = document.getElementById("startButton");
          console.log("JUGADOR READY", obj);
          if (!obj.isOpen) {
            const jugadoresReady = document.getElementById("jugadoresReady");
            jugadoresReady.classList.remove("hidden");
            //Quiero mostrar un div que aparezca la foto del jugador que está listo con un icono de un check verde abajo a la derecha
            const jugadorReadyDiv = document.createElement("div");
            jugadorReadyDiv.className = "avatar ml-2 mr-2";
            const avatarContainer = document.createElement("div");
            avatarContainer.className =
              "w-14 h-14 rounded-full border-4 border-green-500 bg-gray-200 flex items-center justify-center";
            if (obj.usr.photo) {
              const div = document.createElement("div");
              div.className = "items-center justify-center flex h-full";
              const avatarImage = document.createElement("img");
              avatarImage.src = obj.usr.photo;
              div.appendChild(avatarImage);
              avatarContainer.appendChild(div);
            } else {
              const div = document.createElement("div");
              div.className = "items-center justify-center flex h-full";
              const avatarImage = document.createElement("i");
              avatarImage.className = "fas fa-user text-2xl relative";
              div.appendChild(avatarImage);
              avatarContainer.appendChild(div);
            }
            const checkReady = document.createElement("div");
            checkReady.className = "absolute bottom-0 right-0";
            checkReady.innerHTML = `<lottie-player src="./cliente/img/lottie/playerReady.json" background="transparent" speed="1"
          class="w-8 h-8" autoplay></lottie-player>`;
            avatarContainer.appendChild(checkReady);
            jugadorReadyDiv.appendChild(avatarContainer);
            jugadoresReady.appendChild(jugadorReadyDiv);
          }

          //SI todos los jugadores están ready que haya un contador de 5 segundos en el start button y que se empiece la partida

          const jugadoresReadyDiv = document.getElementById("jugadoresReady");

          const jugadoresReady = jugadoresReadyDiv.childElementCount;
          if (jugadoresReady == partida.cantidadJugadores) {
            startButton.innerHTML = `<div class="flex flex-row items-center justify-center">
                <lottie-player src="./cliente/img/lottie/countDown.json" background="transparent" speed="1" class="w-8 h-8" autoplay></lottie-player>
                </div>`;
            setTimeout(() => {
              cw.ocultarDivs("salirDiv");
              cw.ocultarDivs("waitingDiv");
              cw.ocultarDivs("passCode");
              cw.ocultarDivs("joinDiv");
              const GUIContador = document.getElementById("GUIContador");
              GUIContador.classList.remove("hidden");

              const golesEquipoAzul =
                document.getElementById("golesEquipoAzul");
              const golesEquipoRojo =
                document.getElementById("golesEquipoRojo");

              if (partida.numGoles) {
                const maxGolesSpan = document.createElement("span");
                maxGolesSpan.id = "maxGolesB";
                maxGolesSpan.className = "text-2xl";
                maxGolesSpan.textContent = `/${partida.numGoles}`;
                golesEquipoAzul.appendChild(maxGolesSpan);

                const maxGolesSpanR = document.createElement("span");
                maxGolesSpanR.id = "maxGolesR";
                maxGolesSpanR.className = "text-2xl";
                maxGolesSpanR.textContent = `/${partida.numGoles}`;
                golesEquipoRojo.appendChild(maxGolesSpanR);
              }

              socket.emit("actualizarEstadoPartida", {
                partida: partida,
                estado: "jugando",
              });
              socket.on("actualizarEstadoPartida", function (obj) {
                partida = obj;
              });

              rest.obtenerUsuario($.cookie("nick"), function (usr) {
                const equipo = cw.getEquipoUsuario(partida, usr);
                window.juego.zoomCamera(usr, equipo);
                const lastCountDown = document.getElementById("lastCountDown");
                lastCountDown.innerHTML = `<div class="flex flex-row items-center justify-center">
                <lottie-player src="./cliente/img/lottie/countDown.json" background="transparent" speed="1" class="w-32 h-32" autoplay></lottie-player>
                </div>`;

                setTimeout(() => {
                  window.juego._canMove = true;
                  cw.contador(contadorTiempo, obj.partida, usr.email);
                }, 4500);
              });
            }, 400); //4500
          }
        });

        socket.on("pantallaFinal", function (obj) {
          window.juego._canMove = false;
          cw.mostrarPantallaFinal(obj);
        });
      });
    });
  };

  this.getEquipoUsuario = function (partida, usuario) {
    for (const equipoKey in partida.equipos) {
      const equipo = partida.equipos[equipoKey];

      // Convertir los valores del objeto de jugadores en un array
      const jugadoresArray = Object.values(equipo.jugadores);

      // Verificar si el usuario está en el equipo actual
      const usuarioEnEquipo = jugadoresArray.find(
        (e) => e.email === usuario.email
      );

      if (usuarioEnEquipo) {
        return equipoKey; // Devolver el nombre del equipo
      }
    }

    return null; // El usuario no está en ningún equipo
  };

  this.actualizarContadorGoles = function (prevPartida, partida) {
    const golesEquipoAzul = document.getElementById("golesEquipoAzul");
    const golesEquipoRojo = document.getElementById("golesEquipoRojo");

    console.log("prevPartida", prevPartida);
    console.log("partida", partida);
    const prevGolesAzul = prevPartida.equipos["equipoAzul"].goles;
    const prevGolesRojo = prevPartida.equipos["equipoRojo"].goles;
    const golesAzul = partida.equipos["equipoAzul"].goles;
    const golesRojo = partida.equipos["equipoRojo"].goles;

    if (prevGolesAzul !== golesAzul) {
      // Animación para Equipo Azul
      if (!partida.numGoles) {
        golesEquipoAzul.classList.add("animate__animated", "animate__flipOutX");
        setTimeout(() => {
          golesEquipoAzul.textContent = golesAzul;
          golesEquipoAzul.classList.remove(
            "animate__animated",
            "animate__flipOutX"
          );
          golesEquipoAzul.classList.add(
            "animate__animated",
            "animate__flipInX"
          );
        }, 500);
      } else {
        golesEquipoAzul.classList.add("animate__animated", "animate__flipOutX");
        setTimeout(() => {
          golesEquipoAzul.textContent = golesAzul;
          golesEquipoAzul.classList.remove(
            "animate__animated",
            "animate__flipOutX"
          );
          golesEquipoAzul.classList.add(
            "animate__animated",
            "animate__flipInX"
          );
          const maxGolesSpan = document.createElement("span");
          maxGolesSpan.id = "maxGolesB";
          maxGolesSpan.className = "text-2xl";
          maxGolesSpan.textContent = `/${partida.numGoles}`;
          golesEquipoAzul.appendChild(maxGolesSpan);
        }, 500);
      }
    }

    if (prevGolesRojo !== golesRojo) {
      if (!partida.numGoles) {
        golesEquipoRojo.classList.add("animate__animated", "animate__flipOutX");
        setTimeout(() => {
          golesEquipoRojo.textContent = golesRojo;
          golesEquipoRojo.classList.remove(
            "animate__animated",
            "animate__flipOutX"
          );
          golesEquipoRojo.classList.add(
            "animate__animated",
            "animate__flipInX"
          );
        }, 500);
      } else {
        golesEquipoRojo.classList.add("animate__animated", "animate__flipOutX");
        setTimeout(() => {
          golesEquipoRojo.textContent = golesRojo;
          golesEquipoRojo.classList.remove(
            "animate__animated",
            "animate__flipOutX"
          );
          golesEquipoRojo.classList.add(
            "animate__animated",
            "animate__flipInX"
          );
          const maxGolesSpanR = document.createElement("span");
          maxGolesSpanR.id = "maxGolesR";
          maxGolesSpanR.className = "text-2xl";
          maxGolesSpanR.textContent = `/${partida.numGoles}`;
          golesEquipoRojo.appendChild(maxGolesSpanR);
        }, 500);
      }
    }

    if (partida.numGoles) {
      console.log(
        "NUMERO DE GOLES ",
        partida.numGoles,
        "azul ",
        golesAzul,
        "rojo ",
        golesRojo
      );
      if (golesAzul == partida.numGoles || golesRojo == partida.numGoles) {
        console.log("PARTIDA FINALIZADA");
        rest.obtenerPartida(partida.id, function (partida) {
          rest.obtenerUsuario($.cookie("nick"), function (usr) {
            socket.emit("partidaFinalizada", {
              partida: partida,
              email: usr.email,
              abandono: false,
            });
          });
        });
      }
    }
  };

  this.mostrarGol = function (partida) {
    const goalScreen = document.getElementById("goalScreen");
    goalScreen.classList.remove("hidden");

    let lottieDiv = document.getElementById("lottieDiv");

    if (!lottieDiv) {
      lottieDiv = document.createElement("div");
      lottieDiv.id = "lottieDiv";
      lottieDiv.className = "w-full  flex items-center justify-center";
      lottieDiv.innerHTML = `<lottie-player src="./cliente/img/lottie/goal.json" background="transparent" speed="1" class="w-full h-full" autoplay></lottie-player>`;
      goalScreen.appendChild(lottieDiv);
    }

    setTimeout(() => {
      goalScreen.classList.add("hidden");
      goalScreen.innerHTML = "";
    }, 3500);
  };

  this.mostrarPantallaFinal = function (obj) {
    $("#GUIContador").empty();
    $("#endScreen").load("./cliente/juego/endScreen.html", function () {
      console.log("endScreen objt", obj);
      const volverInicio = document.getElementById("volverInicio");
      volverInicio.addEventListener("click", () => {
        rest.obtenerUsuario(obj.email, function (usr) {
          socket.emit("salirPartida", { usr: usr, partida: obj.partida });
          $("#partido").empty();
          $("#navbar").removeClass("hidden");
          $("#navBarBtn").removeClass("hidden");
          $("#container").removeClass("hidden");
          $("#GUI").empty();
          cw.mostrarInicio();
        });
      });
      const endScreen = document.getElementById("endScreen");
      endScreen.classList.remove("hidden");

      const golesEndBlue = document.getElementById("golesEndBlue");
      const golesEndRed = document.getElementById("golesEndRed");

      const golesAzul = obj.partida.equipos["equipoAzul"].goles;
      const golesRojo = obj.partida.equipos["equipoRojo"].goles;

      golesEndBlue.textContent = golesAzul;
      golesEndRed.textContent = golesRojo;

      if (golesAzul > golesRojo) {
        // El equipo azul ha ganado
        const winText = document.getElementById("winText");
        winText.textContent = "¡Ha ganado el Equipo Azul!";
      } else if (golesRojo > golesAzul) {
        // El equipo rojo ha ganado
        const winText = document.getElementById("winText");
        winText.textContent = "¡Ha ganado el Equipo Rojo!";
      } else {
        // Han empatado
        const winText = document.getElementById("winText");
        winText.textContent = "¡El partido ha terminado en empate!";
      }

      if (obj.abandono) {
        socket.emit("actualizarEstadoPartida", {
          partida: obj.partida,
          estado: "finalizada",
        });
        const numJugadoresAzul = Object.values(
          obj.partida.equipos["equipoAzul"].jugadores
        ).length;
        const numJugadoresRojo = Object.values(
          obj.partida.equipos["equipoRojo"].jugadores
        ).length;

        if (numJugadoresAzul == 0) {
          const winText = document.getElementById("winText");
          winText.textContent = "¡Ha ganado el Equipo Rojo por abandono!";
        } else if (numJugadoresRojo == 0) {
          const winText = document.getElementById("winText");
          winText.textContent = "¡Ha ganado el Equipo Azul por abandono!";
        }
      }
    });
  };

  this.marcarGol = function (partida, obj) {
    console.log("PARTIDA EN MARCAR GOLE", partida);
    socket.emit("actualizarPartidaGol", { partida: partida, obj: obj });
  };

  this.ocultarDivs = function (div) {
    const divOcultar = document.getElementById(div);
    divOcultar.classList.add("hidden");
  };

  this.mostrarLoadingGame = function (partida) {
    $("#loading").load("./cliente/juego/loading.html", function () {
      setTimeout(function () {
        $("#loading").addClass("animate__fadeOut");
        setTimeout(function () {
          $("#loading").addClass("hidden");
        }, 1000);
      }, 50);
    });
  };

  this.limpiarInicio = function () {
    $("#editarPerfil").empty();
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
