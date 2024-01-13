class Player {
  constructor() {
    this._character = null;
    this._savePosition = { equipoAzul: null, equipoRojo: null };
    this._animations = {};
    this._mesh = null;
    this._meshes = null;
    this._actualPosition = null;
    this._speed = 0.1;
    this._actualEquipo = null;
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
                const randomPositionZ =
                  Math.floor(Math.random() * (18 - 2 + 1)) + 2;

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
                  Math.floor(Math.random() * (-18 - 2 + 1)) + 2;

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
    if (juego._scene.getMeshByName(player.nick)) return;

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
              this._mesh.rotation = new BABYLON.Vector3(0, 0, 0);
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

  setEquipo = function (equipo) {
    this._actualEquipo = equipo;
  };

  moveForward = function (characters, juego) {
    const newPosition = this._mesh.position.clone();
    newPosition.z += this._speed;

    if (this.checkCollisions(newPosition, characters)) {
      this._mesh.position.z = newPosition.z;
      this.smoothRotation(Math.PI, juego);
    }
  };

  moveBackward = function (characters, juego) {
    const newPosition = this._mesh.position.clone();
    newPosition.z -= this._speed;

    if (this.checkCollisions(newPosition, characters)) {
      this._mesh.position.z = newPosition.z;
      this.smoothRotation(0, juego);
    }
  };

  moveLeft = function (characters, juego) {
    const newPosition = this._mesh.position.clone();
    newPosition.x -= this._speed;

    if (this.checkCollisions(newPosition, characters)) {
      this._mesh.position.x = newPosition.x;
      this.smoothRotation(Math.PI / 2, juego);
    }
  };

  moveRight = function (characters, juego) {
    const newPosition = this._mesh.position.clone();
    newPosition.x += this._speed;

    if (this.checkCollisions(newPosition, characters)) {
      console.log("NEW POSITION", this._mesh.position);
      this._mesh.position.x = newPosition.x;
      console.log("NEW POSITION d", this._mesh.position);
      this.smoothRotation(-Math.PI / 2, juego);
    }
  };

  //Colisiones
  checkCollisions = function (newPosition, characters) {
    // Verificar colisiones con el plano
    if (newPosition.y < 0) return true; // Colisión con el suelo, no permitir mover más abajo

    console.log("CHARACTERS COLISSIONES", characters);
    // Verificar colisiones con otros personajes
    for (const character in characters) {
      console.log("CHARACTER", character);
      if (
        characters.hasOwnProperty(character) &&
        this._mesh.name != characters[character].nick
      ) {
        const valor = characters[character];
        console.log("VALOR", valor);
        const distanceVector = newPosition.subtract(
          valor.character._mesh.position
        );
        const distance = distanceVector.length();

        // Detener el movimiento si hay colisión con otro personaje
        if (distance < 1.5) {
          return true;
        }
      }
    }
    return false; // No hay colisiones
  };

  //Rotación suave
  smoothRotation = function (targetRotation,juego) {
    this._meshes.forEach((mesh) => {
      const currentRotation = mesh.rotation.z * (180 / Math.PI); // Convertir radianes a grados
      const targetRotationDegrees = targetRotation * (180 / Math.PI);

      const shortestDistance = this.shortestAngleDistance(
        currentRotation,
        targetRotationDegrees
      );
      const lerpedRotation = this.lerpAngle(
        currentRotation,
        currentRotation + shortestDistance,
        0.1
      );

      mesh.rotation.z = lerpedRotation * (Math.PI / 180); // Convertir grados a radianes
    });
  };
  shortestAngleDistance = function (a, b) {
    const maxAngle = 360; // El máximo valor para ángulos en grados
    const angleDiff = (b - a + maxAngle) % maxAngle;
    return angleDiff > 180 ? angleDiff - maxAngle : angleDiff;
  };

  lerpAngle = function (a, b, t) {
    const angleDiff = b - a;

    // Ajustar el ángulo a un rango [-PI, PI]
    if (angleDiff > Math.PI) {
      b -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
      b += 2 * Math.PI;
    }

    // Realizar la interpolación lineal
    return a + t * (b - a);
  };
  

}
export default Player;
