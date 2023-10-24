const bodyParser = require("body-parser");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
      let email = req.user.emails[0].value;
      sistema.usuarioOAuth({ email: email }, function (obj) {
        res.cookie("nick", obj.email);
        res.redirect("/");
      });
      break;
    case "github":
      console.log(req.user);
      let email2 = req.user.username;
      sistema.usuarioOAuth({ email: email2 }, function (obj) {
        res.cookie("nick", obj.email2);
        res.redirect("/");
      });
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

app.get("/registrarUsuario/:email/:pwd", function (request, response) {
  let email = request.params.email;
  let pwd = request.params.pwd;
  sistema.registrarUsuario(email, pwd, function(result){
    response.send(result);
  });
  
});


app.post("/enviarJwt", function (request, response) {
  let jwt = request.body.jwt;
  let user = JSON.parse(atob(jwt.split(".")[1]));
  let email = user.email;
  sistema.usuarioOAuth({ "email": email }, function (obj) {
    response.send({ nick: obj.email });
  });
});

app.listen(PORT, () => {
  console.log(`App está escuchando en el puerto ${PORT}`);
  console.log("Ctrl+C para salir");
});
