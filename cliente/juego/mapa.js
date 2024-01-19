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
          console.log("objectMAPA", object);

          const ground = BABYLON.MeshBuilder.CreateBox(
            "ground",
            { width: 20, height: 0.1, depth: 40 },
            scene
          );
          ground.position.x = 0;
          ground.position.y = 0.35;
          ground.position.z = 0;
          ground.isVisible = true;
         
          // elementosMapa["ground"] = ground;

          this.createWalls(scene, elementosMapa);
          
        } catch (err) {
          console.log("Error", err);
        }
      }
    );
  };

  this.createWalls = async function (scene, elementosMapa) {
    const wall1 = BABYLON.MeshBuilder.CreateBox(
      "wall1",
      { width: 19.1, height: 5, depth: 0.1 },
      scene
    );
    wall1.position.x = 0;
    wall1.position.y = 2.5;
    wall1.position.z = 19;
    wall1.isVisible = false;

    const wall11 = BABYLON.MeshBuilder.CreateBox(
      "wall11",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );

    wall11.position.x = 1.5;
    wall11.position.y = 1;
    wall11.position.z = 19.36;
    wall11.isVisible = false;
    wall11.rotation = new BABYLON.Vector3(0, Math.PI / 2.5, 0); // Rotación en diagonal

    const wall12 = BABYLON.MeshBuilder.CreateBox(
      "wall12",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );
    wall12.position.x = -2;
    wall12.position.y = 1;
    wall12.position.z = 19.36;
    wall12.isVisible = false;
    wall12.rotation = new BABYLON.Vector3(0, -Math.PI / 2.5, 0); // Rotación en diagonal

    const wall2 = BABYLON.MeshBuilder.CreateBox(
      "wall2",
      { width: 19.1, height: 5, depth: 0.1 },
      scene
    );
    wall2.position.x = 0;
    wall2.position.y = 2.5;
    wall2.position.z = -19;
    wall2.isVisible = false;

    const wall21 = BABYLON.MeshBuilder.CreateBox(
      "wall21",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );
    wall21.position.x = 1.5;
    wall21.position.y = 1;
    wall21.position.z = -19.36;
    wall21.isVisible = false;
    wall21.rotation = new BABYLON.Vector3(0, -Math.PI / 2.5, 0); // Rotación en diagonal

    const wall22 = BABYLON.MeshBuilder.CreateBox(
      "wall22",
      { width: 2, height: 2.7, depth: 0.1 },
      scene
    );
    wall22.position.x = -2;
    wall22.position.y = 1;
    wall22.position.z = -19.36;
    wall22.isVisible = false;
    wall22.rotation = new BABYLON.Vector3(0, Math.PI / 2.5, 0); // Rotación en diagonal

    const wall3 = BABYLON.MeshBuilder.CreateBox(
      "wall3",
      { width: 0.1, height: 5, depth: 38.2 },
      scene
    );
    wall3.position.x = 9.5;
    wall3.position.y = 2.5;
    wall3.position.z = 0;
    wall3.isVisible = false;

    const wall4 = BABYLON.MeshBuilder.CreateBox(
      "wall4",
      { width: 0.1, height: 5, depth: 38.2 },
      scene
    );
    wall4.position.x = -9.5;
    wall4.position.y = 2.5;
    wall4.position.z = 0;
    wall4.isVisible = false;

    const goalWallBlue = BABYLON.MeshBuilder.CreateBox(
      "wallGoalBlue",
      { width: 3.6, height: 3, depth: 0.1 },
      scene
    );
    goalWallBlue.position.x = -0.275;
    goalWallBlue.position.y = 1;
    goalWallBlue.position.z = 18.9;
    goalWallBlue.isVisible = false;

    goalWallBlue.material = new BABYLON.StandardMaterial("wallGoalBlue", scene);
    goalWallBlue.material.diffuseColor = new BABYLON.Color3(0, 0, 1);

    const goalWallRed = BABYLON.MeshBuilder.CreateBox(
      "wallGoalRed",
      { width: 3.6, height: 3, depth: 0.1 },
      scene
    );
    goalWallRed.position.x = -0.275;
    goalWallRed.position.y = 1;
    goalWallRed.position.z = -18.9;
    goalWallRed.isVisible = false;

    goalWallRed.material = new BABYLON.StandardMaterial("wallGoalRed", scene);
    goalWallRed.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

    var adt = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // Crear la caja
    const indicatorBlue = BABYLON.MeshBuilder.CreateBox(
      "indicatorBlue",
      { width: 4, height: 1, depth: 0.1 },
      scene
    );
    indicatorBlue.position.x = -0.275;
    indicatorBlue.position.y = 4;
    indicatorBlue.position.z = 18.9;
    indicatorBlue.isVisible = true;

    // Material azul
    indicatorBlue.material = new BABYLON.StandardMaterial(
      "indicatorBlue",
      scene
    );
    indicatorBlue.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    indicatorBlue.material.alpha = 0.5;

    var blueText = new BABYLON.GUI.TextBlock();
    blueText.text = "Equipo Azul";
    blueText.color = "white";
    blueText.fontSize = 24;
    blueText.fontStyle = "bold"; // Añade negrita
    blueText.fontFamily = "Arial, sans-serif";

    // Alinea el texto horizontalmente al centro de la caja
    blueText.textHorizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    // Estilo de sombra
    blueText.shadowColor = "black";
    blueText.shadowBlur = 3;
    blueText.shadowOffsetX = 2;
    blueText.shadowOffsetY = 2;

    adt.addControl(blueText);

    // Ajusta la posición vertical del texto con respecto a la caja
    blueText.linkWithMesh(indicatorBlue);

    // Crear la caja
    const indicatorRed = BABYLON.MeshBuilder.CreateBox(
      "indicatorRed",
      { width: 4, height: 1, depth: 0.1 },
      scene
    );
    indicatorRed.position.x = -0.275;
    indicatorRed.position.y = 4;
    indicatorRed.position.z = -18.9;
    indicatorRed.isVisible = true;

    // Material rojo
    indicatorRed.material = new BABYLON.StandardMaterial("indicatorRed", scene);
    indicatorRed.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    indicatorRed.material.alpha = 0.5;

    var redText = new BABYLON.GUI.TextBlock();
    redText.text = "Equipo Rojo";
    redText.color = "white";
    redText.fontSize = 24;
    redText.fontStyle = "bold"; // Añade negrita
    redText.fontFamily = "Arial, sans-serif";

    // Alinea el texto horizontalmente al centro de la caja
    redText.textHorizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    // Estilo de sombra
    redText.shadowColor = "black";
    redText.shadowBlur = 3;
    redText.shadowOffsetX = 2;
    redText.shadowOffsetY = 2;

    adt.addControl(redText);

    // Ajusta la posición vertical del texto con respecto a la caja
    redText.linkWithMesh(indicatorRed);

    // Crear el plano para el texto

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
  };
}

export default Mapa;
