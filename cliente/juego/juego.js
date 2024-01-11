import Mapa from "./mapa.js";
import Player from "./player.js";

export default class Juego {
  constructor() {
    this._canvas = null;
    this._engine = null;
    this._scene = null;
    this._camera = null;
    this._light = null;
    this._players = {};
  }

  initGame = async function () {
    this._canvas = document.getElementById("juego");
    console.log("CANVAS", this._canvas);
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._scene = new BABYLON.Scene(this._engine);
    this._camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      BABYLON.Vector3.Zero(),
      this._scene
    );
    this._camera.attachControl(this._canvas, true);
    this._camera.upperBetaLimit = Math.PI / 2.15;

    this._camera.position = new BABYLON.Vector3(0, 50, 0);
    this._camera.target = new BABYLON.Vector3(0, 0, 0); // Ajusta el punto al que la cámara apunta

    console.log("CAMERA", this._camera);

    this._light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this._scene
    );

    const havokInstance = await HavokPhysics();
    this._hk = new BABYLON.HavokPlugin(true, havokInstance);
    console.log("Havok", this._hk);
    this._scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), this._hk);
  };

  startRenderingLoop = function () {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  };

  addToScene = function (object) {
    this._scene.add(object);
  };

  addPlayer = async function (code, player, equipo) {
    let character;
    if (!this._players[player.email]) {
      character = new Player();
    } else {
      character = this._players[player.email].character;
      console.log("character", character);
    }

    await character.initPlayer(this, player, equipo, function (obj) {
      console.log("OBJETO", obj);
      const playerObj = {
        user: player,
        character: character,
      };
  
      juego._players[player.email] = playerObj;
      console.log("THIS PLAYERS", juego._players);
      console.log("PLAYER OBJ", playerObj.character);
      socket.emit("playerCreado", {
        code: code,
        player: player,
        equipo: equipo,
        position: juego._players[player.email].character._actualPosition,
      });
    });
   
    
  };

  addOtherPlayer = function (player, equipo, position) {
    
    console.log(
      "PLAYERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      player,
      equipo,
      position
    );
    console.log("AISDJIASJDIAJSIDJAISDIJASD", this._players);
    console.log("!this._players[player.email]", !this._players[player.email]);
    let character;
    if (!this._players[player.email]) {
      console.log("NO TABA");
      character = new Player();
      character.addPlayer(this, player, equipo, position);
    } else {
      console.log("SI TABA");
      character = this._players[player.email].character;
    }

    
    console.log("CHARACTER", character);

    const playerObj = {
      user: player,
      character: character,
    };

    this._players[player.email] = playerObj;
    console.log("THIS PLAYERS", this._players);
  };

  removePlayer = function (code,player, equipo) {
    console.log("REMOVE PLAYER", this._players);
    console.log("PLAYER", player);
    if (this._players[player.email]) {
      this._players[player.email].character.remove();
      socket.emit("playerEliminado", {
        code: code,
        player: player,
        equipo: equipo})
    }
  };

  removeOtherPlayer = function (player, equipo) {
    console.log("REMOVE OTHER PLAYER", this._players);
    console.log("PLAYER", player);
    if (this._players[player.email]) {
      this._players[player.email].character.remove();
    }
  };
}
window.addEventListener("resize", function () {
  juego._engine.resize();
});

const juego = new Juego();
setTimeout(() => {
  juego.initGame();
  juego.startRenderingLoop();
  window.juego = juego;

  const mapa = new Mapa();
  mapa.initMap(juego._scene);
}, 1000);

// const ball = new FBXLoader();
// ball.load("./cliente/juego/public/ball.fbx", function (object) {
//   object.scale.set(0.01, 0.01, 0.01);
//   object.position.set(0, 4, 0);
//   object.remove(object.children[0]);
//   console.log(object);
//   scene.add(object);
// });
