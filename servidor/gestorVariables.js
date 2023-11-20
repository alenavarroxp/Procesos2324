const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function accessCLAVECORREO() {
    const name = 'projects/726975145917/secrets/CLAVECORREO/versions/1';
      const [version] = await client.accessSecretVersion({
        name: name,
      });
      //console.info(`Found secret ${version.name} with state ${version.state}`);
      const datos=version.payload.data.toString("utf8");
      //console.log("Datos "+datos);
      return datos;
}

async function accessCORREO(){
    const name = 'projects/726975145917/secrets/CORREO/versions/1';
    const [version] = await client.accessSecretVersion({
      name: name,
    });
    const datos = version.payload.data.toString("utf8");
    return datos;
}

module.exports.obtenerOptions = async function(callback) {
  let options = {user:"",pass:""};
  let user = await accessCORREO();  
  let pass = await accessCLAVECORREO();
  options.user = user;
  options.pass = pass;
  callback(options);
}
