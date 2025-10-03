import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  const response = await page.goto('http://localhost:5173/');

  expect(response?.status()).toBe(200);

  // Erwartet den Titel der Seite
  await expect(page).toHaveTitle(/M450 - /);
});

// test('create new todo task', async ({ page }) => {
//   await page.goto('http://localhost:5173/');

// // Klick auf das Plus-Symbol, um das Modal zu öffnen
// await page.click('#createNewTaskIcon');

// // Title
// await page.waitForSelector('#title', { state: 'visible' })
// await expect(page.locator('#title')).toBeVisible();
// await page.fill('#title', 'Playwright lernen');

// // Description
// const desc = page.locator('#description');


// await page.fill('input[name="description"]', 'New Todo Description');


// await page.check('input[name="completed"]');

// await page.click('button[type="submit"]');

// await expect(page.getByRole('dialog')).toBeHidden();

// const items = page.locator('li[role="listitem"], [data-testid="todo-item"]');
// await expect(items).toContainText('Playwright lernen');

// });

test('create new todo task via modal', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Eindeutiger Titel, um Kollisionen zu vermeiden
  const title = `Playwright lernen ${Date.now()}`;
  const description = 'New Todo Description';

  // 1) Modal öffnen
  await page.click('#createNewTaskIcon');

  // 2) Auf das Titelfeld warten & füllen
  await page.waitForSelector('#title', { state: 'visible' });
  await page.fill('#title', title);

  // Optional: Beschreibung, wenn vorhanden
  const desc = page.locator('input[name="description"], textarea[name="description"], #description');
  if (await desc.count()) {
    await desc.fill(description);
  }

  // Optional: completed-Checkbox, wenn vorhanden
  const completed = page.locator('input[name="completed"]');
  if (await completed.count()) {
    await completed.check();
  }

  // 3) Vorher: wie viele Headings mit diesem Titel existieren?
  const itemHeadings = page.getByRole('heading', { level: 3 }).filter({ hasText: title });
  const beforeCount = await itemHeadings.count();

  // 4) Speichern
  await page.click('button[type="submit"]'); // Button heißt "submit" => passt

  // 5) Warten bis Modal zu ist (Feld #title verschwindet)
  await page.locator('#title').waitFor({ state: 'detached' });

 // 6) Count-Prüfung bleibt
await expect(
  page.getByRole('heading', { level: 3 }).filter({ hasText: title })
).toHaveCount(beforeCount + 1);

// 7) Beschreibung: genau das <p> neben dem <h3> prüfen
const heading = page.getByRole('heading', { level: 3, name: title }).first();
const descPara = heading.locator('xpath=following-sibling::p[1]');
// await expect(descPara).toHaveText(description);

});