import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js";
class Player {
  constructor() {
    this._player = null;
    this._model = null;
    this._mixer = null;
    this._savePosition = {};
    this._direction = new THREE.Vector3(0, 0, -1);
    this._movementSpeed = 0.002;
    this._rotationSpeed = 0.0001;
    this._euler = new THREE.Euler(0, 0, 0, "YXZ");
    this._keysPressed = {};
    this._animationRunning = false;
    this._isPlayerRunning = false;
    this._prevTime = null;
  }

  initPlayer = (juego, code, player, equipo) => {
    this._player = player;
    this._model = new FBXLoader();
    this._model.load(
      "./cliente/juego/public/models/playerIdle.fbx",
      (object) => {
        object.scale.set(0.1, 0.1, 0.1);

        if (equipo == "equipoAzul") {
          object.rotation.set(0, Math.PI / 2, 0);
          if (
            this._savePosition.equipoAzul &&
            this._savePosition.equipoAzul.equipo == equipo
          ) {
            object.position.set(
              this._savePosition.equipoAzul.position.x,
              this._savePosition.equipoAzul.position.y,
              this._savePosition.equipoAzul.position.z
            );
          } else {
            let x = Math.floor(Math.random() * (-10 - -165) + -165);
            let z = Math.floor(Math.random() * (90 - -90) + -90);
            object.position.set(x, 0, z);
            const saveB = { equipo: equipo, position: object.position };
            this._savePosition.equipoAzul = saveB;
          }
        } else if (equipo == "equipoRojo") {
          object.rotation.set(0, -Math.PI / 2, 0);
          if (
            this._savePosition.equipoRojo &&
            this._savePosition.equipoRojo.equipo == equipo
          ) {
            object.position.set(
              this._savePosition.equipoRojo.position.x,
              this._savePosition.equipoRojo.position.y,
              this._savePosition.equipoRojo.position.z
            );
          } else {
            //Quiero que vaya la X de 10 a 165
            //Quiero que vaya la Z de -90 a 90
            let x = Math.floor(Math.random() * (165 - 10) + 10);
            let z = Math.floor(Math.random() * (90 - -90) + -90);
            object.position.set(x, 0, z);
            const saveR = { equipo: equipo, position: object.position };
            this._savePosition.equipoRojo = saveR;
          }
        }
        // console.log(object);
        const animation = object.animations.find(
          (anim) => anim.name === "mixamo.com"
        );
        // console.log(animation);
        this._mixer = new THREE.AnimationMixer(object);
        const action = this._mixer.clipAction(animation);
        // console.log("action", action);
        action.play();
        this._model = object;
        console.log("PLAYER", this);
        console.log("CODE", code);
        let player = this;
        console.log("player", player._model);
        try {
          socket.emit("playerCreado", {
            code: code,
            player: player._player,
            position: player._model.position,
            equipo: equipo,
          });
        } catch (e) {
          console.log("error", e);
        }
        juego.addToScene(object);
      }
    );
  };

  renderOtherPlayer = function (juego, player, position, equipo) {
    this._player = player;
    this._model = new FBXLoader();
    this._model.load(
      "./cliente/juego/public/models/playerIdle.fbx",
      (object) => {
        object.scale.set(0.1, 0.1, 0.1);
        if (!position) return;
        if (equipo == "equipoAzul") {
          object.rotation.set(0, Math.PI / 2, 0);
          object.position.set(position.x, position.y, position.z);
        } else if (equipo == "equipoRojo") {
          object.rotation.set(0, -Math.PI / 2, 0);
          object.position.set(position.x, position.y, position.z);
        }

        const animation = object.animations.find(
          (anim) => anim.name === "mixamo.com"
        );
        this._mixer = new THREE.AnimationMixer(object);
        const action = this._mixer.clipAction(animation);
        action.play();
        this._model = object;
        juego.addToScene(object);
      }
    );
  };

  removeModel = function (scene, equipo) {
    if (this._model) {
      console.log("removeModel", this._model);
      console.log("equipo", equipo);
      if (equipo == "equipoAzul") {
        console.log("savePositionAzul", this._savePosition);
        this._savePosition.equipoAzul.position = this._model.position;
      } else if (equipo == "equipoRojo") {
        console.log("savePositionRojo", this._savePosition);
        this._savePosition.equipoRojo.position = this._model.position;
      }
      scene.remove(this._model);
    }
  };

  movePlayer = function (player) {
    if (this._player == player) {
      this._prevTime = performance.now();
      const handleKeyDown = (event) => {
        this._keysPressed[event.code] = true;
        if (!this._animationRunning) {
          this._animationRunning = true;
          this._prevTime = performance.now();
          requestAnimationFrame(update);
        }
        if (event.code == "ShiftLeft") {
          this._isPlayerRunning = true;
        }
      };

      const handleKeyUp = (event) => {
        this._keysPressed[event.code] = false;
        // Puedes detener la animación cuando todas las teclas están liberadas
        if (
          !this._keysPressed["KeyW"] &&
          !this._keysPressed["KeyA"] &&
          !this._keysPressed["KeyS"] &&
          !this._keysPressed["KeyD"]
        ) {
          this._animationRunning = false;
        }
        if (event.code == "ShiftLeft") {
          this._isPlayerRunning = false;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      const update = (currentTime) => {
        if (this._animationRunning) {
          let deltaTime = (currentTime - this._prevTime) / 1000;
          this._prevTime = currentTime;
          if (deltaTime == 0) return;
          if (this._isPlayerRunning) deltaTime += 275;
          else deltaTime += 100;

          if (this._keysPressed["KeyW"]) {
            this._model.translateOnAxis(
              this._direction,
              -this._movementSpeed * deltaTime
            );
          }
          if (this._keysPressed["KeyS"]) {
            this._model.translateOnAxis(
              this._direction,
              this._movementSpeed * deltaTime
            );
          }
          if (this._keysPressed["KeyA"]) {
            this._euler.setFromQuaternion(this._model.quaternion);
            this._euler.y += this._rotationSpeed * deltaTime;
            this._model.setRotationFromEuler(this._euler);
          }
          if (this._keysPressed["KeyD"]) {
            this._euler.setFromQuaternion(this._model.quaternion);
            this._euler.y -= this._rotationSpeed * deltaTime;
            this._model.setRotationFromEuler(this._euler);
          }

          // Si hay teclas presionadas, sigue ejecutando el bucle
          requestAnimationFrame((time) => update(time));
        }
      };

      update(performance.now());
    }
  };
}
export default Player;
