import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import Mapa from "./mapa.js";
// import Player from "./player.js"

function Juego() {
  this._scene;
  this._camera;
  this._renderer;

  this._orbitControls;
  this._directionalLight;

  this.players = [];
  this._mixer = new THREE.AnimationMixer();
  this._clock = new THREE.Clock();

  this.initGame = function () {
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
    console.log("CAMERA",this._camera)
    

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    this._orbitControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._orbitControls.target.copy(this._camera.rotation)
    this._orbitControls.enableDamping = true;
    this._orbitControls.dampingFactor = 0.25;
    this._orbitControls.screenSpacePanning = false;
    this._orbitControls.maxPolarAngle = Math.PI / 2.06;

    document.getElementById("juego").appendChild(this._renderer.domElement);

    this._directionalLight = new THREE.AmbientLight(0xffffff, 5.5);
    this._directionalLight.position.set(0, 1, 0);
    this.addToScene(this._directionalLight);
    this.createCharacter();
  };

  this.addToScene = function (object) {
    this._scene.add(object);
  };

  //AÑADIR AL JUGADOR
  // this.addPlayer = function (player){
  //   const playerModel = new Player(); //carga de modelo
  //   const playerObj = {
  //     player:player,
  //     model:playerModel
  //   }
  //   this.players.push(playerObj);
  //   this.addToScene(playerModel);
  // }

  this.onWindowResize = function () {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(window.innerWidth, window.innerHeight);
  };

  this.createCharacter = function () {
    const player = new FBXLoader();
    console.log(this._mixer);
    player.load("./cliente/juego/public/models/playerIdle.fbx", (object) => {
      object.scale.set(0.1, 0.1, 0.1);
      object.position.set(10, 0, 0);
      console.log(object);
      const animation = object.animations.find(
        (anim) => anim.name === "mixamo.com"
      );
      console.log(animation);
      this._mixer = new THREE.AnimationMixer(object);
      const action = this._mixer.clipAction(animation);
      action.play();
      // const action = this._mixer.clipAction(animation);
      // action.play();
      this.addToScene(object);
    });
  };

  this.animate = function () {
    this._orbitControls.update();
    this._mixer.update(this._clock.getDelta());
    requestAnimationFrame(this.animate.bind(this));
    this._renderer.render(this._scene, this._camera);
  };
}

const juego = new Juego();
juego.initGame();

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
