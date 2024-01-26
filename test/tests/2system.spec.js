import { describe, test, expect, chromium } from "@playwright/test";

const redireccionamiento = async (page) => {
  await page.goto("http://localhost:3000/");
};

test("Creacion de partida", async () => {
  const browser1 = await chromium.launch();
  const browser2 = await chromium.launch();

  const page1 = await browser1.newPage();
  const page2 = await browser2.newPage();

  await redireccionamiento(page1);
  await redireccionamiento(page2);

  try {
    await page1.getByPlaceholder("Introduce tu correo electró").click();
    await page1
      .getByPlaceholder("Introduce tu correo electró")
      .fill("playwright@playwright.com");
    await page1.getByPlaceholder("Introduce tu contraseña").click();
    await page1.getByPlaceholder("Introduce tu contraseña").fill("playwright");
    await page1.getByRole("button", { name: "Iniciar Sesión" }).click();

    await page2.getByPlaceholder("Introduce tu correo electró").click();
    await page2
      .getByPlaceholder("Introduce tu correo electró")
      .fill("other@other.com");
    await page2.getByPlaceholder("Introduce tu contraseña").click();
    await page2.getByPlaceholder("Introduce tu contraseña").fill("other");
    await page2.getByRole("button", { name: "Iniciar Sesión" }).click();

    await page1.waitForTimeout(1000);
    await page1.getByText("Partidos", { exact: true }).click();
    await page1.getByText("Crear partido").click();

    await page2.waitForTimeout(1000);
    await page2.getByText("Partidos", { exact: true }).click();
    await page2.getByText("Explorar partidos").click();
    await page2.getByRole("heading", { name: "Partidas disponibles" }).click();
    await expect(
      page2
        .locator("#no-partidas div")
        .filter({ hasText: "En este momento, no hay" })
        .nth(1)
    ).toBeVisible();

    await page1.getByPlaceholder("Introduce el nombre del").click();
    await page1
      .getByPlaceholder("Introduce el nombre del")
      .fill("PartidoPrueba");
    await page1.getByPlaceholder("Mínimo 2 jugadores").click();
    await page1.getByPlaceholder("Mínimo 2 jugadores").fill("2");
    await page1
      .locator("label")
      .filter({ hasText: "Duración Elige la duración" })
      .nth(1)
      .click();
    await page1.getByPlaceholder("Duración estimada en minutos").click();
    await page1.getByPlaceholder("Duración estimada en minutos").fill("2");
    await page1.getByRole("button", { name: "Crear Partido" }).click();

    //TOODO RETRADO
    await page1.getByRole("button", { name: "Crear Partida" }).click();

    await page2.locator("#partidas").click();
    await expect(
      page2.getByRole("heading", { name: "PartidoPrueba" })
    ).toBeVisible();
    await expect(page2.getByText("playwright@playwright.com")).toBeVisible();
    await expect(page2.getByText("Esperando...")).toBeVisible();
    await expect(page2.getByText("/2")).toBeVisible();
    await page2.getByText("PartidoPrueba playwright@").click();
    await page2.locator("#infoUnirse").getByText("PartidoPrueba").click();
    await page2.getByText("2", { exact: true }).click();
    await page2.getByText("minutos").click();
    await page2
      .getByRole("heading", { name: "playwright@playwright.com" })
      .click();
    await page2.locator("#modalUnirse").click();
    await page2.getByRole("button", { name: "Unirse a la partida" }).click();
    await page2.getByRole("button", { name: "✕" }).click();
    await page2.getByText("El código introducido no es").click();

    const passCodeElement = await page1.$("#codeGame");
    const passCode = await passCodeElement.textContent();

    //QUIERO SEPARAR EL PASSCODE EN 8 partes de 1 caracter
    const passCode1 = passCode.substring(0, 1);
    const passCode2 = passCode.substring(1, 2);
    const passCode3 = passCode.substring(2, 3);
    const passCode4 = passCode.substring(3, 4);
    const passCode5 = passCode.substring(4, 5);
    const passCode6 = passCode.substring(5, 6);
    const passCode7 = passCode.substring(6, 7);
    const passCode8 = passCode.substring(7, 8);

    await page2.getByText("PartidoPrueba playwright@").click();
    await page2.locator("#otp-modal-0").click();
    await page2.locator("#otp-0").press(passCode1);
    await page2.locator("#otp-1").press(passCode2);
    await page2.locator("#otp-2").press(passCode3);
    await page2.locator("#otp-3").press(passCode4);
    await page2.locator("#otp-4").press(passCode5);
    await page2.locator("#otp-5").press(passCode6);
    await page2.locator("#otp-6").press(passCode7);
    await page2.locator("#otp-7").press(passCode8);
    // await page2.locator("#modalUnirse").click();
    await page2.getByRole("button", { name: "Unirse a la partida" }).click();

    await page1.locator("#joinDiv label").nth(1).click();
    let cantidadBlue, cantidadRed;

    cantidadBlue = await page1.$("#cantidadBlue");
    cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 1");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 0");

    await page1.locator("#veribCheck svg").click();
    cantidadBlue = await page1.$("#cantidadBlue");
    cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 0");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 0");

    await page1.locator("#joinDiv label").nth(3).click();

    cantidadBlue = await page1.$("#cantidadBlue");
    cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 0");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 1");

    await page1.locator("#veribCheck path").click();
    await page1.locator("#verirCheck svg").click();

    cantidadBlue = await page1.$("#cantidadBlue");
    cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 0");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 0");

    await page2.getByRole("button", { name: "Salir" }).click();
    await page1.getByText("Se ha ido de la partida").click();
    await page2.getByText("Partidos", { exact: true }).click();
    await page2.getByText("Explorar partidos").click();
    await page2.locator("#otp-0").click();
    await page2.locator("#otp-0").press(passCode1);
    await page2.locator("#otp-1").press(passCode2);
    await page2.locator("#otp-2").press(passCode3);
    await page2.locator("#otp-3").press(passCode4);
    await page2.locator("#otp-4").press(passCode5);
    await page2.locator("#otp-5").press(passCode6);
    await page2.locator("#otp-6").press(passCode7);
    await page2.locator("#otp-7").press(passCode8);
    await page2.getByRole("button", { name: "Unirse al Partido" }).click();
    await page1.locator("#chatInputText").click();
    await page1.locator("#chatInputText").fill("Mensaje de prueba");
    await page1.getByRole("button", { name: "" }).click();
    await page1.getByText("playwright: Mensaje de prueba").click();
    await page2.locator("#chatInputText").click();
    await page2.locator("#chatInputText").fill("Mensaje de prueba 2");
    await page2.locator("#chatInputText").press("Enter");
    await page2.getByText("otherPlaywright: Mensaje de prueba 2").click();
    await page2.locator("#closeChat svg").click();

    //UNIRSE AL EQUIPO ROJO
    await page1.locator("#joinDiv label").nth(1).click();
    // cantidadBlue = await page1.$("#cantidadBlue");
    // cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 1");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 0");

    await page2.locator("#joinDiv label").nth(1).click();
    // cantidadBlue = await page1.$("#cantidadBlue");
    // cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 2");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 0");

    await expect(page1.getByRole("button", { name: "EMPEZAR" })).toBeVisible();
    await expect(page2.getByRole("button", { name: "EMPEZAR" })).toBeVisible();

    await page1.getByRole("button", { name: "EMPEZAR" }).click();
    await page1.getByRole("heading", { name: "⚠️ ¡Advertencia! ⚠️" }).click();
    await page1.getByText("Hay un equipo sin jugadores,").click();
    await page1.getByRole("button", { name: "Cancelar" }).click();

    await page2.getByRole("button", { name: "EMPEZAR" }).click();
    await page2.getByRole("heading", { name: "⚠️ ¡Advertencia! ⚠️" }).click();
    await page2.getByText("Hay un equipo sin jugadores,").click();
    await page2.getByRole("button", { name: "Cancelar" }).click();

    await page2.locator("#veribCheck svg").click();

    // cantidadBlue = await page1.$("#cantidadBlue");
    // cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 1");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 0");

    await page2.locator("#joinDiv label").nth(3).click();

    // cantidadBlue = await page1.$("#cantidadBlue");
    // cantidadRed = await page1.$("#cantidadRed");
    expect(await cantidadBlue.textContent()).toBe("Jugadores: 1");
    expect(await cantidadRed.textContent()).toBe("Jugadores: 1");

    await page1.getByRole("button", { name: "EMPEZAR" }).click();
    await page2.getByRole("button", { name: "Salir" }).click();
    await page2.getByText("Partidos", { exact: true }).click();
    await page2.getByText("Explorar partidos").click();
    await page2.locator("#otp-0").click();
    await page2.locator("#otp-0").press(passCode1);
    await page2.locator("#otp-1").press(passCode2);
    await page2.locator("#otp-2").press(passCode3);
    await page2.locator("#otp-3").press(passCode4);
    await page2.locator("#otp-4").press(passCode5);
    await page2.locator("#otp-5").press(passCode6);
    await page2.locator("#otp-6").press(passCode7);
    await page2.locator("#otp-7").press(passCode8);
    await page2.getByRole("button", { name: "Unirse al Partido" }).click();
    await page2.locator("#joinDiv label").nth(3).click();

    await page2.getByRole("button", { name: "EMPEZAR" }).click();
    await page1.getByRole("button", { name: "EMPEZAR" }).click();

    await page1.waitForTimeout(6000);
    await page1.reload();

    await page1.getByText("Partidos", { exact: true }).click();
    await page1.getByText("Explorar partidos").click();
    await page1.getByText("FINALIZADA").click();
    await page1
      .locator("#partidas")
      .getByText("playwright@playwright.com")
      .click();
    await page1.getByText("Equipo Azul:").click();
    await page1.getByText("Equipo Rojo:").click();
    await page1
      .locator("p")
      .filter({ hasText: "Equipo Azul:" })
      .locator("span")
      .click();
    await page1
      .locator("p")
      .filter({ hasText: "Equipo Rojo:" })
      .locator("span")
      .click();

    await page2.getByRole("button", { name: "Volver al Inicio" }).click();
  } catch (error) {
    console.error("Error en la prueba:", error);
  }
});
