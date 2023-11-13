//MIRAR COMO UTILIZAR EL THREE JS   
import * as THREE from 'three'
//CREAR UNA SCENE CON THREEJS
const scene = new THREE.Scene();
//CREAR UNA CAMARA CON THREEJS
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//CREAR UN RENDER CON THREEJS
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("juego").appendChild(renderer.domElement);

//CREAR UNA LUZ CON THREEJS
const light = new THREE.HemisphereLight(0xFFFFFF, 1, 500);
light.position.set(0, 0, 1);
scene.add(light);
//CREAR UNA FIGURA CON THREEJS
//CREAR UNA TEXTURA CON THREEJS
//CREAR UNA ANIMACION CON THREEJS
//CREAR UNA INTERACCION CON THREEJS
//CREAR UNA COLISION CON THREEJS

const juego = document.getElementById("juego");
const h1 = document.createElement("h1");
h1.innerHTML = "Juego";
juego.appendChild(h1);