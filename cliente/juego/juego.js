import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import Mapa from "./mapa.js";
import Player from "./player.js";

export default class Juego {
  constructor() {
    this._scene = null;
    this._camera = null;
    this._renderer = null;

    this._orbitControls = null;
    this._directionalLight = null;

    this.players = [];
    this._mixer = new THREE.AnimationMixer();
    this._clock = new THREE.Clock();
  }

  initGame = function () {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // this._camera.rotation.set(0, 0, Math.PI / 2);
    this._camera.position.set(0, 450, 0);
    this._camera.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    console.log("CAMERA", this._camera);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    this._orbitControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._orbitControls.target.copy(this._camera.rotation);
    this._orbitControls.enableDamping = true;
    this._orbitControls.dampingFactor = 0.25;
    this._orbitControls.screenSpacePanning = false;
    this._orbitControls.maxPolarAngle = Math.PI / 2.06;

    document.getElementById("juego").appendChild(this._renderer.domElement);

    this._directionalLight = new THREE.AmbientLight(0xffffff, 5.5);
    this._directionalLight.position.set(0, 1, 0);
    this.addToScene(this._directionalLight);
    // this.createCharacter();
  };

  addToScene = function (object) {
    this._scene.add(object);
  };

  //AÑADIR AL JUGADOR
  addPlayer = function (player, equipo) {
    let playerModel
    //FIX
    for (let clave of this.players) {
      if (clave.player.email === player.email) {
        playerModel = clave.model;
      }
    }
    
    if (!playerModel) playerModel = new Player();

    playerModel.initPlayer(this, player, equipo);
    const playerObj = {
      player: player,
      model: playerModel,
    };
    this.players.push(playerObj);
    console.log("this.players", this.players);
  };

  removePlayer = function (player) {
    for (let clave of this.players) {
      if (clave.player.email === player.email) {
        clave.model.removeModel(this._scene);
      }
    }
  };

  onWindowResize = function () {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = function () {
    this._orbitControls.update();
    this.players.forEach((player) => {
      // console.log("player", player)
      if (player.model._model && player.model._mixer) {
        player.model._mixer.update(this._clock.getDelta());
      }
    });
    requestAnimationFrame(this.animate.bind(this));
    this._renderer.render(this._scene, this._camera);
  };
}

const juego = new Juego();
juego.initGame();
window.juego = juego;

const mapa = new Mapa();
mapa.initMap(juego._scene);

juego.animate();

window.addEventListener("resize", function () {
  juego.onWindowResize();
});
// const ball = new FBXLoader();
// ball.load("./cliente/juego/public/ball.fbx", function (object) {
//   object.scale.set(0.01, 0.01, 0.01);
//   object.position.set(0, 4, 0);
//   object.remove(object.children[0]);
//   console.log(object);
//   scene.add(object);
// });
