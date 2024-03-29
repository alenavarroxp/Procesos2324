const bodyParser = require("body-parser");
const fs = require("fs");
const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const LocalStrategy = require("passport-local").Strategy;
const passportSetup = require("./servidor/passport-setup.js");
const modelo = require("./servidor/modelo.js");
const axios = require("axios");
const PORT = process.env.PORT || 3000;

const httpServer = require("http").Server(app);
const { Server } = require("socket.io");

const modeloWS = require("./servidor/socket.js");

const ws = new modeloWS.WSServer();

const haIniciado = function (request, response, next) {
  if (request.user) next();
  else response.redirect("/");
};

const args = process.argv.slice(2);
let test = false;
test = eval(args[0]); //test=true

const args2 = process.argv.slice(3);
let playwright = false;
playwright = eval(args2[0]); //playwright=true

app.use(express.static(__dirname + "/"));

app.use(
  cookieSession({
    name: "Sistema",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      sistema.iniciarSesion(
        { email: email, password: password },
        function (err, usr) {
          if (err) {
            if (err.error == "Contraseña incorrecta") {
              console.log("Contraseña incorrecta");
              return done(null, { error: "Contraseña incorrecta" });
            }
            if (err.error == "Usuario no registrado") {
              console.log("Usuario no registrado");
              return done(null, { error: "Usuario no registrado" });
            }
            if (err.error == "Usuario no registrado en local") {
              console.log("Usuario no registrado en local");
              return done(null, { error: "Usuario no registrado en local" });
            }
          }

          if (!usr) return done(null, { error: "Usuario no encontrado" });
          if (usr.email != -1) {
            return done(null, usr);
          } else {
            return done(-1);
          }
        }
      );
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fallo" }),
  function (req, res) {
    res.redirect("/good");
  }
);

app.post(
  "/oneTap/callback",
  passport.authenticate("google-one-tap", { failureRedirect: "/fallo" }),
  function (req, res) {
    res.redirect("/good");
  }
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/fallo" }),
  function (req, res) {
    res.redirect("/good");
  }
);

app.get("/good", function (req, res) {
  switch (req.user.provider) {
    case "google":
    case "google-one-tap":
      let nick = req.user.displayName;
      let email = req.user.emails[0].value;
      let photo = req.user.photos[0].value;
      sistema.usuarioOAuth(
        { nick: nick, email: email, photo: photo },
        function (obj) {
          res.cookie("nick", obj.email);
          res.redirect("/");
        }
      );
      break;
    case "github":
      let nick2 = req.user.displayName;
      let email2 = req.user.username;
      let photo2 = req.user.photos[0].value;
      sistema.usuarioOAuth(
        { nick: nick2, email: email2, photo: photo2 },
        function (obj) {
          res.cookie("nick", obj.email);
          res.redirect("/");
        }
      );
      break;
    default:
      res.redirect("/");
      break;
  }
});

app.get("/ok", function (request, response) {
  response.send({ usr: request.user });
});

app.get("/fallo", function (req, res) {
  res.send({ nick: "NoOK" });
});

let sistema = new modelo.Sistema(test);

app.get("/", function (request, response) {
  // Lee el contenido de index.html
  var contenido = fs.readFileSync(__dirname + "/cliente/index.html", "utf-8");

  // Añade una inserción de script que define window.playwright
  const modifiedContent = `
    <script>
        window.playwright = ${playwright};
    </script>
    ${contenido}
  `;

  response.setHeader("Content-type", "text/html");
  response.send(modifiedContent);
});

//... Una entrada por cada funcionalidad de mi capa lógica
// app.get("/agregarUsuario/:nick", function (request, response) {
//   let nick = request.params.nick;
//   let res = sistema.agregarUsuario(nick);
//   response.send(res);
// });

app.get("/obtenerUsuario/:email", function (request, response) {
  let email = request.params.email;
  sistema.obtenerUsuario(email, function (obj) {
    response.send(obj);
  });
});

app.get("/obtenerUsuarioBD/:email", function (request, response) {
  let email = request.params.email;
  sistema.obtenerUsuarioBD(email, function (obj) {
    response.send(obj);
  });
});

app.post("/actualizarUsuario", function (request, response) {
  sistema.actualizarUsuario(request.body.usr, function (obj) {
    response.send(obj);
  });
});

app.get("/obtenerUsuarios", haIniciado, function (request, response) {
  let usuarios = sistema.obtenerUsuarios();
  response.send(usuarios);
});

// app.get("/usuarioActivo/:nick", function (request, response) {
//   let nick = request.params.nick;
//   let res = sistema.usuarioActivo(nick);
//   response.send(res);
// });

// app.get("/numeroUsuarios", function (request, response) {
//   let res = sistema.numeroUsuarios();
//   response.send(res);
// });

app.get("/eliminarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let res = sistema.eliminarUsuario(nick);
  response.send(res);
});

app.get("/recuperarUsuario/:nick", async function (request, response) {
  let nick = request.params.nick;
  let res = await sistema.recuperarUsuario(nick);
  response.send(res);
});

app.get("/confirmarUsuario/:email/:key", function (request, response) {
  let email = request.params.email;
  let key = request.params.key;
  sistema.confirmarUsuario(email, key, function (obj) {
    if (obj.confirmada) {
      response.cookie("nick", obj.email);
      response.redirect("/");
    } else {
      response.redirect("/fallo");
    }
  });
});

app.get("/cerrarSesion", haIniciado, function (request, response) {
  let nick =
    request.user.displayName || request.user.username || request.user.nick;
  request.logOut();
  response.redirect("/");
  if (nick) sistema.eliminarUsuario(nick);
});

app.post("/enviarJwt", function (request, response) {
  let jwt = request.body.jwt;
  let user = JSON.parse(atob(jwt.split(".")[1]));
  let email = user.email;
  sistema.usuarioOAuth({ email: email }, function (obj) {
    response.send({ nick: obj.email });
  });
});

app.post("/verificacionRecaptcha", async function (req, res) {
  const token = req.body.token;

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6LeD_OMoAAAAAE8MF2ZAI3iQdqJ3TTKPJXZBL6au", // Tu clave secreta de reCAPTCHA
          response: token,
        },
      }
    );

    if (response.data.success) {
      res.status(200).json({ success: true, message: "reCAPTCHA válido" });
    } else {
      res.status(400).json({ success: false, message: "reCAPTCHA inválido" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error en la verificación de reCAPTCHA",
    });
  }
});

