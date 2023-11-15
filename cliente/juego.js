import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

// Crear una escena con Three.js
const scene = new THREE.Scene();

// Crear una cámara con Three.js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// Crear un render con Three.js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const juego = document.getElementById("juego");
juego.appendChild(renderer.domElement);

// Crear una luz hemisférica con Three.js y ajustar su color
const light = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Establecer el color de fondo de la escena a negro
scene.background = new THREE.Color(0x000000);

// Crear un material con un color blanco frío para los objetos
const material = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });

// Crear una geometría (por ejemplo, un cubo) con Three.js y aplicar el material
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    // Actualiza el tamaño de la cámara y del renderizador cuando cambia el tamaño de la ventana
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
// Función de renderizado
function animate() {
    orbitControls.update()
    onWindowResize()
    requestAnimationFrame(animate);

    // Rotar el cubo para la animación
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Llamar a la función animate para iniciar la animación
animate();
