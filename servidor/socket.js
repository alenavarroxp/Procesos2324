function WSServer() {
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
          "Se ha unido a la partida " + obj.user
        );
      });
      
      



      socket.on("cantidadJugadores", (obj) => {
        console.log("Cantidad de jugadores", obj);
        io.to(obj.passCode).emit("cantidadJugadores", obj);
      });

      socket.on("obtenerPartidas", () => {
        sistema.obtenerPartidas(function (obj) {
          console.log("OBJ", obj);
          socket.broadcast.emit("obtenerPartidas", obj);
        });
      });

      socket.on("unirseAEquipo", (obj) => {
        sistema.unirseAEquipo(obj.partida, obj.usr, obj.equipo, function (obj) {
          socket.emit("actualizarContadorEquipo", obj.partida);
        });
      });

      socket.on("playerCreado", (obj) => {
        console.log("PLAYER CREADOSERVIDOOOOOOOOR", obj)
        io.to(obj.code).emit("playerCreado", obj);
      });

      socket.on("salirEquipo", (obj) => {
        sistema.salirEquipo(obj.partida, obj.usr, obj.equipo, function (obj) {
          socket.emit("actualizarContadorEquipo", obj.partida);
        });
      });
      
      socket.on("salirPartida", (obj) => {
        console.log("OBJETO", obj)
        io.to(obj.partida.passCode).emit("chatMessage", "Se ha ido de la partida " + obj.usr.email);
        sistema.salirPartida(obj.partida, obj.usr, function (obj) {
          socket.emit("actualizarContadorEquipo", obj.partida);
          console.log("OBJ", obj)
          io.to(obj.partida.passCode).emit("cantidadJugadores", obj.partida);
          sistema.obtenerPartidas(function (obj) {
            console.log("OBJ", obj);
            socket.broadcast.emit("obtenerPartidas", obj);
          });          
        });
      });

    });
  };
}

module.exports.WSServer = WSServer;
