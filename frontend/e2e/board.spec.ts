import { expect, test } from "@playwright/test";

test("shows five columns and dummy cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Product launch" })).toBeVisible();
  await expect(page.locator(".column")).toHaveCount(5);
  await expect(page.getByText("Research competitors")).toBeVisible();
});

test("renames a column and adds and deletes a card", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Backlog", exact: true }).click();
  const renameInput = page.getByLabel("Rename Backlog");
  await expect(renameInput).toBeVisible();
  await renameInput.fill("Ideas");
  await renameInput.press("Enter");
  await expect(page.getByRole("button", { name: "Ideas" })).toBeVisible();

  const backlog = page.locator(".column").filter({ hasText: "Ideas" });
  await backlog.getByRole("button", { name: "Add card" }).click();
  await backlog.getByLabel("Card title").fill("Browser test card");
  await backlog.getByLabel("Card details").fill("Created during integration testing");
  await backlog.getByRole("button", { name: "Add card" }).click();
  await expect(backlog.getByText("Browser test card")).toBeVisible();

  await backlog.getByRole("button", { name: "Delete Browser test card", exact: true }).click();
  await expect(backlog.getByText("Browser test card")).toHaveCount(0);
});

test("drags a card into another column", async ({ page }) => {
  await page.goto("/");

  const card = page.getByText("Research competitors").locator("xpath=ancestor::article");
  const doneColumn = page.locator(".column").filter({ hasText: "Done" });
  const cardBox = await card.boundingBox();
  const doneBox = await doneColumn.boundingBox();
  if (!cardBox || !doneBox) throw new Error("Drag targets were not visible");

  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(doneBox.x + doneBox.width / 2, doneBox.y + 100, { steps: 12 });
  await page.mouse.up();
  await expect(doneColumn.getByText("Research competitors")).toBeVisible();
});

test("reorders a card below another card in the same column", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");
  const firstCard = page.getByText("Research competitors").locator("xpath=ancestor::article");
  const secondCard = page.getByText("Write product brief").locator("xpath=ancestor::article");
  const firstBox = await firstCard.boundingBox();
  const secondBox = await secondCard.boundingBox();
  if (!firstBox || !secondBox) throw new Error("Reorder targets were not visible");

  await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height - 8, { steps: 15 });
  await page.mouse.up();

  const ids = await page.locator(".column").first().locator(".card h3").allTextContents();
  expect(ids).toEqual(["Write product brief", "Research competitors"]);
  expect(consoleErrors.filter((error) => !error.includes("favicon"))).toEqual([]);
});

test("tolerates attributes injected on html before hydration", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.addInitScript(() => {
    document.documentElement.style.setProperty("--funlingo-caption-scale", "1.000");
    document.documentElement.style.setProperty("--flsp-margin", "12px");
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(consoleErrors.filter((error) => error.includes("hydrated"))).toEqual([]);
});
