const modelo = require("./modelo.js");

describe("El sistema", function () {
  let sistema;

  beforeEach(function () {
    sistema = new modelo.Sistema();
  });

  it("inicialmente no hay usuarios", function () {
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it("agrega un usuario", function () {
    expect(sistema.numeroUsuarios()).toEqual(0);
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual(1);
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe"]);
    expect(sistema.usuarioActivo("pepe")).toEqual(true);
    expect(sistema.usuarios["pepe"].nick).toEqual("pepe");
  });

  it("obtener todos usuarios", function () {
    expect(sistema.numeroUsuarios()).toEqual(0);
    expect(sistema.obtenerTodosNicks()).toEqual([]);
    sistema.agregarUsuario("pepe");
    sistema.agregarUsuario("juan");
    expect(sistema.numeroUsuarios()).toEqual(2);
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe", "juan"]);
  });

  it("usuario activo", function () {
    sistema.agregarUsuario("pepe");
    expect(sistema.usuarioActivo("pepe")).toBe(true);
    expect(sistema.obtenerTodosNicks()).toEqual(["pepe"]);
    expect(sistema.numeroUsuarios()).toEqual(1);
    sistema.eliminarUsuario("pepe");
    expect(sistema.usuarioActivo("pepe")).toBe(false);
    expect(sistema.obtenerTodosNicks()).toEqual([]);
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it("eliminar usuario", function () {
    expect(sistema.numeroUsuarios()).toEqual(0);
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual(1);
    sistema.eliminarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it("numero usuarios", function () {
    expect(sistema.usuarios).toEqual({});
    expect(sistema.numeroUsuarios()).toEqual(0);
    sistema.agregarUsuario("pepe");
    expect(sistema.numeroUsuarios()).toEqual(1);
    sistema.agregarUsuario("juan");
    expect(sistema.numeroUsuarios()).toEqual(2);
  });
});