app.post("/registrarUsuario", function (request, response) {
  sistema.registrarUsuario(request.body, function (result) {
    response.send({ nick: result.nick });
  });
});

app.post(
  "/iniciarSesion",
  passport.authenticate("local", {
    failureRedirect: "/fallo",
    successRedirect: "/ok",
  })
);

app.post("/reenviarCorreo", function (request, response) {
  sistema.reenviarCorreo(request.body, function (obj) {
    response.send(obj);
  });
});

app.post("/crearPartida", function (request, response) {
  sistema.crearPartida(request.body, function (obj) {
    response.send(obj);
  });
});

app.get("/obtenerPartida/:id", function (request, response) {
  let id = request.params.id;
  sistema.obtenerPartida(id, function (obj) {
    response.send(obj);
  });
});

app.get("/obtenerPartidas", function (request, response) {
  sistema.obtenerPartidas(function (obj) {
    response.send(obj);
  });
});

app.post("/unirsePartida", function (request, response) {
  sistema.unirsePartida(request.body, function (obj) {
    response.send(obj);
  });
});

app.post("/salirPartida", function (request, response) {
  let usr = request.body.usr;
  let partida = request.body.partida;
  sistema.salirPartida(partida, usr, function (obj) {
    sistema.obtenerPartidas(function (obj) {
      io.emit("obtenerPartidas", obj);
    });
    response.send("Usuario salió de la partida");
  });
});

httpServer.listen(PORT, () => {
  console.log(`App está escuchando en el puerto ${PORT}`);
  console.log("Ctrl+C para salir");
});

const io = new Server();
io.listen(httpServer);

ws.lanzarServidor(io, sistema);
