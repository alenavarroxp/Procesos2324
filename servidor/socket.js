function WSServer() {
    this.lanzarServidor = function (io,sistema){
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
          
            socket.on("mensajeBienvenida",(obj)=>{
              console.log("Mensaje de bienvenida",obj);
              io.to(obj.partida.passCode).emit("chatMessage", 'Se ha unido a la partida '+obj.user)
            })
          
            socket.on("cantidadJugadores", (obj) => {
              console.log("Cantidad de jugadores", obj);
              io.to(obj.passCode).emit("cantidadJugadores", obj);
            });
          
            socket.on("obtenerPartidas",()=>{
              sistema.obtenerPartidas(function (obj) {
                console.log("OBJ",obj);
                socket.broadcast.emit("obtenerPartidas", obj);
              });
            })
          });
    }
}

module.exports.WSServer = WSServer;