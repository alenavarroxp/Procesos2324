function ControlWeb() {
  this.mostrarAgregarUsuario = function () {
    let cadena = '<div id="mAU" class="form-group">';
    cadena += '<label for="nick">Introduce el nick:</label>';
    cadena += '<input type="text" class="form-control" id="nick">';
    cadena += '<button id="btnAU" type="submit" class="btn btn-primary">Agregar Usuario</button>';
    cadena += '</div>';
    $("#au").append(cadena);
    $("#btnAU").on("click", function () {
      let nick = $("#nick").val();
      let res = new ClienteRest();
      res.agregarUsuario(nick);
      $("#mAU").remove();
    });
  };

  this.mostrarObtenerUsuarios = function () {
    let cadena = '<div id="mOU" class="form-group">';
    cadena += '<button id="btnOU" type="submit" class="btn btn-primary">Obtener Usuarios</button>';
    cadena += '</div>';
    $("#au").append(cadena);
    $("#btnOU").on("click", function () {
      let res = new ClienteRest();
      res.obtenerUsuarios();
      $("#mOU").remove();
    });
  }

  this.mostrarNumeroUsuarios = function () {
    let cadena = '<div id="mNU" class="form-group">';
    cadena += '<button id="btnNU" type="submit" class="btn btn-primary">Numero Usuarios</button>';
    cadena += '</div>';
    $("#au").append(cadena);
    $("#btnNU").on("click", function () {
      let res = new ClienteRest();
      res.numeroUsuarios();
      $("#mNU").remove();
    });
  }

  this.mostrarUsuarioActivo = function () { 
    let cadena = '<div id="mUA" class="form-group">';
    cadena += '<label for="nick">Introduce el nick:</label>';
    cadena += '<input type="text" class="form-control" id="nick">';
    cadena += '<button id="btnUA" type="submit" class="btn btn-primary">Usuario Activo</button>';
    cadena += '</div>';
    $("#au").append(cadena);
    $("#btnUA").on("click", function () {
      let nick = $("#nick").val();
      let res = new ClienteRest();
      res.usuarioActivo(nick);
      $("#mUA").remove();
    });
  }

  this.mostrarEliminarUsuario = function () {
    let cadena = '<div id="mEU" class="form-group">';
    cadena += '<label for="nick">Introduce el nick:</label>';
    cadena += '<input type="text" class="form-control" id="nick">';
    cadena += '<button id="btnEU" type="submit" class="btn btn-primary">Eliminar Usuario</button>';
    cadena += '</div>';
    $("#au").append(cadena);
    $("#btnEU").on("click", function () {
      let nick = $("#nick").val();
      let res = new ClienteRest();
      res.eliminarUsuario(nick);
      $("#mEU").remove();
    });
  }
}
