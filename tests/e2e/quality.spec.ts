import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nine-files:intro:v1", "seen");
  });
});

async function play(page: Page, indexes: readonly number[]) {
  for (const index of indexes) {
    await page.getByTestId(`cell-${index}`).click();
  }
}

function summarize(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      summary: node.failureSummary,
    })),
  }));
}

test("axe finds no violations on the opening screen", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(summarize(results.violations)).toEqual([]);
});

test("axe finds no violations after a win", async ({ page }) => {
  await page.goto("/");
  await play(page, [0, 3, 1, 4, 2]);
  await expect(page.getByTestId("result")).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(summarize(results.violations)).toEqual([]);
});

test("layouts fit 360, 768 and 1440 without horizontal scroll", async ({
  page,
}) => {
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const report = await page.evaluate(() => {
      const cells = Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid^="cell-"]'),
      );
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        smallestCell: Math.min(
          ...cells.map((cell) => cell.getBoundingClientRect().width),
        ),
      };
    });
    expect(report.scrollWidth).toBeLessThanOrEqual(report.innerWidth + 1);
    expect(report.smallestCell).toBeGreaterThanOrEqual(44);
  }
});

test("desktop fits the whole game without page scroll", async ({ page }) => {
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [1280, 800],
    [1024, 768],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const report = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      newGameBottom:
        document
          .querySelector('[data-testid="new-game"]')
          ?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
    }));
    expect(report.scrollHeight).toBeLessThanOrEqual(report.innerHeight + 1);
    expect(report.newGameBottom).toBeLessThanOrEqual(report.innerHeight);
  }
});

test("the captain reacts to a move", async ({ page }) => {
  await page.goto("/");
  const coach = page.locator('[data-testid="coach"]:visible');
  await expect(coach).toContainText(/X starts/i);

  await page.getByTestId("cell-4").click();
  await expect(coach).toContainText(/center/i);
  await expect(
    page.locator('[data-testid="coach-grade"]:visible'),
  ).toHaveText("GOOD");
  await expect(
    page.locator(".captain.captain-speaking:visible"),
  ).toHaveCount(1);
});

test("reduced motion still produces a complete result", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await play(page, [0, 3, 1, 4, 2]);
  await expect(page.getByTestId("result")).toHaveText(
    "CROSS WINS — CASE CLOSED",
  );
  await expect(page.getByTestId("stamp")).toBeVisible();
});

test("no console errors or uncaught exceptions during a full game", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");
  await play(page, [0, 3, 1, 4, 2]);
  await expect(page.getByTestId("result")).toBeVisible();
  await page.getByTestId("new-game").click();
  await page.getByTestId("sound-toggle").click();

  expect(errors).toEqual([]);
});
