function Mapa() {
  this._field;
  this._hollowBox;
  this._goalBox = {};

  this.initMap = function (scene) {
    this.createMap(scene);
  };

  this.createMap = function (scene) {
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./cliente/juego/public/models/",
      "mini_stadium.glb",
      scene,
      (newMeshes, particleSystems, skeletons) => {
        console.log("meshes")
        // this.createBounding(scene, object);
      }
    );
  };

  this.createBounding = function (scene, object) {
    // Calcula las dimensiones del modelo GLB
    const boundingBox = object.getBoundingInfo().boundingBox;
    const size = boundingBox.maximum.subtract(boundingBox.minimum);
    size.y += 60;
    size.x -= 50;
    size.z -= 50;

    // Crea la caja hueca
    this._hollowBox = BABYLON.MeshBuilder.CreateBox(
      "hollowBox",
      { width: size.x, height: size.y, depth: size.z },
      scene
    );
    this._hollowBox.position = object.position.add(new BABYLON.Vector3(0, 40, 0));

    this.createGoalBounding(scene, object, "left");
    this.createGoalBounding(scene, object, "right");
  };

  this.createGoalBounding = function (scene, object, direction) {
    const boundingBox = object.getBoundingInfo().boundingBox;
    const size = boundingBox.maximum.subtract(boundingBox.minimum);
    size.y += 20;
    size.x -= 3;
    size.z -= 27;

    const goalBox = BABYLON.MeshBuilder.CreateBox(
      "goalBox",
      { width: size.x, height: size.y, depth: size.z },
      scene
    );

    let offset = direction === "left" ? -170.5 : 170.5;

    goalBox.position = object.position.add(new BABYLON.Vector3(offset, 10, 0));
    this._goalBox[direction] = goalBox;
  };
}

export default Mapa;
