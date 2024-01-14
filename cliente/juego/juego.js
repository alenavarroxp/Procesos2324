import Mapa from "./mapa.js";
import Player from "./player.js";

export default class Juego {
  constructor() {
    this._canvas = null;
    this._engine = null;
    this._scene = null;
    this._camera = null;
    this._light = null;
    this._players = {};
    this._isLookingAtPlayer = false;
    this._canMove = false;
    this._keys = {
      W: false,
      A: false,
      S: false,
      D: false,
    };
    this._usr = null;
    this._principalCharacter = null;
    this._passCode = null;
    this._elementMap = {}
  }

  getUser = function () {
    rest.obtenerUsuario($.cookie("nick"), function (usr) {
      juego._usr = usr;
    });
  };

  getPlayers = function () {
    console.log("PLAYYERS EN GET PLAYERS", this._players);
    return this._players;
  };

  setPlayers = function (players) {
    this._players = players;
  };

  setPassCode = function (code) {
    this._passCode = code;
  };

  initGame = async function () {
    this._canvas = document.getElementById("juego");
    console.log("CANVAS", this._canvas);
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._scene = new BABYLON.Scene(this._engine);
    this._camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      BABYLON.Vector3.Zero(),
      this._scene
    );
    this._camera.inputs.attached.pointers.buttons = [0];
    this._camera.inputs.attached.pointers.disableRightClick = true;
    this._camera.inputs.attached.pointers.multiTouchPanAndZoom = false;
    this._camera.inputs.attached.pointers.multiTouchPanning = false;
    this._camera.inputs.attached.pointers.pinchInwards = false;
    this._camera.inputs.attached.pointers.pinchZoom = false;
    this._camera.inputs.attached.keyboard.useAltToZoom = false;
    this._camera.attachControl(this._canvas, true);
    this._camera.upperBetaLimit = Math.PI / 2.15;

    this._camera.position = new BABYLON.Vector3(0, 50, 0);
    this._camera.target = new BABYLON.Vector3(0, 0, 0); // Ajusta el punto al que la cámara apunta
    this._camera.alpha += Math.PI; // Rota la cámara 180 grados
    this._camera.lowerRadiusLimit = 5; // Establece la distancia mínima a la que la cámara puede alejarse del objetivo

    console.log("CAMERA", this._camera);

