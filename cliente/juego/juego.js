import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import Mapa from "./mapa.js";

function Juego() {
  this._scene;
  this._camera;
  this._renderer;

  this._orbitControls;
  this._directionalLight;

  this.initGame = function () {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._camera.position.set(342, 207, -202);
    this._camera.lookAt(this._scene.position);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    this._orbitControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    this._orbitControls.enableDamping = true; 
    this._orbitControls.dampingFactor = 0.25;
    this._orbitControls.screenSpacePanning = false;
    this._orbitControls.maxPolarAngle = (Math.PI / 2.06);
   

    document.getElementById("juego").appendChild(this._renderer.domElement);

    this._directionalLight = new THREE.AmbientLight(0xffffff, 5.5);
    this._directionalLight.position.set(0, 1, 0);
    this.addToScene(this._directionalLight);
  };

  this.addToScene = function (object) {
    this._scene.add(object);
  };

  this.onWindowResize = function () {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(window.innerWidth, window.innerHeight);
  };

  this.animate = function () {
    this._orbitControls.update();
    this.onWindowResize();
    requestAnimationFrame(this.animate.bind(this));
    this._renderer.render(this._scene, this._camera);
  };
}

const juego = new Juego();
juego.initGame();

const mapa = new Mapa();
mapa.initMap(juego._scene);

juego.animate()

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
