const nodemailer = require('nodemailer');
const url = 'http://localhost:3000/';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alejandronavarro.software@gmail.com',
        pass: 'raqf wnfv canx oppq'
    }
});

//send();

module.exports.enviarEmail=async function(direccion, key,men) {
    const result = await transporter.sendMail({
        from: 'alejandronavarro.software@gmail.com',
        to: direccion,
        subject: men,
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
    });
}
