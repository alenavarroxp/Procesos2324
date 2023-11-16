import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js";

function Mapa() {
  this._field;
  this._hollowBox;
  this._goalBox = {};

  this.initMap = function (scene) {
    this._field = new FBXLoader();
    this.createMap(scene);
  };

  this.createMap = function (scene) {
    this._field.load(
      "./cliente/juego/public/models/field.fbx",
      (object) => {
        object.scale.set(0.01, 0.01, 0.01);
        object.remove(object.children[1]);
        object.remove(object.children[1]);

        this.createBounding(scene, object);

        scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error de carga", error);
      }
    );
  };

  this.createBounding = function (scene, object) {
    // Calcula las dimensiones del modelo FBX
    const boundingBox = new THREE.Box3().setFromObject(object);
    const size = boundingBox.getSize(new THREE.Vector3());
    size.y += 60;
    size.x -= 50;
    size.z -= 50;
    // Crea la caja hueca
    this._hollowBox = new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
    );

    // Posiciona la caja hueca en la misma posición que el modelo FBX
    this._hollowBox.position.set(
      object.position.x,
      object.position.y + 40,
      object.position.z
    );

    scene.add(this._hollowBox);
    this.createGoalBounding(scene, object, "left");
    this.createGoalBounding(scene, object, "right");
  };

  this.createGoalBounding = function (scene, object, direction) {
    const boundingBox = new THREE.Box3();
    const size = boundingBox.getSize(new THREE.Vector3());
    size.y += 20;
    size.x -= 3;
    size.z -= 27;

    const goalBox = new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshBasicMaterial({ wireframe: true, color: 0x0000ff })
    );

    let offset = direction === "left" ? -170.5 : 170.5;

    goalBox.position.set(
      object.position.x + offset,
      object.position.y + 10,
      object.position.z
    );

    this._goalBox[direction] = goalBox;

    scene.add(this._goalBox[direction]);
  };
}

export default Mapa;
