class Player {
  constructor() {
    this._character = null;
    this._savePosition = null;
  }

  initPlayer = (juego, player, equipo) => {
    console.log("PLAYER JUEGO CODIGO PLAYER EQUIPO", juego, player, equipo);
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./cliente/juego/public/models/",
      "Man.glb",
      juego._scene,
      (newMeshes, particleSystems, skeletons) => {
        console.log("mesheshuman", newMeshes);
        const object = newMeshes[0];
        object.scaling = new BABYLON.Vector3(0.35, 0.35, 0.35);
        
        if (!this._savePosition) {
          const randomPositionX = Math.floor(Math.random() * 10) + 1;
          const randomPositionZ = Math.floor(Math.random() * 10) + 1;
          if (equipo == "equipoAzul") {
            object.position = new BABYLON.Vector3(
              randomPositionX,
              0.75,
              randomPositionZ
            );
          }
        }

        try {
          juego.addToScene(object);
        } catch (err) {}
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
