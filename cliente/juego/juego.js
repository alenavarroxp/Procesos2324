import Mapa from "./mapa.js";
import Player from "./player.js";

export default class Juego {
  constructor() {
    this._canvas = null;
    this._engine = null;
    this._scene = null;
    this._camera = null;
    this._light = null;
  }

  initGame = function () {
    this._canvas = document.getElementById("juego");
    console.log("CANVAS", this._canvas)
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
    console.log("CANVAS, ENGINE, SCENE, CAMERA", this._canvas, this._engine, this._scene, this._camera )
    this._camera.attachControl(this._canvas, true);
    this._camera.upperBetaLimit = Math.PI / 2.15;

    this._camera.position.set(0, 450, 0);
    this._camera.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    console.log("CAMERA", this._camera);

    this._light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this._scene
    );
  };

  startRenderingLoop = function () {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  };

  addToScene = function (object) {
    this._scene.add(object);
  };

  addPlayer = function (code, player, equipo) {
    let playerModel;
    console.log("this.players", this.players);
    for (let clave of this.players) {
      console.log("clave", clave);
      console.log("player", player);
      if (clave.player.email === player.email) {
        console.log("ENCONTRO UN PLAYER");
        playerModel = clave.model;
      }
    }
    console.log("this.players", this.players);

    if (!playerModel) {
      console.log("CREO UN NUEVO PLAYER");
      playerModel = new Player();
    }

    playerModel.initPlayer(this, code, player, equipo);
    const playerObj = {
      player: player,
      model: playerModel
    };

    // for (let clave of this.players) {
    //   console.log("clave", clave);
    //   console.log("player", player);
    //   if (clave.player != player) {
    //     this.players.push(playerObj);
    //     break;
    //   }
    // }
    if (this.players.length == 0) {
      console.log("IF PLAYERS", this.players);
      this.players.push(playerObj);
    }
    console.log("this.players INIT PLAYER", this.players);
  };

  addOtherPlayer = function (player, equipo, position) {
    for (let clave of this.players) {
      console.log("claveOTHER", clave);
      console.log("playerOTHER", player);
      if (
        clave.player.email == player.email &&
        clave.player.nick == player.nick
      ) {
        console.log("ENCONTRO UN PLAYER");
        return;
      }
    }
    console.log("CREO UN NUEVO PLAYER");
    console.log("position", position);
    console.log("equipo", equipo);

    let playerModel = new Player();
    playerModel.renderOtherPlayer(this, player, position, equipo);
    const playerObj = {
      player: player,
      model: playerModel
    };
    this.players.push(playerObj);
    console.log("this.players OTHER PLAYERS", this.players);
  };

  removePlayer = function (player, equipo) {
    for (let clave of this.players) {
      console.log("REMOVE PLAYER", clave.player.email, player.email);
      if (clave.player.email === player.email) {
        clave.model.removeModel(this._scene, equipo);
      }
    }
    console.log("THIS PLAYER REMOVE PLAYER", this.players);
  };


   
  
}
window.addEventListener("resize", function () {
  juego._engine.resize();
});


const juego = new Juego();
juego.initGame();
juego.startRenderingLoop();
window.juego = juego;

const mapa = new Mapa();
mapa.initMap(juego._scene);

// const ball = new FBXLoader();
// ball.load("./cliente/juego/public/ball.fbx", function (object) {
//   object.scale.set(0.01, 0.01, 0.01);
//   object.position.set(0, 4, 0);
//   object.remove(object.children[0]);
//   console.log(object);
//   scene.add(object);
// });
