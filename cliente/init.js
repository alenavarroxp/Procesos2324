function ini() {
  let playwright = false;
  if (window.playwright) {
    playwright = true;
  }
  console.log("playwright: " + playwright);
  cw = new ControlWeb(playwright);
  rest = new ClienteRest();
  cw.comprobarSesion();
  socket = io();
}
