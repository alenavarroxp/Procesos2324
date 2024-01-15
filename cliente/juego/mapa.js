function Mapa() {
  this._field;
  this._hollowBox;
  this._goalBox = {};

  this.initMap = function (scene, elementosMapa) {
    this.createMap(scene, elementosMapa);
  };

  this.createMap = function (scene, elementosMapa) {
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
            { width: 20, height: 40, depth: 0.1 },
            scene
          );
          ground.position.x = 0;
          ground.position.y = 0.6;
          ground.position.z = 0;
          ground.isVisible = true;

          // elementosMapa["ground"] = ground;

          this.createWalls(scene,elementosMapa);

          // const groundAggregate = new BABYLON.PhysicsAggregate(
          //   ground,
          //   BABYLON.PhysicsShapeType.MESH,
          //   { mass: 0, restitution: 1 },
          //   scene
          // );
          // object.physicsImpostor = groundAggregate;
        } catch (err) {
          console.log("Error", err);
        }
      }
    );
  };

  this.createWalls = function (scene, elementosMapa) {
    const wall1 = BABYLON.MeshBuilder.CreateBox(
      "wall1",
      { width: 19.1, height: 5, depth: 0.1 },
      scene
    );
    wall1.position.x = 0;
    wall1.position.y = 2.5;
    wall1.position.z = 19;
    wall1.isVisible = true;

    const wall11 = BABYLON.MeshBuilder.CreateBox(
      "wall11",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );

    wall11.position.x = 1.5;
    wall11.position.y = 1;
    wall11.position.z = 19.36;
    wall11.isVisible = true;
    wall11.rotation = new BABYLON.Vector3(0, Math.PI / 2.5, 0); // Rotación en diagonal

    const wall12 = BABYLON.MeshBuilder.CreateBox(
      "wall12",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );
    wall12.position.x = -2;
    wall12.position.y = 1;
    wall12.position.z = 19.36;
    wall12.isVisible = true;
    wall12.rotation = new BABYLON.Vector3(0, -Math.PI / 2.5, 0); // Rotación en diagonal

    const wall2 = BABYLON.MeshBuilder.CreateBox(
      "wall2",
      { width: 19.1, height: 5, depth: 0.1 },
      scene
    );
    wall2.position.x = 0;
    wall2.position.y = 2.5;
    wall2.position.z = -19;
    wall2.isVisible = true;

    const wall21 = BABYLON.MeshBuilder.CreateBox(
      "wall21",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );
    wall21.position.x = 1.5;
    wall21.position.y = 1;
    wall21.position.z = -19.36;
    wall21.isVisible = true;
    wall21.rotation = new BABYLON.Vector3(0, -Math.PI / 2.5, 0); // Rotación en diagonal

    const wall22 = BABYLON.MeshBuilder.CreateBox(
      "wall22",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );
    wall22.position.x = -2;
    wall22.position.y = 1;
    wall22.position.z = -19.36;
    wall22.isVisible = true;
    wall22.rotation = new BABYLON.Vector3(0, Math.PI / 2.5, 0); // Rotación en diagonal

    const wall3 = BABYLON.MeshBuilder.CreateBox(
      "wall3",
      { width: 0.1, height: 5, depth: 38.2 },
      scene
    );
    wall3.position.x = 9.5;
    wall3.position.y = 2.5;
    wall3.position.z = 0;
    wall3.isVisible = true;

    const wall4 = BABYLON.MeshBuilder.CreateBox(
      "wall4",
      { width: 0.1, height: 5, depth: 38.2 },
      scene
    );
    wall4.position.x = -9.5;
    wall4.position.y = 2.5;
    wall4.position.z = 0;
    wall4.isVisible = true;

    const goalWallBlue = BABYLON.MeshBuilder.CreateBox(
      "goalWallBlue",
      { width: 3.6, height: 3, depth: 0.1 },
      scene
    );
    goalWallBlue.position.x = -0.275;
    goalWallBlue.position.y = 1;
    goalWallBlue.position.z = 18.9;
    goalWallBlue.isVisible = true;

    goalWallBlue.material = new BABYLON.StandardMaterial("goalWallBlue", scene);
    goalWallBlue.material.diffuseColor = new BABYLON.Color3(0, 0, 1);

    const goalWallRed = BABYLON.MeshBuilder.CreateBox(
      "goalWallRed",
      { width: 3.6, height: 3, depth: 0.1 },
      scene
    );
    goalWallRed.position.x = -0.275;
    goalWallRed.position.y = 1;
    goalWallRed.position.z = -18.9;
    goalWallRed.isVisible = true;

    goalWallRed.material = new BABYLON.StandardMaterial("goalWallRed", scene);
    goalWallRed.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

    elementosMapa["wall1"] = wall1;
    elementosMapa["wall11"] = wall11;
    elementosMapa["wall12"] = wall12;
    elementosMapa["wall2"] = wall2;
    elementosMapa["wall21"] = wall21;
    elementosMapa["wall22"] = wall22;
    elementosMapa["wall3"] = wall3;
    elementosMapa["wall4"] = wall4;
    elementosMapa["goalWallBlue"] = goalWallBlue;
    elementosMapa["goalWallRed"] = goalWallRed;
  }
}

export default Mapa;
