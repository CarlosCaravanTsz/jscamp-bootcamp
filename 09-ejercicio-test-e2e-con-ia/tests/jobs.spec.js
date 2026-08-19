// @ts-check
import { test, expect } from "@playwright/test";

// Test de navegacion basica
test("Test Navegacion Basica", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const searchInput = page.getByRole("searchbox");

  await expect(searchInput).toBeVisible();
});

// Test de busqueda de empleos
test("Test de Busqueda de empleos", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const searchInput = page.getByRole("searchbox");
  await searchInput.fill("React");

  await page.getByRole("button", { name: "Buscar" }).click();

  const jobCards = page.locator(".job-listing-card");

  await expect(jobCards.first()).toBeVisible();
});

// Test de flujo completo de aplicacion

test("Test de flujo completo de aplicacion", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const searchInput = page.getByRole("searchbox");
  await searchInput.fill("JavaScript");

  await page.getByRole("button", { name: "Buscar" }).click();

  const jobCards = page.locator(".job-listing-card");

  await expect(jobCards.first()).toBeVisible();

  const firstJobTitle = jobCards.first().getByRole("heading", { level: 3 });

  await expect(firstJobTitle).toHaveText("Desarrollador de Software Senior");

  await firstJobTitle.click();

  const descriptionTitle = page.locator("h2").first();

  await expect(descriptionTitle).toHaveText("Descripcion del puesto"); // vista de detalle empleo

  await page.getByRole("button", { name: "Iniciar Sesion" }).click(); // click en iniciar sesion

  const applyButton = page.getByRole("button", { name: "Aplicar" });
  await applyButton.click(); // click en aplicar

  await expect(page.getByRole("button", { name: "Aplicado" })).toBeVisible(); // se espera que el boton tenga el texto Aplicado
});

// Test de filtros

test("Test de filtros", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("link", { name: "Empleos" }).click();

  // Probar filtro por ubicacion
  const locationSelect = page.locator("#filter-location");
  await locationSelect.selectOption({ value: "guadalajara" });

  const jobCards = page.locator(".job-listing-card");
  await expect(jobCards.first()).toBeVisible();

  const countLocation = await jobCards.filter({ visible: true }).count();
  await expect(countLocation).toBe(3);

  // Probar filtro por nivel

  const levelSelect = page.locator("#filter-experience-level");
  await locationSelect.selectOption({ value: "" }); // limpiar el de location

  await levelSelect.selectOption({ value: "mid" });

  const newJobCards = page.locator(".job-listing-card");
  await expect(newJobCards.first()).toBeVisible();
  const countLevel = await newJobCards.filter({ visible: true }).count();
  await expect(countLevel).toBe(1);
});

// Test de paginacion
test("Test de paginacion", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("link", { name: "Empleos" }).click();

  const paginationButtons = page.locator("[data-page]");

  await expect(paginationButtons.first()).toBeVisible();

  const count = await paginationButtons.filter({ visible: true }).count();

  await expect(count).toBeGreaterThanOrEqual(1);

  await paginationButtons.nth(1).click();

  const descriptionTitle = page.locator("h3").first();

  await expect(descriptionTitle).toHaveText("Diseñador UX/UI"); // cambiaron los empleos
});

// Test de detalle de empleo
test("Test de detalle de empleo", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("link", { name: "Empleos" }).click();

  const jobCards = page.locator(".job-listing-card");
  await expect(jobCards.first()).toBeVisible();

  const firstJobTitle = jobCards.first().getByRole("heading", { level: 3 });

  await expect(firstJobTitle).toHaveText("Desarrollador de Software Senior");

  await firstJobTitle.click();

  const descriptionTitle = page.locator("h2").first();

  await expect(descriptionTitle).toHaveText("Descripcion del puesto"); // vista de detalle empleo

  const applyButton = page.getByRole("button", { name: "Aplicar" });

  await applyButton.click(); // click en aplicar

  await expect(page.getByRole("button", { name: "Aplicado" })).toBeVisible(); // se espera que el boton tenga el texto Aplicado
});
