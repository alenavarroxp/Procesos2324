const modelo = require("./modelo.js");

describe("El sistema", function () {
  let sistema;

  beforeEach(function () {
    sistema = new modelo.Sistema(true);
  });

  it("inicialmente no hay usuarios", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
  });

  it("agrega un usuario", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe"]);
    expect(sistema.usuarioActivo("pepe")).toEqual({ activo: true });
    expect(sistema.usuarios["pepe"].nick).toEqual("pepe");
  });

  it("obtener todos usuarios", function () {
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    expect(sistema.obtenerTodosNicks()).toEqual([]);
    sistema.agregarUsuario("pepe");
    sistema.agregarUsuario("juan");
    expect(sistema.numeroUsuarios()).toEqual({ num: 2 });
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe", "juan"]);
  });

  it("usuario activo", function () {
    sistema.agregarUsuario("pepe");
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
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    sistema.eliminarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
  });

  it("numero usuarios", function () {
    expect(sistema.usuarios).toEqual({});
    expect(sistema.numeroUsuarios()).toEqual({ num: 0 });
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
    sistema.agregarUsuario("juan");
    expect(sistema.numeroUsuarios()).toEqual({ num: 2 });
  });

  describe("Métodos que acceden a datos", function () {
    let usrTest = {"email":"test@test.es","nick":"test"};

    beforeEach(function (done) {
      sistema.cad.conectar(function () {
        sistema.registrarUsuario(usrTest),function(res){
          sistema.confirmarUsuario(usrTest.email,function(){
            done()
          })
        }
        done();
      });
    });

    xit("Inicio de sesión correcto",function(done){
      sistema.iniciarSesion(usrTest,function(res){
        expect(res.email).toEqual(-1);
        done();
      })
    })

    xit("Inicio de sesión incorrecto",function(){

    })
  });
});
