class Player {
  constructor() {
    this._character = null;
    this._savePosition = { equipoAzul: null, equipoRojo: null };
    this._animations = {};
    this._mesh = null;
    this._meshes = null;
    this._actualPosition = null;
    this._actualRotation = null;
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
            this._skeletons = skeletons;
            console.log("skeletons", skeletons);
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
                  0.55,
                  randomPositionZ
                );
                this._savePosition.equipoAzul = {
                  position: this._mesh.position.clone(),
                  rotation: this._mesh.rotation.clone(),
                };
                this._actualPosition = this._mesh.position;
              }
            }
            if (!this._savePosition.equipoRojo) {
              if (equipo == "equipoRojo") {
                const randomPositionX =
                  -1 * (Math.floor(Math.random() * (8 - -8 + 1)) + -8);
                const randomPositionZ =
                  -1 * (Math.floor(Math.random() * (18 - 2 + 1)) + 2);

                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#d60909"
                );
                this._mesh.position = new BABYLON.Vector3(
                  randomPositionX,
                  0.55,
                  randomPositionZ
                );
                console.log("rotation", this._mesh.rotation);

                this._savePosition.equipoRojo = {
                  position: this._mesh.position.clone(),
                  rotation: this._mesh.rotation.clone(),
                };
                this._actualPosition = this._mesh.position;
              }
            }
            switch (equipo) {
              case "equipoAzul":
                // var position = this._savePosition.equipoAzul.position;
                // this._mesh.position = position;

                this._mesh.rotationQuaternion = new BABYLON.Quaternion(
                  0,
                  1,
                  0,
                  0
                );

                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#00bfff"
                );
                // this._actualPosition = position;
                this._actualRotation = this._mesh.rotationQuaternion.clone(); // Guarda la rotación como un cuaternión
                break;
              case "equipoRojo":
                // var position = this._savePosition.equipoRojo.position;
                // this._mesh.position = position;
                this._mesh.rotationQuaternion = new BABYLON.Quaternion(
                  0,
                  0,
                  0,
                  0
                );

                material.diffuseColor = new BABYLON.Color3.FromHexString(
                  "#d60909"
                );
                // this._actualPosition = position;
                this._actualRotation = this._mesh.rotationQuaternion.clone(); // Guarda la rotación como un cuaternión
                break;
              default:
                break;
            }

            juego._scene.animationGroups.forEach((animationGroup) => {
              this._animations[animationGroup] = animationGroup;
              // animationGroup.normalize(0, 52.5)
              animationGroup.stop();
            });

            const IdleAnimation = juego._scene.getAnimationGroupByName(
              "HumanArmature|Man_Idle"
            );

            IdleAnimation.start(
              true,
              1.0,
              IdleAnimation.from,
              IdleAnimation.to,
              false
            );

            this._mesh.getChildMeshes().forEach((mesh) => {
              if (mesh.name == "BaseHuman_primitive0") mesh.material = material;
            });

            console.log("THIS CRAER PERSONAJS", this);
            juego.addToScene(this._mesh);
          } catch (err) {}
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
              this._mesh.rotationQuaternion = new BABYLON.Quaternion(
                0,
                1,
                0,
                0
              );
              break;
            case "equipoRojo":
              material.diffuseColor = new BABYLON.Color3.FromHexString(
                "#d60909"
              );
              this._mesh.rotationQuaternion = new BABYLON.Quaternion(
                0,
                0,
                0,
                0
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
          this._actualRotation = this._mesh.rotation;
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
            IdleAnimation.to,
            false
          );

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

  //   playAnimation = function (scene) {
  //     if (this._isMoving) {
  //       scene.stopAnimation(this._mesh, this._walkAnimation)
  //         this._walkAnimation.start(true, 1.0, this._walkAnimation.from, this._walkAnimation.to);

  //         // console.log("CORRIENDO this walk animation", this._walkAnimation)
  //     } else {
  //       scene.stopAnimation(this._mesh, this._walkAnimation)
  //         this._walkAnimation.stop();
  //         // console.log(" NO CORRIENDO this walk animation", this._walkAnimation)
  //     }
  // };

  moveForwardAndBackward = function (characters, juego, direccion, ball) {
    console.log("this", this);
    let angle;
    const newPosition = this._mesh.position.clone();
    switch (this._actualEquipo) {
      case "equipoAzul":
        if (direccion == "W") {
          newPosition.z -= this._speed;
          angle = 0;
        } else if (direccion == "S") {
          newPosition.z += this._speed;
          angle = Math.PI;
        }
        break;
      case "equipoRojo":
        if (direccion == "W") {
          newPosition.z += this._speed;
          angle = 0;
        } else if (direccion == "S") {
          newPosition.z -= this._speed;
          angle = Math.PI;
        }
        break;
      default:
        break;
    }

    if (
      !this.checkCollisions(newPosition, characters) &&
      !this.checkCollisionsMap(newPosition, juego._elementMap)
    ) {
      this._mesh.position.z = newPosition.z;
      this.smoothRotation(angle, juego);
      this.calculateCameraPosition(juego);
      if (this.shootBall(ball, juego)) {
        console.log("SHOOT BALL");
        ball.shootBall(this, juego);
      }
    }
  };

  moveLeftAndRight = function (characters, juego, direccion, ball) {
    let angle;
    const newPosition = this._mesh.position.clone();
    switch (this._actualEquipo) {
      case "equipoAzul":
        if (direccion == "A") {
          newPosition.x += this._speed;
          angle = -Math.PI / 2;
        } else if (direccion == "D") {
          newPosition.x -= this._speed;
          angle = Math.PI / 2;
        }
        break;
      case "equipoRojo":
        if (direccion == "A") {
          newPosition.x -= this._speed;
          angle = -Math.PI / 2;
        } else if (direccion == "D") {
          newPosition.x += this._speed;
          angle = Math.PI / 2;
        }
        break;
      default:
        break;
    }

    if (
      !this.checkCollisions(newPosition, characters) &&
      !this.checkCollisionsMap(newPosition, juego._elementMap)
    ) {
      this._mesh.position.x = newPosition.x;
      this.smoothRotation(angle, juego);
      this.calculateCameraPosition(juego);
      if (this.shootBall(ball, juego)) {
        console.log("SHOOT BALL");
        ball.shootBall(this, juego);
      }
    }
  };

  //Colisiones
  checkCollisions = function (newPosition, characters) {
    // Verificar colisiones con el plano
    if (newPosition.y < 0) return true; // Colisión con el suelo, no permitir mover más abajo

    console.log("CHARACTERS COLISSIONES", characters);
    //COGER LOS CHARACTERS MENOS EL PROPIO
    const charactersArray = Object.values(characters);
    const charactersArrayWithoutMe = charactersArray.filter((character) => {
      console.log("character", character);
      return character.user.nick != this._mesh.name;
    });
    console.log("ARRAY CHARACTERS", charactersArray);
    console.log("CHARACTER COLISSIONE MENOS YO", charactersArrayWithoutMe);
    // Verificar colisiones con otros personajes
    for (const character in charactersArrayWithoutMe) {
      console.log("CHARACTER", character);
      console.log("CHARACTERS sin mi", charactersArrayWithoutMe[character]);
      console.log("CHARACTERS", characters);
      if (
        charactersArrayWithoutMe.hasOwnProperty(character) &&
        this._mesh.name != charactersArrayWithoutMe[character].user.nick
      ) {
        const valor = charactersArrayWithoutMe[character];
        console.log("VALOR", valor.character._actualPosition);
        console.log(
          "VALOR CHARACTER MES POSITION",
          valor.character._mesh.position
        );
        console.log("newPOSITION;", newPosition);
        const distanceVector = newPosition.subtract(
          valor.character._mesh.position
        );
        console.log("DISTANCEVECTOR", distanceVector);
        const distance = distanceVector.length();
        console.log("DISTANCE", distance);

        // Detener el movimiento si hay colisión con otro personaje
        if (distance < 0.4) {
          return true;
        }
      }
    }
    return false; // No hay colisiones
  };

  checkCollisionsMap = function (newPosition, elementosMapa) {
    for (const elemento in elementosMapa) {
      if (elementosMapa.hasOwnProperty(elemento)) {
        const pared = elementosMapa[elemento];

        if (pared.name.includes("wall")) {
          const paredPosition = pared.position;
          const paredDimensions =
            pared.getBoundingInfo().boundingBox.extendSize;

          //QUIERO COMPROBAR SI LA PARED ESTA ROTADA y EN EL CASO DE QUE LO ESTE, COMPROBAR LA COLISION CON LA PARED ROTADA
          if (pared.rotation.y !== 0) {
            if (pared.intersectsPoint(newPosition)) {
              return true;
            }
          }

          // Comprobar colisión con la pared
          if (
            newPosition.x + Number.EPSILON >=
              paredPosition.x - paredDimensions.x &&
            newPosition.x - Number.EPSILON <=
              paredPosition.x + paredDimensions.x &&
            newPosition.y + Number.EPSILON >=
              paredPosition.y - paredDimensions.y &&
            newPosition.y - Number.EPSILON <=
              paredPosition.y + paredDimensions.y &&
            newPosition.z + Number.EPSILON >=
              paredPosition.z - paredDimensions.z &&
            newPosition.z - Number.EPSILON <=
              paredPosition.z + paredDimensions.z
          ) {
            return true; // Hay colisión
          }
        }
      }
    }
    return false; // No hay colisiones
  };

  smoothRotation = function (targetRotation, juego) {
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

      // Limitar la rotación a un máximo de 360 grados
      const limitedRotation = lerpedRotation % 360;

      mesh.rotation.z =
        (limitedRotation < 0 ? limitedRotation + 360 : limitedRotation) *
        (Math.PI / 180); // Convertir grados a radianes
    });

    this._actualRotation = this._mesh.rotation;
  };

  shortestAngleDistance = function (a, b) {
    const maxAngle = 360; // El máximo valor para ángulos en grados
    const angleDiff = (b - a + maxAngle) % maxAngle;
    return angleDiff > 180 ? angleDiff - maxAngle : angleDiff;
  };

  lerpAngle = function (a, b, t) {
    const angleDiff = b - a;

    if (angleDiff > Math.PI) {
      b -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
      b += 2 * Math.PI;
    }

    // Realizar la interpolación lineal
    return a + t * (b - a);
  };

  moverPersonaje = function (position, rotation) {
    // Verifica si la malla existe
    if (this._mesh) {
      // Asigna la nueva posición
      this._mesh.position = new BABYLON.Vector3(
        position._x,
        position._y,
        position._z
      );

      // Gira el personaje directamente hacia el ángulo recibido
      this.setTargetRotation(rotation._z);
    }
  };

  setTargetRotation = function (targetRotation) {
    this._meshes.forEach((mesh) => {
      mesh.rotation.z = targetRotation;
    });

    this._actualRotation = this._mesh.rotation;
  };

  //Calcula la posición de la cámara
  calculateCameraPosition = function (juego, direccion) {
    // console.log("ROTATION ACTUAL", this._actualRotation);
    // switch (direccion) {
    //   case "Left":
    //     console.log("LEFT");
    //     console.log("ROTATION ACTUAL", this._actualRotation);
    //     break;
    //   case "Right":
    //     console.log("RIGHT");
    //     console.log("ROTATION ACTUAL", this._actualRotation);
    //     break;
    // }
    // // Calcula la posición de la cámara en base a la rotación del personaje
    // const cameraX = this._actualPosition._x + Math.cos(this._actualRotation._z);
    // const cameraZ = this._actualPosition._z + Math.sin(this._actualRotation._z);
    // // Establece la posición de la cámara en la espalda del personaje
    // juego._camera.position = new BABYLON.Vector3(cameraX, 2, cameraZ);
    // console.log("CAMERA POSITION", juego._camera.position);
    // juego._camera.radius = 8;
    // juego._camera.beta = Math.PI / 5.5;
    // switch (this._actualEquipo) {
    //   case "equipoAzul":
    //     juego._camera.alpha = Math.PI / 2;
    //     break;
    //   case "equipoRojo":
    //     juego._camera.alpha = -Math.PI / 2;
    //     break;
    //   default:
    //     break;
    // }
    // console.log("MATH eje z direccion", Math.sin(this._actualRotation._z));
    // console.log("eje z direccion", this._actualPosition._z);
    // const direccions = new BABYLON.Vector3(
    //   this._actualPosition._x,
    //   this._actualPosition._y,
    //   this._actualPosition._z - Math.sin(this._actualRotation._z)
    // );
    // console.log("DIRRECCCINO", direccions);
    // // Establece el target de la cámara en la posición del personaje
    // juego._camera.setTarget(direccions);
    // console.log("CAMERA TARGET", juego._camera.target);
  };

  shootBall = function (ball, juego) {
    console.log("BALL", ball);
    const distanceVector = ball._ball.position.subtract(
      this._mesh.position.clone()
    );
    console.log("DISTANCEVECTOR", distanceVector);
    const distance = distanceVector.length();
    console.log("DISTANCE", distance);
    if (distance < 1) {
      return true;
    }
  };

  reset = function (juego, usr) {
    console.log("this mesh jeje", this);
    if (this._mesh.name == usr.nick) {
      let targetMeshPosition;
      let targetRotation = 0
      switch (this._actualEquipo) {
        case "equipoAzul":
          targetMeshPosition = new BABYLON.Vector3(
            this._savePosition.equipoAzul.position._x,
            this._savePosition.equipoAzul.position._y,
            this._savePosition.equipoAzul.position._z
          );
          // console.log("meshrotation reset", this._mesh.rotationQuaternion)
          // this._mesh.rotationQuaternion = new BABYLON.Quaternion(0, 1, 0, 0);
          //   console.log("meshrotation reset", this._mesh.rotationQuaternion)
          //   console.log("meshrotation rotation", this._mesh.rotation)
          // this._mesh.rotation = new BABYLON.Vector3(0, 0, 0);
          // console.log("meshrotation rotation", this._mesh.rotation)

          break;
        case "equipoRojo":
          targetMeshPosition = new BABYLON.Vector3(
            this._savePosition.equipoRojo.position._x,
            this._savePosition.equipoRojo.position._y,
            this._savePosition.equipoRojo.position._z
          );

          break;
        default:
          break;
      }

      this._meshes.forEach((mesh) => {
        this._meshes.forEach((mesh) => {
          juego.animacion(
            "zRotationAnimation", // Nombre de la animación
            mesh, // Objetivo de la animación
            "rotation.z", // Propiedad que se animará
            60, // Velocidad de fotogramas
            120, // Número total de fotogramas
            mesh.rotation.z, // Valor inicial
            targetRotation // Valor final
          );
        });
        
      });

      juego.animacion(
        "resetAnimation", // Nombre de la animación
        this._mesh, // Objetivo de la animación
        "position", // Propiedad que se animará
        60, // Velocidad de fotogramas
        120, // Número total de fotogramas
        this._mesh.position, // Valor inicial
        targetMeshPosition // Valor final
      );
    }
  };
}
export default Player;
