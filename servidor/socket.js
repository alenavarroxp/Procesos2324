function WSServer() {
  this.players = {};
  this.partidasStatus = {};
  this.lanzarServidor = function (io, sistema) {
    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado", socket.id);
      socket.on("disconnect", () => {
        console.log("Cliente desconectado", socket.id);
      });

      socket.on("joinRoom", (room) => {
        console.log("Cliente", socket.id, "se unió a la sala", room);
        socket.join(room);
      });

      socket.on("sendMessage", (mensaje) => {
        console.log("Nuevo mensaje", mensaje);
        io.to(mensaje.passCode).emit("chatMessage", mensaje);
      });

      socket.on("mensajeBienvenida", (obj) => {
        console.log("Mensaje de bienvenida", obj);
        io.to(obj.partida.passCode).emit(
          "chatMessage",
          "Se ha unido a la partida " + obj.user.nick
        );
      });

      socket.on("cantidadJugadores", (obj) => {
        console.log("Cantidad de jugadores", obj);
        io.to(obj.passCode).emit("cantidadJugadores", obj);
      });

      socket.on("actualizarContadorEquipo", (obj) => {
        io.to(obj.passCode).emit("actualizarContadorEquipo", obj);
      });

      socket.on("obtenerPartidas", () => {
        sistema.obtenerPartidas(function (obj) {
          console.log("OBJ", obj);
          socket.broadcast.emit("obtenerPartidas", obj);
        });
      });

      socket.on("unirseAEquipo", (obj) => {
        sistema.unirseAEquipo(obj.partida, obj.usr, obj.equipo, function (obj) {
          console.log("SOCKET UNIRSE A EQUIPO: ", obj);
          if (!obj.error)
            io.to(obj.partida.passCode).emit(
              "actualizarContadorEquipo",
              obj.partida
            );
        });
      });

      socket.on("jugadorReady", (obj) => {
        console.log("OBJ en servidor jugadorReady", obj);
        io.to(obj.partida.passCode).emit("jugadorReady", obj);
      });

      socket.on("actualizarJugadoresReady", (obj) => {
        console.log("OBJ en servidor actualizarJugadoresReady", obj);
        io.to(obj.partida.passCode).emit("actualizarJugadoresReady", obj);
      });

      socket.on("recuperarPlayers", (obj) => {
        const players = this.players[obj];
        socket.emit("recuperarPlayers", players);
      });

      socket.on("playerCreado", (obj) => {
        if (!this.players[obj.code]) {
          this.players[obj.code] = [];
        }

        const existingPlayerIndex = this.players[obj.code].findIndex(
          (player) => player.player.email === obj.player.email
        );

        // Verificar si el jugador ya existe por su email
        if (existingPlayerIndex !== -1) {
          // Si existe, reemplazar el objeto existente
          this.players[obj.code][existingPlayerIndex] = {
            player: obj.player,
            equipo: obj.equipo,
            position: obj.position,
          };
        } else {
          // Si no existe, agregar un nuevo objeto al array
          this.players[obj.code].push({
            player: obj.player,
            equipo: obj.equipo,
            position: obj.position,
          });
        }
        io.to(obj.code).emit("playerCreado", obj);
      });

      socket.on("playerEliminado", (obj) => {
        io.to(obj.code).emit("playerEliminado", obj);
      });

      socket.on("playerMovido", (obj) => {
        io.to(obj.code).emit("playerMovido", obj);
      });

      socket.on("salirEquipo", (obj) => {
        sistema.salirEquipo(obj.partida, obj.usr, obj.equipo, function (obj) {
          io.to(obj.partida.passCode).emit(
            "actualizarContadorEquipo",
            obj.partida
          );
        });
      });

      let contador = 0;

      socket.on("contadorServidor", (obj) => {
        console.log("OBJETO", obj);
        contador = obj.partida.duracion * 60;
        var minutes = Math.floor(contador / 60);
        var seconds = contador % 60;
        let isLast30Seconds = false; // Variable para rastrear si estamos en los últimos 30 segundos
        let interval = setInterval(() => {
          if (seconds == 0) {
            if (minutes == 0) {
              clearInterval(interval);
              return;
            }
            minutes--;
            seconds = 59;
          } else {
            seconds--;

            // Verificar si estamos en los últimos 30 segundos
            if (minutes === 0 && seconds <= 30) {
              isLast30Seconds = true;
            }
          }

          if (this.partidasStatus[obj.partida.passCode]) {
            console.log("Limpiando intervalo");
            clearInterval(interval);
            return;
          }

          // Determinar el color a enviar
          let color = isLast30Seconds
            ? seconds % 2 === 0
              ? "red"
              : "white"
            : "white";
          if (isLast30Seconds && seconds <= 10) color = "red";

          io.to(obj.partida.passCode).emit("contadorCliente", {
            minutes: minutes,
            seconds: seconds,
            email: obj.email,
            color: color,
          });
        }, 1000);
      });

      socket.on("updateBallPosition", (obj) => {
        io.to(obj.code).emit("updateBallPosition", obj);
      });

      socket.on("partidaFinalizada", (obj) => {
        console.log("objeto finalizada", obj);
        this.partidasStatus[obj.partida.passCode] = true;
        io.to(obj.partida.passCode).emit("partidaFinalizada", obj);
      });

      socket.on("marcarGol", (obj) => {
        console.log("GOOOOL", obj);
        io.to(obj.code).emit("marcarGol", obj);
      });

      socket.on("actualizarPartidaGol", (obj) => {
        console.log("OBJETO", obj);
        sistema.actualizarPartidaGol(
          obj.partida,
          obj.obj.equipo,
          function (obj) {
            console.log("OBJ", obj);
            io.to(obj.passCode).emit("actualizarPartidaGol", obj);
          }
        );
      });

      socket.on("pantallaFinal", (obj) => {
        console.log("OBJETO FINAL FINAL", obj);
        io.to(obj.partida.passCode).emit("pantallaFinal", obj);
      });

      socket.on("salirPartida", (obj) => {
        console.log("OBJETO", obj);
        io.to(obj.partida.passCode).emit(
          "chatMessage",
          "Se ha ido de la partida " + obj.usr.nick
        );
        sistema.salirPartida(obj.partida, obj.usr, function (obj) {
          console.log("OBJ", obj);
          if (obj.partida) {
            io.to(obj.partida.passCode).emit(
              "actualizarContadorEquipo",
              obj.partida
            );
            io.to(obj.partida.passCode).emit("cantidadJugadores", obj.partida);
          }
          sistema.obtenerPartidas(function (obj) {
            console.log("OBJ", obj);
            socket.broadcast.emit("obtenerPartidas", obj);
          });
        });
      });

      socket.on("actualizarEstadoPartida", (obj) => {
        sistema.actualizarEstadoPartida(
          obj.partida,
          obj.estado,
          function (obj) {
            console.log("OBJ DEVUELTA", obj);
            io.to(obj.passCode).emit("actualizarEstadoPartida", obj);
          }
        );
      });

      socket.on("recargarPagina", (obj) => {
        console.log("OBJETOasdasdasdasdasdasdrecarga", obj);
      });
    });
  };
}

module.exports.WSServer = WSServer;
