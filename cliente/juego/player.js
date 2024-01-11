class Player {
  constructor() {
    this._character = null;
    this._savePosition = { equipoAzul: null, equipoRojo: null };
    this._animations = {};
    this._mesh = null;
    this._meshes = null;
    this._actualPosition = null;
  }

  initPlayer = (juego, player, equipo, callback) => {
    return new Promise((resolve, reject) => {
      console.log("PLAYER JUEGO CODIGO PLAYER EQUIPO", juego, player, equipo);
      BABYLON.SceneLoader.ImportMesh(
        "",
        "./cliente/juego/public/models/",
        "Man.glb",
        juego._scene,
        (newMeshes, particleSystems, skeletons) => {
          try {
            console.log("CREANDO MESHES EN INITPLAYER");
            console.log("mesheshuman", newMeshes);
            this._meshes = newMeshes;
            this._mesh = newMeshes[0];
            this._mesh.scaling = new BABYLON.Vector3(0.35, 0.35, 0.35);
            this._mesh.name = player.nick;

            const material = new BABYLON.StandardMaterial(
              "material",
              juego._scene
            );

            if (!this._savePosition.equipoAzul) {
              if (equipo == "equipoAzul") {
                const randomPositionX =
                  Math.floor(Math.random() * (8 - -8 + 1)) + -8;
                const randomPositionZ = Math.floor(Math.random() * 18) + 1;
                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#00bfff"
                );
                this._mesh.position = new BABYLON.Vector3(
                  randomPositionX,
                  0.75,
                  randomPositionZ
                );
                this._savePosition.equipoAzul = {
                  position: this._mesh.position,
                };
                this._actualPosition = this._mesh.position;
              }
            }
            if (!this._savePosition.equipoRojo) {
              if (equipo == "equipoRojo") {
                const randomPositionX =
                  Math.floor(Math.random() * (8 - -8 + 1)) + -8;
                const randomPositionZ =
                  Math.floor(Math.random() * (-18 - 1 + 1)) + 1;
                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#d60909"
                );
                this._mesh.position = new BABYLON.Vector3(
                  randomPositionX,
                  0.75,
                  randomPositionZ
                );
                this._mesh.rotation = new BABYLON.Vector3(0, 0, 0);
                console.log("rotation", this._mesh.rotation);
                this._savePosition.equipoRojo = {
                  position: this._mesh.position,
                };
                this._actualPosition = this._mesh.position;
              }
            }
            switch (equipo) {
              case "equipoAzul":
                var position = this._savePosition.equipoAzul.position;
                this._mesh.position = position;
                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#00bfff"
                );
                this._actualPosition = position;
                break;
              case "equipoRojo":
                var position = this._savePosition.equipoRojo.position;
                this._mesh.position = position;
                this._mesh.rotation = new BABYLON.Vector3(0, 0, 0);
                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#d60909"
                );
                this._actualPosition = position;
                break;
              default:
                break;
            }

            juego._scene.animationGroups.forEach((animationGroup) => {
              this._animations[animationGroup] = animationGroup;
              animationGroup.stop();
            });

            const IdleAnimation = juego._scene.getAnimationGroupByName(
              "HumanArmature|Man_Idle"
            );
            IdleAnimation.start(
              true,
              1.0,
              IdleAnimation.from,
              IdleAnimation.to
            );

            this._mesh.getChildMeshes().forEach((mesh) => {
              if (mesh.name == "BaseHuman_primitive0") mesh.material = material;
            });
            // var dummyPhysicsRoot = BABYLON.MeshBuilder.CreateCapsule(
            //   "dummyPhysicsRoot",
            //   { height: 2 },
            //   juego._scene
            // );
            // // object.position.y += dummyPhysicsRoot.scaling.y / 2;
            // dummyPhysicsRoot.position = object.position
            // dummyPhysicsRoot.visibility = 1;

            // var dummyAggregate = new BABYLON.PhysicsAggregate(
            //   dummyPhysicsRoot,
            //   BABYLON.PhysicsShapeType.CAPSULE,
            //   { mass: 50 },
            //   juego._scene
            // );

            juego.addToScene(this._mesh);
          } catch (err) {
            console.log("ERROR", err);
          }
          resolve();
          if (callback) {
            callback(this);
          }
        }
      );
    });
  };

  addPlayer = function (juego, player, equipo, position) {
    //Comprobar si la mesh está en la escena y si lo está, no crearla
    if(juego._scene.getMeshByName(player.nick)) return;

    console.log("ADDPLAYER EN PLAYYER JS", juego, player, equipo, position);
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./cliente/juego/public/models/",
      "Man.glb",
      juego._scene,
      (newMeshes, particleSystems, skeletons) => {
        try {
          console.log("CREANDO MESHES EN ADDPLAYER");
          this._meshes = newMeshes;
          this._mesh = newMeshes[0];
          this._mesh.scaling = new BABYLON.Vector3(0.35, 0.35, 0.35);
          this._mesh.name = player.nick;
          const material = new BABYLON.StandardMaterial(
            "material",
            juego._scene
          );

          switch (equipo) {
            case "equipoAzul":
              material.diffuseColor = new BABYLON.Color3.FromHexString(
                "#00bfff"
              );
              this._savePosition.equipoAzul = {
                position: position,
              };
              break;
            case "equipoRojo":
              material.diffuseColor = new BABYLON.Color3.FromHexString(
                "#d60909"
              );
              this._savePosition.equipoRojo = {
                position: position,
              };
              break;
            default:
              break;
          }
          this._mesh.position = {
            _x: position._x,
            _y: position._y,
            _z: position._z,
          };
          this._actualPosition = position;

          juego._scene.animationGroups.forEach((animationGroup) => {
            this._animations[animationGroup] = animationGroup;
            animationGroup.stop();
          });

          const IdleAnimation = juego._scene.getAnimationGroupByName(
            "HumanArmature|Man_Idle"
          );
          IdleAnimation.start(true, 1.0, IdleAnimation.from, IdleAnimation.to);

          this._mesh.getChildMeshes().forEach((mesh) => {
            if (mesh.name == "BaseHuman_primitive0") mesh.material = material;
          });
          juego.addToScene(this._mesh);
        } catch (err) {}
      }
    );
  };

  remove = function () {
    this._meshes.forEach((mesh) => {
      console.warn("mesh", mesh);
      mesh.dispose();
    });
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
