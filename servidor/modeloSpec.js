const { call } = require("body-parser");
const modelo = require("./modelo.js");

describe("El sistema", function () {
  let sistema;
  let usr1;

  beforeEach(function () {
    sistema = new modelo.Sistema(true);
    usr1 = {
      nick: "pepe",
      email: "pepe@pepe.com",
      clave: "pepe",
    };
    usr2 = {
      nick: "juan",
      email: "juan@juan.com",
      clave: "juan",
    };
  });

  it("inicialmente no hay usuarios", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
  });

  it("agrega un usuario", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    sistema.agregarUsuario({ nick: "pepe" });
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe"]);
    expect(sistema.usuarioActivo("pepe")).toEqual({ activo: true });
    expect(sistema.usuarios["pepe"].nick).toEqual("pepe");
    sistema.eliminarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    expect(sistema.obtenerTodosNicks()).toEqual([]);
  });

  it("obtener todos usuarios", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    expect(sistema.obtenerTodosNicks()).toEqual([]);
    sistema.agregarUsuario({
      nick: "pepe",
      email: "pepe@pepe.com",
      clave: "pepe",
    });
    sistema.agregarUsuario({
      nick: "juan",
      email: "juan@juan.com",
      clave: "juan",
    });
    expect(sistema.numeroUsuarios()).toEqual({ num: 2 });
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe", "juan"]);
    sistema.eliminarUsuario("pepe");
    sistema.eliminarUsuario("juan");
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    expect(sistema.obtenerTodosNicks()).toEqual([]);
  });

  it("usuario activo", function () {
    sistema.agregarUsuario({ nick: "pepe" });
    expect(sistema.usuarioActivo("pepe")).toEqual({ activo: true });
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe"]);
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    sistema.eliminarUsuario("pepe");
    expect(sistema.usuarioActivo("pepe")).toEqual({ activo: false });
    expect(sistema.obtenerTodosNicks()).toEqual([]);
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
  });

  it("eliminar usuario", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    sistema.agregarUsuario({ nick: "pepe" });
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    sistema.eliminarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
  });

  it("numero usuarios", function () {
    expect(sistema.usuarios).toEqual({});
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    sistema.agregarUsuario({
      nick: "pepe",
      email: "pepe@pepe.com",
      clave: "pepe",
    });
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    sistema.agregarUsuario({
      nick: "juan",
      email: "juan@juan.com",
      clave: "juan",
    });
    expect(sistema.numeroUsuarios()).toEqual({ num: 2 });
  });

  it("Actualizar Usuario Local", function () {
    sistema.agregarUsuario(usr1);

    expect(sistema.usuarios[usr1.nick].nick).toEqual("pepe");
    expect(sistema.usuarios[usr1.nick].email).toEqual("pepe@pepe.com");

    let usrUpdate = {
      oldNick: usr1.nick,
      oldEmail: usr1.email,
      nick: "pepe2",
      email: "pepe2@pepe2.com",
    };
    sistema.actualizarUsuarioLocal(usrUpdate);
    expect(sistema.usuarios[usr1]).toEqual(undefined);
    expect(sistema.usuarios[usrUpdate.nick].nick).not.toEqual("pepe");
    expect(sistema.usuarios[usrUpdate.nick].email).not.toEqual("pepe@pepe.com");
    expect(sistema.usuarios[usrUpdate.nick].nick).toEqual("pepe2");
    expect(sistema.usuarios[usrUpdate.nick].email).toEqual("pepe2@pepe2.com");

    let usrUpdate2 = {
      oldNick: usrUpdate.nick,
      oldEmail: usrUpdate.email,
      nick: "pepe",
      email: usrUpdate.email,
    };
    sistema.actualizarUsuarioLocal(usrUpdate2);
    expect(sistema.usuarios[usrUpdate.nick]).toEqual(undefined);
    expect(sistema.usuarios[usrUpdate2.nick].nick).not.toEqual("pepe2");
    expect(sistema.usuarios[usrUpdate2.nick].email).not.toEqual(usr1.email);
    expect(sistema.usuarios[usrUpdate2.nick].nick).toEqual("pepe");
    expect(sistema.usuarios[usrUpdate2.nick].email).toEqual(usrUpdate.email);
  });

  describe("Pruebas de las partidas", function () {
    let usr1, usr2, usr3, partida;
    beforeEach(function () {
      usr1 = {
        nick: "pepe",
        email: "pepe@pepe.com",
        clave: "pepe",
      };
      usr2 = {
        nick: "juan",
        email: "juan@juan.com",
        clave: "juan",
      };
      usr3 = {
        nick: "luis",
        email: "luis@luis.com",
        clave: "luis",
      };
      partida = {
        email: "pepe@pepe.com",
        nombrePartida: "partida1",
        cantidadJugadores: 2,
        duracion: 3,
        numGoles: 4,
        estado: {estado:"esperando"},
        passCode: "12345678",
      };
    });

    it("Crear partida", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      let id;

      sistema.crearPartida(partida, function (res) {
        id = res;
        expect(
          sistema.obtenerPartidas(function (res) {
            expect(id).toEqual({ id: Object.keys(res)[0] });
            expect(sistema.partidas[Object.keys(res)[0]].creador).toEqual(
              "pepe@pepe.com"
            );
            expect(sistema.partidas[Object.keys(res)[0]].nombrePartida).toEqual(
              "partida1"
            );
            expect(
              sistema.partidas[Object.keys(res)[0]].cantidadJugadores
            ).toEqual(2);
            expect(sistema.partidas[Object.keys(res)[0]].duracion).toEqual(3);
            expect(sistema.partidas[Object.keys(res)[0]].numGoles).toEqual(4);
            expect(sistema.partidas[Object.keys(res)[0]].estado.estado).toEqual(
              "esperando"
            );
            expect(sistema.partidas[Object.keys(res)[0]].passCode).toEqual(
              "12345678"
            );
          })
        ).not.toEqual({});
      });
      expect(sistema.partidas).not.toEqual({});
    });

    it("Unirse a partida", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      sistema.crearPartida(partida, function (res) {
        sistema.unirsePartida(
          { usr: usr1, passCode: "12345678" },
          (callback = function (res) {
            expect(res).toEqual({ error: "El jugador ya está en la partida" });
          })
        );

        let id;
        sistema.unirsePartida(
          { usr: usr2, passCode: "12345678" },
          (callback = function (res) {
            id = res;
            sistema.obtenerPartidas(function (res) {
              expect(id).toEqual({ id: Object.keys(res)[0] });
              expect(usr2).toEqual(
                sistema.partidas[Object.keys(res)[0]].jugadores.juan
              );
            });
          })
        );

        sistema.unirsePartida(
          { usr: usr3, passCode: "12345678" },
          (callback = function (res) {
            expect(res).toEqual({ error: "La partida está llena" });
          })
        );
      });
    });

    it("Salir de partida", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: sistema.partidas[Object.keys(res)[0]].id };
        sistema.salirPartida(partida, usr1, function (res) {
          expect(res.partida).toEqual(undefined);
        });
      });

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: sistema.partidas[Object.keys(res)[0]].id };
        sistema.salirPartida(partida, usr2, function (res) {
          expect(res.error).toEqual("El jugador no está en la partida");
        });
      });

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: "1234561" };
        sistema.salirPartida(partida, usr2, function (res) {
          expect(res.error).toEqual("Partida no encontrada");
        });
      });
    });

    it("Unirse a equipo", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: sistema.partidas[Object.keys(res)[0]].id };
        sistema.unirseAEquipo(partida, usr1, "equipoRojo", function (res) {
          expect(res.partida.equipos["equipoRojo"].jugadores.pepe).toEqual(
            usr1
          );
          expect(res.partida.equipos["equipoRojo"].jugadores.pepe).not.toEqual(
            usr2
          );
        });

        sistema.unirseAEquipo(partida, usr2, "equipoAzul", function (res) {
          expect(res.error).toEqual("El jugador no está en la partida");
        });

        sistema.unirsePartida(
          { usr: usr2, passCode: "12345678" },
          (callback = function (res) {
            sistema.unirseAEquipo(partida, usr2, "equipoAzul", function (res) {
              expect(res.partida.equipos["equipoAzul"].jugadores.juan).toEqual(
                usr2
              );
            });
          })
        );

        sistema.unirseAEquipo(partida, usr1, "equipoRojo", function (res) {
          expect(res.error).toEqual("El jugador ya está en el equipo");
        });
      });
    });

    it("Salir equipo", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: sistema.partidas[Object.keys(res)[0]].id };
        sistema.salirEquipo(partida, usr1, "equipoRojo", function (res) {
          expect(res.error).toEqual("El jugador no está en el equipo");
        });

        sistema.unirseAEquipo(partida, usr1, "equipoRojo", function (res) {
          sistema.salirEquipo(partida, usr1, "equipoRojo", function (res) {
            expect(res.partida.equipos["equipoRojo"].jugadores.pepe).toEqual(
              undefined
            );
          });
        });

        sistema.salirEquipo(partida, usr2, "equipoAzul", function (res) {
          expect(res.error).toEqual("El jugador no está en la partida");
        });

        sistema.unirsePartida(
          { usr: usr2, passCode: "12345678" },
          (callback = function (res) {
            sistema.unirseAEquipo(partida, usr2, "equipoAzul", function (res) {
              sistema.salirEquipo(partida, usr2, "equipoAzul", function (res) {
                expect(
                  res.partida.equipos["equipoAzul"].jugadores.juan
                ).toEqual(undefined);
              });
            });
          })
        );
      });
    });

    it("Actualizar Estado Partida", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: sistema.partidas[Object.keys(res)[0]].id };
        expect(sistema.partidas[Object.keys(res)[0]].estado.estado).not.toEqual(
          "jugando"
        );
        expect(sistema.partidas[Object.keys(res)[0]].estado.estado).not.toEqual(
          "finalizada"
        );
        expect(sistema.partidas[Object.keys(res)[0]].estado.estado).toEqual(
          "esperando"
        );
        sistema.actualizarEstadoPartida(partida, "jugando", function (res) {
          expect(res.estado.estado).toEqual("jugando");
          expect(res.estado.estado).not.toEqual("esperando");
          expect(res.estado.estado).not.toEqual("finalizada");
        });

        sistema.actualizarEstadoPartida(partida, "finalizada", function (res) {
          expect(res.estado.estado).toEqual("finalizada");
          expect(res.estado.estado).not.toEqual("esperando");
          expect(res.estado.estado).not.toEqual("jugando");
        });
      });
    });

    it("Actualizar Partida Gol", function () {
      sistema.agregarUsuario(usr1);
      sistema.agregarUsuario(usr2);

      sistema.crearPartida(partida, function (res) {});

      sistema.obtenerPartidas(function (res) {
        partida = { id: sistema.partidas[Object.keys(res)[0]].id };
        sistema.unirsePartida(
          { usr: usr1, passCode: "12345678" },
          function (res) {}
        );
        sistema.unirsePartida(
          { usr: usr2, passCode: "12345678" },
          function (res) {}
        );
        sistema.unirseAEquipo(partida, usr1, "equipoRojo", function (res) {
          sistema.unirseAEquipo(partida, usr2, "equipoAzul", function (res) {
            expect(res.partida.equipos["equipoRojo"].goles).toEqual(0);
            expect(res.partida.equipos["equipoAzul"].goles).toEqual(0);
            sistema.actualizarPartidaGol(partida, "equipoRojo", function (res) {
              expect(res.equipos["equipoRojo"].goles).toEqual(1);
              expect(res.equipos["equipoAzul"].goles).toEqual(0);
            });

            sistema.actualizarPartidaGol(partida, "equipoAzul", function (res) {
              expect(res.equipos["equipoRojo"].goles).toEqual(1);
              expect(res.equipos["equipoAzul"].goles).toEqual(1);
            });

            sistema.actualizarPartidaGol(partida, "equipoAzul", function (res) {
              expect(res.equipos["equipoRojo"].goles).toEqual(1);
              expect(res.equipos["equipoAzul"].goles).toEqual(2);
            });
          });
        });
      });
    });
  });

  describe("Métodos que acceden a datos", function () {
    let usrTest = { nick: "test", email: "test@test.es", password: "test" };
    let usrOAuth = { nick: "test2", email: "test2@test2.es" };

    beforeEach(function (done) {
      sistema.cad.conectar(function () {
        done();
      });
    });

    it("Registro de sesión", async function () {
      const res1 = await new Promise((resolve) => {
        sistema.registrarUsuario(usrTest, (res) => {
          resolve(res);
        });
      });

      expect(sistema.usuarios[res1.nick].nick).toEqual("test");
      expect(sistema.usuarios[res1.nick].email).toEqual("test@test.es");
      expect(res1.nick).toEqual("test");
      expect(res1.email).toEqual("test@test.es");
      expect(res1.confirmada).toEqual(false);

      // Intenta registrar el mismo usuario nuevamente
      const res2 = await new Promise((resolve) => {
        sistema.registrarUsuario(usrTest, (res) => {
          resolve(res);
        });
      });

      expect(res2.email).toEqual(-1);

      // Confirma el usuario
      const confirmRes = await new Promise((resolve) => {
        sistema.cad.confirmarUsuario(res1.email, res1.key, (confirmRes) => {
          resolve(confirmRes);
        });
      });

      expect(confirmRes.confirmada).toEqual(true);

      const elimRes = await new Promise((resolve) => {
        sistema.eliminarUsuarioBD(res1, (elimRes) => {
          resolve(elimRes);
        });
      });
      expect(elimRes.email).toEqual(usrTest.email);
    });

    it("Inicio de sesión", async function () {
      let userLogin = { nick: "test", email: "test@test.es", password: "test" };
      const { log1e, log1u } = await new Promise((resolve) => {
        sistema.iniciarSesion(userLogin, (err, log1) => {
          if (err) {
            console.error(err);
            resolve({ log1e: err, log1u: null });
          } else {
            resolve({ log1e: log1.error, log1u: log1 });
          }
        });
      });

      expect(log1e.error).toEqual("Usuario no registrado");
      expect(log1u).toEqual(null);

      const res = await new Promise((resolve) => {
        sistema.registrarUsuario(userLogin, (res) => {
          resolve(res);
        });
      });

      await new Promise((resolve) => {
        sistema.cad.confirmarUsuario(res.email, res.key, (confirmRes) => {
          resolve(confirmRes);
        });
      });

      const userLogin2 = {
        nick: "test",
        email: "test@test.es",
        password: "test",
      };

      const { log2e, log2u } = await new Promise((resolve) => {
        sistema.iniciarSesion(userLogin2, (err, log2) => {
          if (err) {
            console.error(err);
            resolve({ log2e: err, log2u: null });
          } else {
            resolve({ log2e: log2.error, log2u: log2 });
          }
        });
      });

      expect(log2e).toEqual(undefined);
      expect(log2u.nick).toEqual(userLogin2.nick);
      expect(log2u.email).toEqual(userLogin2.email);
      expect(log2u.confirmada).toEqual(true);

      const userLogin3 = {
        nick: "test",
        email: "test@test.es",
        password: "incorrecta",
      };

      const { log3e, log3u } = await new Promise((resolve) => {
        sistema.iniciarSesion(userLogin3, (err, log3) => {
          if (err) {
            console.error(err);
            resolve({ log3e: err, log3u: null });
          } else {
            resolve({ log3e: log3.error, log3u: log3 });
          }
        });
      });

      expect(log3e.error).toEqual("Contraseña incorrecta");
      expect(log3u).toEqual(null);

      

      await new Promise((resolve) => {
        sistema.eliminarUsuarioBD(res, (elimRes) => {
          resolve(elimRes);
        });
      });
    });

    it("OAUTH", async function () {
      const rest = await new Promise((resolve) => {
        sistema.usuarioOAuth(usrOAuth, (res) => {
          resolve(res);
        });
      });
      expect(rest.nick).toEqual("test2");
      expect(rest.email).toEqual("test2@test2.es");
      expect(rest.confirmada).toEqual(true);

      await new Promise((resolve) => {
        sistema.eliminarUsuarioBD(rest, (elimRes) => {
          resolve(elimRes);
        });
      });
    });

    it("recuperarUsuario", async function () {
      const userRecuperar = "test";
      const userRecuperars = {
        nick: "test",
        email: "test@test.es",
        password: "test",
      };

      const reg = await new Promise((resolve) => {
        sistema.registrarUsuario(userRecuperars, (res) => {
          resolve(res);
        });
      });

      const res = await new Promise((resolve) => {
        sistema.recuperarUsuario(userRecuperar);
        resolve(sistema.usuarios[userRecuperar]);
      });

      expect(res.nick).toEqual("test");
      expect(res.email).toEqual("test@test.es");

      await new Promise((resolve) => {
        sistema.eliminarUsuarioBD(reg, (elimRes) => {
          resolve(elimRes);
        });
      });
    });
  });
});