    this._light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this._scene
    );
    this.getUser();
  };

  startRenderingLoop = function () {
    if (!this._engine) return;
    this._engine.runRenderLoop(() => {
      if (juego) juego.manejarMovimiento();
      this._scene.render();
    });
  };

  manejarMovimiento = function () {
    if (this._canMove) {
      if (this._principalCharacter) {
        if (this._keys.W) {
          this._principalCharacter.moveForward(this._players, this);
        }
        if (this._keys.A) {
          this._principalCharacter.moveLeft(this._players, this);
        }
        if (this._keys.S) {
          this._principalCharacter.moveBackward(this._players, this);
        }
        if (this._keys.D) {
          this._principalCharacter.moveRight(this._players, this);
        }

        if (this._keys.W || this._keys.A || this._keys.S || this._keys.D) {
          socket.emit("playerMovido", {
            code: this._passCode,
            player: this._usr,
            position: this._principalCharacter._actualPosition,
            rotation: this._principalCharacter._actualRotation,
          });
        }
      }
    }
  };

  addToScene = function (object) {
    juego._scene.add(object);
  };

  addPlayer = async function (code, player, equipo) {
    let character;
    if (!this._players[player.email]) {
      character = new Player();
    } else {
      character = this._players[player.email].character;
      console.log("character", character);
    }

    await character.initPlayer(this, player, equipo, function (obj) {
      console.log("OBJETO", obj);
      character.setEquipo(equipo);
      const playerObj = {
        user: player,
        character: character,
      };

      juego._principalCharacter = character;
      juego._players[player.email] = playerObj;
      console.log("THIS PLAYERS", juego._players);
      console.log("PLAYER OBJ", playerObj.character);

      socket.emit("playerCreado", {
        code: code,
        player: player,
        equipo: equipo,
        position: juego._players[player.email].character._actualPosition,
      });
    });
  };

  addOtherPlayer = function (player, equipo, position) {
    console.log(
      "PLAYERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      player,
      equipo,
      position
    );
    console.log("AISDJIASJDIAJSIDJAISDIJASD", this._players);
    console.log("!this._players[player.email]", !this._players[player.email]);
    let character;
    if (!this._players[player.email]) {
      console.log("NO TABA");
      character = new Player();
    } else {
      console.log("SI TABA");
      character = this._players[player.email].character;
    }

    character.addPlayer(this, player, equipo, position);

    console.log("CHARACTER", character);
    character.setEquipo(equipo);

    const playerObj = {
      user: player,
      character: character,
    };

    this._players[player.email] = playerObj;
  };

  removePlayer = function (code, player, equipo) {
    console.log("REMOVE PLAYER", this._players);
    console.log("PLAYER", player);
    if (this._players[player.email]) {
      this._players[player.email].character.remove();
      socket.emit("playerEliminado", {
        code: code,
        player: player,
        equipo: equipo,
      });
    }
  };

  removeOtherPlayer = function (player, equipo) {
    console.log("REMOVE OTHER PLAYER", this._players);
    console.log("PLAYER", player);
    if (this._players[player.email]) {
      this._players[player.email].character.remove();
      console.log("scene meshes", Object.keys(this._scene.meshes).length);
    }
  };

  zoomCamera = function (usr, equipo) {
    if (this._players[usr.email]) {
      this._canMove = true;

      this._players[usr.email].character.setEquipo(equipo);

      const targetPosition = this._players[usr.email].character._actualPosition;
      const targetRadius = 8;
      const targetBeta = Math.PI / 5.5; // Puedes ajustar este valor según tus preferencias

      var targetAlpha;
      switch (equipo) {
        case "equipoAzul":
          targetAlpha = Math.PI / 2;
          break;
        case "equipoRojo":
          targetAlpha = -Math.PI / 2;
          break;
        default:
          break;
      }

      juego.animacion(
        "zoomAnimation",
        this._camera,
        "radius",
        60,
        120,
        this._camera.radius,
        targetRadius
      );
      juego.animacion(
        "positionAnimation",
        this._camera,
        "target",
        60,
        120,
        this._camera.target,
        targetPosition
      );

      juego.animacion(
        "betaAnimation",
        this._camera,
        "beta",
        60,
        120,
        this._camera.beta,
        targetBeta
      );
      juego.animacion(
        "alphaAnimation",
        this._camera,
        "alpha",
        60,
        120,
        this._camera.alpha,
        targetAlpha
      );
    }
  };
  cambiarTarget = function (usr) {
    this._isLookingAtPlayer = !this._isLookingAtPlayer;
    if (this._isLookingAtPlayer && this._players[usr.email]) {
      this._camera.target = this._players[usr.email].character._actualPosition;
    } else {
      this._camera.target = new BABYLON.Vector3(0, 0, 0);
    }
    this._camera.upperRadiusLimit = 10;
  };

  animacion = function (
    nombre,
    objective,
    propiedad,
    velocidad,
    fotogramas,
    valorInicial,
    valorFinal
  ) {
    BABYLON.Animation.CreateAndStartAnimation(
      nombre, // Nombre de la animación
      objective, // Objetivo de la animación
      propiedad, // Propiedad que se animará
      velocidad, // Velocidad de fotogramas
      fotogramas, // Número total de fotogramas
      valorInicial, // Valor inicial
      valorFinal, // Valor final
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, // Modo de bucle
      new BABYLON.QuadraticEase() // Función de interpolación (ease)
    );
  };

  handleKeyUp = function (event) {
    const key = event.key.toUpperCase();
    if (this._keys.hasOwnProperty(key)) {
      this._keys[key] = false;
    }
  };

  handleKeyDown = function (event) {
    const key = event.key.toUpperCase();
    if (this._keys.hasOwnProperty(key)) {
      this._keys[key] = true;
    }
  };
}
window.addEventListener("resize", function () {
  if (juego._engine) juego._engine.resize();
});

//CLICK derecho
window.addEventListener("contextmenu", function (evt) {
  evt.preventDefault();
  juego.cambiarTarget(juego._usr);
});

// Manejador de evento para cuando se presiona una tecla
window.addEventListener("keydown", function (evt) {
  juego.handleKeyDown(evt);
});

// Manejador de evento para cuando se suelta una tecla
window.addEventListener("keyup", function (evt) {
  juego.handleKeyUp(evt);
});

const juego = new Juego();
setTimeout(() => {
  juego.initGame();
  juego.startRenderingLoop();
  window.juego = juego;

  const mapa = new Mapa();
  mapa.initMap(juego._scene);

  setTimeout(() => {
    socket.emit("recuperarPlayers", juego._passCode);
  }, 1100);
}, 1000);

socket.on("recuperarPlayers", (obj) => {
  console.log("EN JUEGO RECUPERAR PLAYERS", obj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const player = obj[key];
      juego.addOtherPlayer(player.player, player.equipo, player.position);
    }
  }
});

socket.on("playerMovido", (obj) => {
  console.log("OBJETO EN PLAYER MOVIDO", obj);
  if (obj.player.email == juego._usr.email) return;

  const character = juego._players[obj.player.email].character
  character.moverPersonaje(
    obj.position,
    obj.rotation
  );
});

// const ball = new FBXLoader();
// ball.load("./cliente/juego/public/ball.fbx", function (object) {
//   object.scale.set(0.01, 0.01, 0.01);
//   object.position.set(0, 4, 0);
//   object.remove(object.children[0]);
//   console.log(object);
//   scene.add(object);
// });
