import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OBJLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js";

// Crear una escena con Three.js
const scene = new THREE.Scene();

// Crear una cámara con Three.js
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(342, 207, -202);
camera.rotation.set(Math.PI / 2, 0, Math.PI / 2);
camera.lookAt(scene.position);

// Crear un render con Three.js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const juego = document.getElementById("juego");
juego.appendChild(renderer.domElement);

// Crear una luz hemisférica con Three.js y ajustar su color
const directionalLight = new THREE.AmbientLight(0xffffff, 5.5); // Color blanco, intensidad 1.5
directionalLight.position.set(0, 1, 0); // Posición de la luz
scene.add(directionalLight);

// Establecer el color de fondo de la escena a negro
scene.background = new THREE.Color(0x000000);

// Crear un material con un color blanco frío y efecto de alambre
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

// Crear una geometría (por ejemplo, un cubo) con Three.js y aplicar el material
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0,0.5,0)
scene.add(cube);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  // Actualiza el tamaño de la cámara y del renderizador cuando cambia el tamaño de la ventana
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const field = new FBXLoader();
field.setPath("./cliente/juego/public/");

field.load(
  "field.fbx",
  function (object) {
    object.scale.set(0.01, 0.01, 0.01);
    object.remove(object.children[1]);
    object.remove(object.children[1]);

     // Calcula las dimensiones del modelo FBX
     const boundingBox = new THREE.Box3().setFromObject(object);
     const size = boundingBox.getSize(new THREE.Vector3());
     size.y+=60
      size.x-= 50
      size.z-= 50
     // Crea la caja hueca
     const hollowBox = new THREE.Mesh(
         new THREE.BoxGeometry(size.x, size.y, size.z),
         new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
     );
     
     // Posiciona la caja hueca en la misma posición que el modelo FBX
     hollowBox.position.set(object.position.x, object.position.y+40, object.position.z);
     
     
     scene.add(hollowBox);
    console.log(object);

    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Error de carga", error);
  }
);

const ball = new FBXLoader();
ball.load("./cliente/juego/public/ball.fbx", function (object) {
  object.scale.set(0.01, 0.01, 0.01);
  object.position.set(0, 4, 0);
  object.remove(object.children[0]);
  console.log(object);
  scene.add(object);
});



// Función de renderizado
function animate() {
  orbitControls.update();
  onWindowResize();
  requestAnimationFrame(animate);
  // console.log(camera.position)
  // Rotar el cubo para la animación
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Llamar a la función animate para iniciar la animación
animate();
