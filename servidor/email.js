const gv = require("./gestorVariables");
const nodemailer = require("nodemailer");
// const url = "http://localhost:3000/";
const url = "https://arquitectura-base-github-5rfb3lj4yq-ew.a.run.app/";

let transporter;
let options = {
  user: "",
  pass: "",
};

module.exports.conectar = function (callback) {
  gv.obtenerOptions(function (obj) {
    options = obj;
    callback(obj);
  });
};

module.exports.enviarEmail = async function (direccion, key, men) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: options,
  });
  const correoHTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Confirmación de Cuenta - Sistema de Partidos de Fútbol</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .container {
              max-width: 600px;
              padding: 30px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          .header {
              padding: 20px 0;
          }
          .header h1 {
              color: #0047ab;
              margin: 0;
              padding: 0;
              font-size: 28px;
          }
          .content {
              padding: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 40px;
              background-color: #0047ab;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
          }
          .button:hover {
              background-color: #002e6c;
          }
          .footer {
              margin-top: 20px;
              text-align: center;
              color: #666;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Bienvenido al Sistema de Partidos de Fútbol</h1>
          </div>
          <div class="content">
              <p>Hola,</p>
              <p>Gracias por unirte a nuestro sistema. Para confirmar tu cuenta y empezar a disfrutar de los partidos de fútbol, por favor haz clic en el botón a continuación:</p>
              <a class="button" href="${url}confirmarUsuario/${direccion}/${key}">Confirmar Cuenta</a>
              <p>¡Nos vemos en el campo!</p>
          </div>
          <div class="footer">
              <p>No responda a este correo. Para asistencia, contáctenos a ${options.user}</p>
          </div>
      </div>
  </body>
  </html>
`;
  const result = await transporter.sendMail({
    from: "SISTEMA DE FÚTBOL ONLINE",
    to: direccion,
    subject: men,
    text: "Pulsa aquí para confirmar cuenta",
    html: correoHTML,
  });
};
