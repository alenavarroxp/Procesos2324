import { describe, test, expect } from "@playwright/test";

describe("Test de registro e inicio de sesión", () => {
  test("Registro", async ({ page }) => {
    // //COMPROBAR QUE NO SE PUEDE REGISTRAR CON CAMPOS VACIOS
    // await page.goto("http://localhost:3000/");
    // await page.getByText("REGÍSTRATE").click();
    // await page.getByPlaceholder("Introduce tu nombre de usuario").click();
    // await page
    //   .getByPlaceholder("Introduce tu nombre de usuario")
    //   .fill("Alejandro");
    // await page.getByRole("button", { name: "Registrar" }).click();
    // await page.getByPlaceholder("Introduce tu correo electró").click();
    // await page
    //   .getByPlaceholder("Introduce tu correo electró")
    //   .fill("prueba@prueba.com");
    // await page.getByRole("button", { name: "Registrar" }).click();
    // await page.getByText("Introduce los campos").click();
    // await page.getByPlaceholder("Introduce tu contraseña").click();
    // await page.getByPlaceholder("Introduce tu contraseña").fill("prueba");
    // await page.getByRole("button", { name: "" }).click();
    // await page.getByRole("button", { name: "Registrar" }).click();
    // await page.getByText("Usuario Alejandro ha sido").click();
    // await page.getByText("Consulta tu correo para").click();
    // //COMPROBAR CONFIRMADA CUENTA
    // await page.getByPlaceholder("Introduce tu correo electró").click();
    // await page
    //   .getByPlaceholder("Introduce tu correo electró")
    //   .fill("prueba@prueba.com");
    // await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    // await page.getByText("Introduce un email y una").click();
    // await page.getByPlaceholder("Introduce tu contraseña").click();
    // await page.getByPlaceholder("Introduce tu contraseña").fill("incorrecta");
    // await page.getByRole("button", { name: "" }).click();
    // await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    // await page.getByText("Contraseña incorrecta").click();
    // await page.getByPlaceholder("Introduce tu contraseña").click();
    // await page
    //   .getByPlaceholder("Introduce tu contraseña")
    //   .press("Control+Shift+ArrowLeft");
    // await page.getByPlaceholder("Introduce tu contraseña").fill("prueba");
    // await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    // await page.getByText("Tienes que confirmar tu").click();
    // //COMPROBAR QUE NO SE PUEDE REGISTRAR CON EL MISMO CORREO
    // await page.getByText("REGÍSTRATE").click();
    // await page.getByPlaceholder("Introduce tu nombre de usuario").click();
    // await page
    //   .getByPlaceholder("Introduce tu nombre de usuario")
    //   .fill("Alejandro Navarro 2");
    // await page.getByPlaceholder("Introduce tu correo electró").click();
    // await page
    //   .getByPlaceholder("Introduce tu correo electró")
    //   .fill("prueba@prueba.com");
    // await page.getByRole("button", { name: "Registrar" }).click();
    // await page.getByPlaceholder("Introduce tu contraseña").click();
    // await page.getByText("Introduce los campos").click();
    // await page.getByPlaceholder("Introduce tu contraseña").click();
    // await page.getByPlaceholder("Introduce tu contraseña").fill("prueba123");
    // await page.getByRole("button", { name: "Registrar" }).click();
    // await page.getByText("Ya existe un usuario con ese").click();
  });

  test("Inicio de sesión", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Introduce un email y una").click();
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.co");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Introduce un email y una").click();
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("noexiste");
    await page.getByRole("button", { name: "" }).click();
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Usuario no registrado").click();
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("incorrecta");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Contraseña incorrecta").click();
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("playwright", { exact: true }).click();
    await page.getByText("playwright@playwright.com", { exact: true }).click();
  });

  test("Navbar", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    //OCULTAR NAVBAR
    await page.locator("#navbarV").click();
    await page.locator("#ocultarNavbar").click();
    await page.locator("#ocultarNavbar").click();
    await page.locator("#navbarV").click();
    //HOME
    await page.locator("#homeVisible").click();
    await page.getByText("Partidos", { exact: true }).click();
    await page.getByText("Crear partido").click();
    await page.getByRole("heading", { name: "Crear un partido" }).click();
    await page
      .getByRole("heading", { name: "¡Prepara tu juego ahora! 🎉" })
      .click();
    await page.getByText("Explorar partidos").click();
    await page.getByRole("heading", { name: "Únete a una Partida" }).click();
    await page.getByRole("heading", { name: "Partidas disponibles" }).click();
    await page.getByRole("button", { name: "Salir" }).click();
    await page.getByRole("heading", { name: "¡Bienvenido de vuelta!" }).click();
  });

  test("Inicio funcionalidad", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("¿QUÉ QUIERES HACER? Crear tu").click();
    await page.getByRole("heading", { name: "Crear un partido" }).click();
    await page.locator("#homeVisible").click();
    await page.getByText("¿QUÉ QUIERES HACER? Explorar").click();
    await page.getByRole("heading", { name: "Únete a una Partida" }).click();
    await page.locator("#homeVisible").click();
    await page
      .getByRole("heading", { name: "Noticias y actualizaciones" })
      .click();
    await page.locator("ol").click();
  });

  test("Editar perfil funcionalidad", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    //CAMBIO DE NOMBRE
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Introduce al menos un campo").click();
    await page.getByPlaceholder("playwright", { exact: true }).click();
    await page
      .getByPlaceholder("playwright", { exact: true })
      .fill("playwright2");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Contraseña actual incorrecta").click();
    await page.locator("#currentPassword").click();
    await page.locator("#currentPassword").fill("playwright");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("playwright2", { exact: true }).click();
    await expect(page.locator("#username")).toContainText("playwright2");
    await page.getByText("playwright@playwright.com", { exact: true }).click();
    await expect(page.locator("#emailValue")).toContainText(
      "playwright@playwright.com"
    );

    //CAMBIO DE EMAIL
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await page.getByPlaceholder("playwright@playwright.com").click();
    await page.getByPlaceholder("playwright@playwright.com").fill("noformato");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Introduce un email válido").click();
    await page.getByPlaceholder("playwright@playwright.com").click();
    await page
      .getByPlaceholder("playwright@playwright.com")
      .fill("playwright2@playwright2.com");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Contraseña actual incorrecta").click();
    await page.locator("#currentPassword").click();
    await page.locator("#currentPassword").fill("playwright");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("playwright2", { exact: true }).click();
    await expect(page.locator("#username")).toContainText("playwright2");
    await page.getByText("playwright2@playwright2.com").click();
    await expect(page.locator("#emailValue")).toContainText(
      "playwright2@playwright2.com"
    );

    //CAMBIO DE CONTRASEÑA
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await page.locator("#passwordInput").click();
    await page.locator("#passwordInput").fill("contraseña");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Las contraseñas no coinciden").click();
    await page.locator("#passwordRepeat").click();
    await page.locator("#passwordRepeat").fill("contraseña");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("Contraseña actual incorrecta").click();
    await page.locator("#currentPassword").click();
    await page.locator("#currentPassword").fill("contraseña");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.locator("#currentPassword").click();
    await page.locator("#currentPassword").fill("playwright");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByText("playwright2", { exact: true }).click();
    await expect(page.locator("#username")).toContainText("playwright2");
    await page.getByText("playwright2@playwright2.com").click();
    await expect(page.locator("#emailValue")).toContainText(
      "playwright2@playwright2.com"
    );

    //COMPROBAR CAMBIOS
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "Salir" }).click();
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Introduce un email y una").click();
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Usuario no registrado").click();
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .press("Control+a");
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright2@playwright2.com");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Contraseña incorrecta").click();
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("contraseña");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("playwright2", { exact: true }).click();
    await expect(page.locator("#username")).toContainText("playwright2");
    await page
      .getByText("playwright2@playwright2.com", { exact: true })
      .click();
    await expect(page.locator("#emailValue")).toContainText(
      "playwright2@playwright2.com"
    );

    //RESET DE CAMBIOS
    await page.getByRole("button", { name: "Editar perfil" }).click();
    await page.getByPlaceholder("playwright2", { exact: true }).click();
    await page
      .getByPlaceholder("playwright2", { exact: true })
      .fill("playwright");
    await page.locator("#currentPassword").click();
    await page.locator("#currentPassword").fill("contraseña");
    await page.locator("#passwordInput").click();
    await page.locator("#passwordInput").fill("playwright");
    await page.locator("#passwordRepeat").click();
    await page.locator("#passwordRepeat").fill("playwright");
    await page.getByPlaceholder("playwright2@playwright2.com").click();
    await page
      .getByPlaceholder("playwright2@playwright2.com")
      .fill("playwright@playwright.com");

    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await page.getByRole("button", { name: "Salir" }).click();
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByPlaceholder("Introduce tu contraseña").press("Enter");
    await page.getByText("playwright", { exact: true }).click();
    await expect(page.locator("#username")).toContainText("playwright");
    await page.getByText("playwright@playwright.com", { exact: true }).click();
    await expect(page.locator("#emailValue")).toContainText(
      "playwright@playwright.com"
    );
  });

  test("Crear partido funcionalidad", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByPlaceholder("Introduce tu contraseña").press("Enter");
    await page.getByText("Partidos", { exact: true }).click();
    await page.getByText("Crear partido").click();

    //PARTIDO 1
    await page.getByRole("heading", { name: "Crear un partido" }).click();
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("Introduce los campos").click();
    await page.getByPlaceholder("Introduce el nombre del").click();
    await page.getByPlaceholder("Introduce el nombre del").fill("partido1");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("Introduce los campos").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").fill("2");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("Introduce los campos").click();
    await page
      .locator("label")
      .filter({ hasText: "Duración Elige la duración" })
      .nth(1)
      .click();
    await page.getByPlaceholder("Duración estimada en minutos").click();
    await page.getByPlaceholder("Duración estimada en minutos").fill("3");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page
      .getByRole("heading", { name: "Información de la partida" })
      .click();
    await page.getByText("partido1").click();
    await expect(page.locator("#iPartida")).toContainText("partido1");
    await page.getByText("2 jugadores").click();
    await expect(page.locator("#iPartida")).toContainText("2 jugadores");
    await page.getByText("3 minutos").click();
    await expect(page.locator("#iPartida")).toContainText("3 minutos");
    await page.getByRole("button", { name: "Crear Partida" }).click();
    // page.once("dialog", (dialog) => {
    //   console.log(`Dialog message: ${dialog.message()}`);
    //   dialog.dismiss().catch(() => {});
    // });
    await page.getByRole("button", { name: "Salir" }).click();

    //PARTIDO 2
    await page.getByText("Partidos", { exact: true }).click();
    await page.getByText("Crear partido").click();
    await page.getByPlaceholder("Introduce el nombre del").click();
    await page.getByPlaceholder("Introduce el nombre del").fill("partido2");
    await page.getByPlaceholder("Mínimo 2 jugadores").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").fill("2");
    await page
      .locator("label")
      .filter({ hasText: "Nº de Goles Elige el número" })
      .nth(1)
      .click();
    await page.getByPlaceholder("Número de goles a marcar").click();
    await page.getByPlaceholder("Número de goles a marcar").fill("2");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("partido2").click();
    await expect(page.locator("#iPartida")).toContainText("partido2");
    await page.getByText("2 jugadores").click();
    await expect(page.locator("#iPartida")).toContainText("2 jugadores");
    await page.getByText("Por defecto: 5 minutos").click();
    await expect(page.locator("#iPartida")).toContainText(
      "Por defecto: 5 minutos"
    );
    await page.getByText("2 goles").click();
    await expect(page.locator("#iPartida")).toContainText("2 goles");
    await page.getByRole("button", { name: "Crear Partida" }).click();
    // page.once("dialog", (dialog) => {
    //   console.log(`Dialog message: ${dialog.message()}`);
    //   dialog.dismiss().catch(() => {});
    // });
    await page.getByRole("button", { name: "Salir" }).click();

    //PARTIDO 3
    await page.getByText("Partidos", { exact: true }).click();
    await page.getByText("Crear partido").click();
    await page.getByPlaceholder("Introduce el nombre del").click();
    await page.getByPlaceholder("Introduce el nombre del").fill("partido3");
    await page.getByPlaceholder("Mínimo 2 jugadores").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").fill("2");
    await page
      .locator("label")
      .filter({ hasText: "Duración Elige la duración" })
      .nth(1)
      .click();
    await page
      .locator("label")
      .filter({ hasText: "Nº de Goles Elige el número" })
      .nth(1)
      .click();
    await page.getByPlaceholder("Duración estimada en minutos").click();
    await page.getByPlaceholder("Duración estimada en minutos").fill("2");
    await page.getByPlaceholder("Número de goles a marcar").click();
    await page.getByPlaceholder("Número de goles a marcar").fill("5");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("partido3").click();
    await expect(page.locator("#iPartida")).toContainText("partido3");
    await page.getByText("2 jugadores").click();
    await expect(page.locator("#iPartida")).toContainText("2 jugadores");
    await page.getByText("2 minutos").click();
    await expect(page.locator("#iPartida")).toContainText("2 minutos");
    await page.getByText("5 goles").click();
    await expect(page.locator("#iPartida")).toContainText("5 goles");
    await page.getByRole("button", { name: "Crear Partida" }).click();
    // page.once("dialog", (dialog) => {
    //   console.log(`Dialog message: ${dialog.message()}`);
    //   dialog.dismiss().catch(() => {});
    // });
    await page.getByRole("button", { name: "Salir" }).click();

    //PARTIDO 4
    await page.getByText("Partidos", { exact: true }).click();
    await page.getByText("Crear partido").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").fill("1");
    await page.getByPlaceholder("Introduce el nombre del").click();
    await page.getByPlaceholder("Introduce el nombre del").fill("partido4");
    await page
      .locator("label")
      .filter({ hasText: "Duración Elige la duración" })
      .nth(1)
      .click();
    await page.getByPlaceholder("Duración estimada en minutos").click();
    await page.getByPlaceholder("Duración estimada en minutos").fill("1");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("partido4").click();
    await expect(page.locator("#iPartida")).toContainText("partido4");
    await page.getByText("2 jugadores").click();
    await expect(page.locator("#iPartida")).toContainText("2 jugadores");
    await page.getByText("1 minutos").click();
    await expect(page.locator("#iPartida")).toContainText("1 minutos");
    await page.getByRole("button", { name: "Cancelar" }).click();

    //PARTIDO 5
    await page.getByPlaceholder("Duración estimada en minutos").click();
    await page.getByPlaceholder("Duración estimada en minutos").fill("17");
    await page.getByPlaceholder("Mínimo 2 jugadores").click();
    await page.getByPlaceholder("Mínimo 2 jugadores").fill("25");
    await page.getByPlaceholder("Introduce el nombre del").click();
    await page.getByPlaceholder("Introduce el nombre del").fill("partido5");
    await page.getByRole("button", { name: "Crear Partido" }).click();
    await page.getByText("partido5").click();
    await expect(page.locator("#iPartida")).toContainText("partido5");
    await page.getByText("22 jugadores").click();
    await expect(page.locator("#iPartida")).toContainText("22 jugadores");
    await page.getByText("10 minutos").click();
    await expect(page.locator("#iPartida")).toContainText("10 minutos");
  });

  test("Explorar partidos funcionalidad", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder("Introduce tu correo electró").click();
    await page
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page.getByPlaceholder("Introduce tu contraseña").click();
    await page.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.getByText("Partidos", { exact: true }).click();
    await page.getByText("Explorar partidos").click();
    await page
      .locator("#no-partidas div")
      .filter({ hasText: "En este momento, no hay" })
      .nth(1)
      .click();
    await page.getByText("Explorar partidos").click();
    await expect(page.locator("#no-partidas")).toContainText(
      "En este momento, no hay ninguna partida disponible para poder unirte"
    );
    await page.getByRole("heading", { name: "Únete a una Partida" }).click();
    await page.getByRole("button", { name: " Pegar" }).click();
    await page.locator("#otp-0").click();
    await page.locator("#otp-0").press("1");
    await page.locator("#otp-1").press("1");
    await page.locator("#otp-2").press("1");
    await page.locator("#otp-3").press("1");
    await page.locator("#otp-4").press("1");
    await page.locator("#otp-5").press("1");
    await page.locator("#otp-6").press("1");
    await page.locator("#otp-7").press("1");
    await page.getByRole("button", { name: "Unirse al Partido" }).click();
    await page.getByText("No se ha encontrado la").click();
  });
});
