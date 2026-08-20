// @ts-check
import { expect, test } from "@playwright/test";

// 1) Navegación básica
test("Navegación básica", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const searchInput = page.getByRole("searchbox");

  await expect(searchInput).toBeVisible();
});

// 2) Búsqueda de empleos
test("Búsqueda de empleos", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("searchbox").fill("React");
  await page.getByRole("button", { name: "Buscar" }).click();

  // const jobCards = page.locator(".job-listing-card");
  await expect(
    page.getByRole("heading", { level: 2, name: /Resultados/ })
  ).toBeVisible();

  await expect(page.getByRole("article").first()).toBeVisible();
});

// 3) Flujo completo de aplicación
test("Flujo completo de aplicación", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("searchbox").fill("JavaScript");
  await page.getByRole("button", { name: "Buscar" }).click();

  // Reemplazamos page.locator(".job-listing-card") por getByRole('article')
  // const jobCards = page.locator(".job-listing-card");
  // await expect(jobCards.first()).toBeVisible();
  const firstJob = page.getByRole("article").first();
  await expect(firstJob).toBeVisible();

  // Antes se obtenía el título con jobCards.first().getByRole(...); ahora desde firstJob
  // const firstJobTitle = jobCards.first().getByRole("heading", { level: 3 });
  await firstJob.getByRole("heading", { level: 3 }).click();

  // Antes se validaba con page.locator("h2").first() y texto hardcodeado por posición
  // const descriptionTitle = page.locator("h2").first();
  // await expect(descriptionTitle).toHaveText("Descripcion del puesto");
  await expect(
    page.getByRole("heading", { level: 2, name: "Descripcion del puesto" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Iniciar Sesion" }).click();
  await page.getByRole("button", { name: "Aplicar" }).click();

  await expect(page.getByRole("button", { name: "Aplicado" })).toBeVisible();
});

// 4) Filtros por ubicación y nivel
test("Filtros por ubicación y nivel", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("link", { name: "Empleos" }).click();

  // Antes se usaba page.locator("#filter-location")
  // const locationSelect = page.locator("#filter-location");
  // await locationSelect.selectOption({ value: "guadalajara" });
  // Ubicamos los combobox por su posición (0 tecnología, 1 ubicación, 2 nivel)
  await page.getByRole("combobox").nth(1).selectOption({ label: "Remoto" });

  // Esperamos a que React Router refleje el filtro en la URL (sync con la API)
  await expect(page).toHaveURL(/modalidad=remoto/);

  // Esperamos una tarjeta que realmente pertenezca al filtro
  const remoteJob = page.locator('article[data-modalidad="remoto"]').first();
  await expect(remoteJob).toBeVisible();

  // Antes se contaba con count() y filter({visible:true}) (filtro inválido)
  // const countLocation = await jobCards.filter({ visible: true }).count();
  await page.getByRole("combobox").nth(1).selectOption(""); // limpiamos ubicación

  // Antes se usaba #filter-experience-level con value "mid"; ahora nivel Senior como pide la consigna
  // const levelSelect = page.locator("#filter-experience-level");
  // await levelSelect.selectOption({ value: "mid" });
  await page.getByRole("combobox").nth(2).selectOption({ label: "Senior" });

  // Esperamos a que el nivel seleccionado se refleje en la URL
  await expect(page).toHaveURL(/level=senior/);

  // Esperamos una tarjeta que pertenezca realmente al filtro senior
  const seniorJob = page.locator('article[data-nivel="senior"]').first();
  await expect(seniorJob).toBeVisible();
});

// 5) Paginación
test("Paginación", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("link", { name: "Empleos" }).click();

  // Antes se localizaba con page.locator("[data-page]") y se pulsaba nth(1) (página 2)
  // const paginationButtons = page.locator("[data-page]");
  // const nextPage ahora usa el aria-label "Siguiente" que agregamos en el componente de paginación
  const nextPage = page.getByRole("link", { name: "Siguiente" });
  await expect(nextPage).toBeVisible();

  // Guardamos el texto del primer resultado para comparar tras navegar
  const firstResultOnFirstPage = await page.getByRole("article").first().innerText();

  await nextPage.click();

  // Antes se comparaba con page.locator("h3").first() y un texto fijo ("Diseñador UX/UI")
  // const descriptionTitle = page.locator("h3").first();
  // await expect(descriptionTitle).toHaveText("Diseñador UX/UI");
  await expect(page.getByRole("article").first()).not.toHaveText(firstResultOnFirstPage);
});

// 6) Detalle de empleo
test("Detalle de empleo", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("link", { name: "Empleos" }).click();

  // Sustituimos los locators de clase por getByRole('article')
  // const jobCards = page.locator(".job-listing-card");
  const firstJob = page.getByRole("article").first();
  await expect(firstJob).toBeVisible();

  await firstJob.getByRole("heading", { level: 3 }).click();

  // const descriptionTitle = page.locator("h2").first();
  await expect(
    page.getByRole("heading", { level: 2, name: "Descripcion del puesto" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByRole("button", { name: "Aplicado" })).toBeVisible();
});
