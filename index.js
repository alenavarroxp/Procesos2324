const fs = require("fs");
const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportSetup = require("./servidor/passport-setup.js");
const modelo = require("./servidor/modelo.js");
const PORT = process.env.PORT || 3000;

const args = process.argv.slice(2);
let test = false;
test = eval(args[0]); //test=true

app.use(express.static(__dirname + "/"));

app.use(
  cookieSession({
    name: "Sistema",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
      let nick = req.user.emails[0].value;
      sistema.obtenerOCrearUsuario(nick);
      res.cookie("nick", nick);
      res.redirect("/");
      break;
    case "github":
      console.log(req.user);
      let nick2 = req.user.username;
      sistema.obtenerOCrearUsuario(nick2);
      res.cookie("nick", nick2);
      res.redirect("/");
      break;
    default:
      res.redirect("/");
      break;
  }
});

app.get("/fallo", function (req, res) {
  res.send({ nick: "NoOK" });
});

let sistema = new modelo.Sistema(test);

app.get("/", function (request, response) {
  var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  response.setHeader("Content-type", "text/html");
  response.send(contenido);
});

//... Una entrada por cada funcionalidad de mi capa lógica
app.get("/agregarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let res = sistema.agregarUsuario(nick);
  response.send(res);
});

app.get("/obtenerUsuarios", function (request, response) {
  let usuarios = sistema.obtenerUsuarios();
  response.send(usuarios);
});

app.get("/usuarioActivo/:nick", function (request, response) {
  let nick = request.params.nick;
  let res = sistema.usuarioActivo(nick);
  response.send(res);
});

app.get("/numeroUsuarios", function (request, response) {
  let res = sistema.numeroUsuarios();
  response.send(res);
});

app.get("/eliminarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let res = sistema.eliminarUsuario(nick);
  response.send(res);
});

app.listen(PORT, () => {
  console.log(`App está escuchando en el puerto ${PORT}`);
  console.log("Ctrl+C para salir");
});
