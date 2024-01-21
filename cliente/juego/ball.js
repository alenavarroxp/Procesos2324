class Ball {
  constructor() {
    this._actualPosition = null;
    this._actualRotation = null;
    this._ball = null;
    this._meshes = null;
    this._isBlocked = false;
    this._isGoal = false;
  }

  initBall = (juego, callback) => {
    return new Promise((resolve, reject) => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "./cliente/juego/public/models/",
        "ball.glb",
        juego._scene,
        (newMeshes, particleSystems, skeletons) => {
          try {
            console.log("newMeshes", newMeshes);
            this._meshes = newMeshes[1];
            this._ball = newMeshes[0];
            console.log("ball", this._ball);

            this._ball.position = new BABYLON.Vector3(0, 0.55, 0);
            this._ball.rotation = new BABYLON.Vector3(0, 0, 0);
            this._ball.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);

            this._actualPosition = this._ball.position;
            this._actualRotation = this._ball.rotation;

            resolve();
            if (callback) callback(this);
          } catch (err) {
            console.warn("Error", err);
          }
        }
      );
    });
  };

  setPosition = function (newPosition) {
    if (this._ball) {
      this._ball.position = new BABYLON.Vector3(
        newPosition._x,
        newPosition._y,
        newPosition._z
      );
    }
  };

  checkCollisionsMap = function (newPosition, elementosMapa) {
    if (this._isBlocked) {
      return true;
    }

    console.log("ELEENTOSMAPA", elementosMapa);
    for (const elemtno in elementosMapa) {
      if (elementosMapa.hasOwnProperty(elemtno)) {
        const pared = elementosMapa[elemtno];

        if (pared.name.includes("wall")) {
          // console.log("pared", pared.name);
          const paredPosition = pared.position;
          const paredDimensions =
            pared.getBoundingInfo().boundingBox.extendSize;
          // console.log("NEWPOSITION", newPosition);
          // console.log("paredPosition", paredPosition);
          // console.log("paredDimensions", paredDimensions);

          var margen = 0.25;
          if (
            newPosition.x + margen >= paredPosition.x - paredDimensions.x &&
            newPosition.x - margen <= paredPosition.x + paredDimensions.x &&
            newPosition.z + margen >= paredPosition.z - paredDimensions.z &&
            newPosition.z - margen <= paredPosition.z + paredDimensions.z
          ) {
            switch (pared.name) {
              case "wallGoalBlue":
                if (!this._isBlocked) {
                  juego.marcarGol("equipoRojo");
                  this._isBlocked = true;
                }
                break;
              case "wallGoalRed":
                if (!this._isBlocked) {
                  juego.marcarGol("equipoAzul");
                  this._isBlocked = true;
                }
                break;
              default:
                break;
            }
            return true;
          }
        }
      }
    }
    return false;
  };

  shootBall = function (player, juego) {
    var ball = this._ball;
    var force = 1;
    var playerRotationZ;
    switch (player._actualEquipo) {
      case "equipoAzul":
        playerRotationZ = player._actualRotation.z;
        break;
      case "equipoRojo":
        playerRotationZ = player._actualRotation.z + Math.PI;
        break;
      default:
        break;
    }

    var direction = new BABYLON.Vector3(
      Math.sin(playerRotationZ),
      0,
      Math.cos(playerRotationZ)
    ).scale(-1);

    var playerPositionXZ = new BABYLON.Vector2(
      player._mesh.position._x,
      player._mesh.position._z
    );

    var targetPositionXZ = new BABYLON.Vector2(
      playerPositionXZ.x + direction.x * force,
      playerPositionXZ.y + direction.z * force
    );

    var smoothPosition = new BABYLON.Vector2(
      ball.position.x + (targetPositionXZ.x - ball.position.x) * 0.8,
      ball.position.z + (targetPositionXZ.y - ball.position.z) * 0.8
    );

    var smoothPosition3D = new BABYLON.Vector3(
      smoothPosition.x,
      0,
      smoothPosition.y
    );

    console.log("targetPositionXZ", targetPositionXZ);
    if (!this.checkCollisionsMap(smoothPosition3D, juego._elementMap)) {
      console.log("smoothPosition", smoothPosition);
      ball.position.x = smoothPosition.x;
      ball.position.z = smoothPosition.y;
      this._actualPosition = ball.position;
      this._isBlocked = false;
    } else {
      // Si hay una colisión, calcula la nueva dirección basada en la posición de la pared
      var collidedWall = this.getCollidedWall(
        smoothPosition3D,
        juego._elementMap
      );
      var newDirection = this.calculateNewDirection(
        direction,
        collidedWall,
        smoothPosition3D
      );
      // Actualiza la posición de la pelota con la nueva dirección
      ball.position.x = ball.position.x + newDirection.x * force;
      ball.position.z = ball.position.z + newDirection.z * force;
      this._actualPosition = ball.position;
      this._isBlocked = false;
    }

    juego.updateBallPosition();
  };

  // Función para obtener la pared con la que colisiona
  getCollidedWall = function (position, elementosMapa) {
    for (const elemtno in elementosMapa) {
      if (elementosMapa.hasOwnProperty(elemtno)) {
        const pared = elementosMapa[elemtno];

        if (pared.name.includes("wall")) {
          const paredPosition = pared.position;
          const paredDimensions =
            pared.getBoundingInfo().boundingBox.extendSize;

          var margen = 0.25;
          if (
            position.x + margen >= paredPosition.x - paredDimensions.x &&
            position.x - margen <= paredPosition.x + paredDimensions.x &&
            position.z + margen >= paredPosition.z - paredDimensions.z &&
            position.z - margen <= paredPosition.z + paredDimensions.z
          ) {
            return pared;
          }
        }
      }
    }
    return null;
  };

  // Función para calcular una nueva dirección después de una colisión
  calculateNewDirection = function (direction, collidedWall, smoothPosition3D) {
    if (!collidedWall) {
      // No hay pared con la que colisiona, devuelve la dirección original
      return direction;
    }

    var invertX = false;
    var invertZ = false;

    // Calcula dinámicamente si invertir la dirección en el eje X o Z
    if (
      Math.abs(collidedWall.position.x - smoothPosition3D.x) >
      collidedWall.scaling.x / 2
    ) {
      invertX = true;
    }

    if (
      Math.abs(collidedWall.position.z - smoothPosition3D.z) >
      collidedWall.scaling.z / 2
    ) {
      invertZ = true;
    }

    // Invierte la dirección en X o Z dependiendo de los valores de invertX e invertZ
    return new BABYLON.Vector3(
      invertX ? direction.x : -direction.x,
      0,
      invertZ ? direction.z : -direction.z
    );
  };
}

export default Ball;
