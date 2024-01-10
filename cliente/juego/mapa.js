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
        console.log("meshes", newMeshes);
        const object = newMeshes[0];
        object.position = new BABYLON.Vector3(-12, 0, 21.75);
        object.rotation = new BABYLON.Vector3(0,Math.PI /2, 0);
      }
    );
  };

  
}

export default Mapa;
