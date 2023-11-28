import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js";
class Player {
  constructor() {
    this._player = null;
    this._model = null;
    this._mixer = null;
    this._savePosition = {};
  }

  initPlayer = (juego, code, player, equipo) => {
    this._player = player;
    this._model = new FBXLoader();
    this._model.load(
      "./cliente/juego/public/models/playerIdle.fbx",
      (object) => {
        object.scale.set(0.1, 0.1, 0.1);

        if (equipo == "equipoAzul") {
          object.rotation.set(0, Math.PI / 2, 0);
          if (
            this._savePosition.equipoAzul &&
            this._savePosition.equipoAzul.equipo == equipo
          ) {
            object.position.set(
              this._savePosition.equipoAzul.position.x,
              this._savePosition.equipoAzul.position.y,
              this._savePosition.equipoAzul.position.z
            );
          } else {
            let x = Math.floor(Math.random() * (-10 - -165) + -165);
            let z = Math.floor(Math.random() * (90 - -90) + -90);
            object.position.set(x, 0, z);
            const saveB = { equipo: equipo, position: object.position };
            this._savePosition.equipoAzul = saveB;
          }
        } else if (equipo == "equipoRojo") {
          object.rotation.set(0, -Math.PI / 2, 0);
          if (
            this._savePosition.equipoRojo &&
            this._savePosition.equipoRojo.equipo == equipo
          ) {
            object.position.set(
              this._savePosition.equipoRojo.position.x,
              this._savePosition.equipoRojo.position.y,
              this._savePosition.equipoRojo.position.z
            );
          } else {
            //Quiero que vaya la X de 10 a 165
            //Quiero que vaya la Z de -90 a 90
            let x = Math.floor(Math.random() * (165 - 10) + 10);
            let z = Math.floor(Math.random() * (90 - -90) + -90);
            object.position.set(x, 0, z);
            const saveR = { equipo: equipo, position: object.position };
            this._savePosition.equipoRojo = saveR;
          }
        }
        // console.log(object);
        const animation = object.animations.find(
          (anim) => anim.name === "mixamo.com"
        );
        // console.log(animation);
        this._mixer = new THREE.AnimationMixer(object);
        const action = this._mixer.clipAction(animation);
        // console.log("action", action);
        action.play();
        this._model = object;
        console.log("PLAYER", this);
        console.log("CODE", code);
        let player = this;
        console.log("player", player._model);
        try {
          socket.emit("playerCreado", {
            code: code,
            player: player._player,
            position: player._model.position,
            equipo: equipo
          });
        } catch (e) {
          console.log("error", e);
        }
        juego.addToScene(object);
      }
    );
  };

  removeModel = function (scene, equipo) {
    if (this._model) {
      console.log("removeModel", this._model);
      console.log("equipo", equipo);
      if (equipo == "equipoAzul") {
        console.log("savePositionAzul", this._savePosition);
        this._savePosition.equipoAzul.position = this._model.position;
      } else if (equipo == "equipoRojo") {
        console.log("savePositionRojo", this._savePosition);
        this._savePosition.equipoRojo.position = this._model.position;
      }
      scene.remove(this._model);
    }
  };
}

export default Player;
