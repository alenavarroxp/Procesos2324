import * as THREE from "./node_modules/three/build/three.module.js";

// Crear una escena con Three.js
const scene = new THREE.Scene();

// Crear una cámara con Three.js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Crear un render con Three.js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const juego = document.getElementById("juego");
juego.appendChild(renderer.domElement);

// Crear una luz hemisférica con Three.js y ajustar su color
const light = new THREE.HemisphereLight(0x404040, 0x404040, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Establecer el color de fondo de la escena a negro
scene.background = new THREE.Color(0x000000);

// Crear un material con un color blanco frío para los objetos
const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, flatShading: true });

// Crear una geometría (por ejemplo, un cubo) con Three.js y aplicar el material
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Función de renderizado
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cubo para la animación
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Llamar a la función animate para iniciar la animación
animate();
