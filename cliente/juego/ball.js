class Ball {
  constructor() {
    this._actualPosition = null;
    this._actualRotation = null;
    this._ball = null;
  }

  initBall = (juego) => {
    new Promise((resolve, reject) => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "./cliente/juego/public/models/",
        "ball.glb",
        juego._scene,
        (newMeshes, particleSystems, skeletons) => {
          try {
            console.log("newMeshes", newMeshes);
            this._ball = newMeshes[0];
            console.log("ball", this._ball);

            this._ball.position = new BABYLON.Vector3(0, 0.55, 0);
            this._ball.rotation = new BABYLON.Vector3(0, 0, 0);
            this._ball.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
            // Resto del código...

            resolve();
          } catch (err) {
            console.warn("Error", err);
          }
        }
      );
    });
  };
}

export default Ball;
