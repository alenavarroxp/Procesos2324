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
        try {
          console.log("meshes", newMeshes);
          const object = newMeshes[0];
          object.position = new BABYLON.Vector3(-12, 0, 21.75);
          object.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
          console.log("object", object);

          const ground = BABYLON.MeshBuilder.CreateGround(
            "ground",
            { width: 30, height: 50 },
            scene
          );
          ground.position.x = 0;
          ground.position.y = 0.6;
          ground.position.z = 0;
          ground.isVisible = false;
          

          const groundAggregate = new BABYLON.PhysicsAggregate(
            ground,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0, restitution: 1 },
            scene
          );
          object.physicsImpostor = groundAggregate;
        } catch (err) {
          console.log("Error", err);
        }
      }
    );
  };
}

export default Mapa;
