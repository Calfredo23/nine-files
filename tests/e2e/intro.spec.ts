import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nine-files:setup:v1", "seen");
  });
});

test("the briefing greets first-time visitors and can be replayed", async ({
  page,
}) => {
  await page.goto("/");

  const intro = page.getByTestId("intro-dialog");
  await expect(intro).toBeVisible();
  await expect(intro).toContainText("Captain Hale");

  await page.getByTestId("intro-next").click();
  await page.getByTestId("intro-next").click();
  await page.getByTestId("intro-begin").click();
  await expect(intro).toBeHidden();

  await page.reload();
  await expect(page.getByTestId("intro-dialog")).toBeHidden();

  await page.getByTestId("open-briefing").click();
  await expect(page.getByTestId("intro-dialog")).toBeVisible();
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "submission/screenshots/intro.png",
    fullPage: false,
  });
});

test("the briefing has no axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-dialog")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});

