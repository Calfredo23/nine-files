import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nine-files:intro:v1", "seen");
  });
});

test("full-screen tip then the detective name", async ({ page }) => {
  await page.goto("/");

  const setup = page.getByTestId("setup-dialog");
  await expect(setup).toBeVisible();
  await expect(setup).toContainText("F11");
  await page.screenshot({
    path: "submission/screenshots/setup.png",
    fullPage: false,
  });

  await page.getByTestId("setup-next").click();
  await expect(page.getByTestId("detective-name")).toBeVisible();
  await page.getByTestId("detective-name").fill("Mara");
  await page.getByTestId("setup-start").click();

  await expect(setup).toBeHidden();
  await expect(page.getByTestId("detective-X")).toContainText("DET. MARA");

  await page.reload();
  await expect(page.getByTestId("setup-dialog")).toBeHidden();
  await expect(page.getByTestId("detective-X")).toContainText("DET. MARA");

  await page.getByTestId("open-setup").click();
  await expect(page.getByTestId("setup-dialog")).toBeVisible();
  await page.getByTestId("detective-name").fill("Mara Vale");
  await page.getByTestId("setup-start").click();
  await expect(page.getByTestId("detective-X")).toContainText("DET. MARA VALE");
});

test("the setup has no axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("setup-dialog")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});
