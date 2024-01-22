const { call } = require("body-parser");
const modelo = require("./modelo.js");

describe("El sistema", function () {
  let sistema;
  let usr1, usr2;

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
    //TODO
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
        estado: "esperando",
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
            expect(sistema.partidas[Object.keys(res)[0]].estado).toEqual(
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
        expect(sistema.partidas[Object.keys(res)[0]].estado).not.toEqual(
          "jugando"
        );
        expect(sistema.partidas[Object.keys(res)[0]].estado).not.toEqual(
          "finalizada"
        );
        expect(sistema.partidas[Object.keys(res)[0]].estado).toEqual(
          "esperando"
        );
        sistema.actualizarEstadoPartida(partida, "jugando", function (res) {
          expect(res.estado).toEqual("jugando");
          expect(res.estado).not.toEqual("esperando");
          expect(res.estado).not.toEqual("finalizada");
        });

        sistema.actualizarEstadoPartida(partida, "finalizada", function (res) {
          expect(res.estado).toEqual("finalizada");
          expect(res.estado).not.toEqual("esperando");
          expect(res.estado).not.toEqual("jugando");
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

      console.log("res1", res1);
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

      console.log("res2", res2);
      expect(res2.email).toEqual(-1);

      // Confirma el usuario
      const confirmRes = await new Promise((resolve) => {
        sistema.cad.confirmarUsuario(res1.email, res1.key, (confirmRes) => {
          resolve(confirmRes);
        });
      });

      console.log("confirmRes", confirmRes);
      expect(confirmRes.confirmada).toEqual(true);

      const elimRes = await new Promise((resolve) => {
        sistema.eliminarUsuarioBD(res1, (elimRes) => {
          console.log("eliminado", elimRes);
          resolve(elimRes);
        });
      });

      console.log("elimRes", elimRes);

      // sistema.registrarUsuario(usrTest, function (res) {
      //   expect(sistema.usuarios[res.nick].nick).toEqual("test");
      //   expect(sistema.usuarios[res.nick].email).toEqual("test@test.es");
      //   expect(res.nick).toEqual("test");
      //   expect(res.email).toEqual("test@test.es");
      //   expect(res.confirmada).toEqual(false);

      //   sistema.registrarUsuario(usrTest, function (res) {
      //     expect(res.email).toEqual(-1);

      //     sistema.cad.confirmarUsuario(
      //       res.email,
      //       res.key,
      //       function (confirmRes) {
      //         expect(confirmRes.confirmada).toEqual(false);

      //         sistema.eliminarUsuarioBD(res, function (elimRes) {
      //           console.log("eliminado", elimRes);
      //           done(); // Llama a done() aquí para indicar que la prueba ha terminado
      //         });
      //       }
      //     );
      //   });
      // });
    });

    xit("Inicio de sesión correcto", function (done) {
      sistema.iniciarSesion(usrTest, function (res) {
        done();
      });
    });

    xit("Inicio de sesión incorrecto", function () {});
  });
});
