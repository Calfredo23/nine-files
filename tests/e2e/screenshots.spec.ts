import { mkdir } from "node:fs/promises";
import { expect, test, type Browser } from "@playwright/test";

const OUT = "submission/screenshots";

const MOVES = [0, 3, 1] as const;
const FINISH = [4, 2] as const;

async function capture(
  browser: Browser,
  name: string,
  viewport: { width: number; height: number },
  options: {
    isMobile?: boolean;
    hasTouch?: boolean;
    deviceScaleFactor?: number;
  } = {},
) {
  const context = await browser.newContext({ viewport, ...options });
  await context.addInitScript(() => {
    window.localStorage.setItem("nine-files:intro:v1", "seen");
    window.localStorage.setItem("nine-files:setup:v1", "seen");
  });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.getByTestId("turn-label")).toBeVisible();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/${name}-board.png`, fullPage: true });

  for (const index of MOVES) {
    await page.getByTestId(`cell-${index}`).click();
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}-midgame.png`, fullPage: true });

  for (const index of FINISH) {
    await page.getByTestId(`cell-${index}`).click();
  }
  await expect(page.getByTestId("result")).toBeVisible();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/${name}-win.png`, fullPage: true });

  if (name === "desktop") {
    await expect(page.getByTestId("post-match-dialog")).toBeVisible({
      timeout: 4000,
    });
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `${OUT}/desktop-post-match.png`,
      fullPage: false,
    });
    await page.getByTestId("post-match-stay").click();

    await page.getByTestId("open-history").click();
    await expect(page.getByTestId("history-dialog")).toBeVisible();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${OUT}/desktop-history.png`,
      fullPage: false,
    });
    await page.getByTestId("history-close").click();
  }

  await context.close();
}

test("capture submission screenshots", async ({ browser }) => {
  test.setTimeout(120_000);
  await mkdir(OUT, { recursive: true });

  await capture(browser, "desktop", { width: 1440, height: 900 });
  await capture(browser, "tablet", { width: 768, height: 1024 });
  await capture(
    browser,
    "mobile",
    { width: 390, height: 844 },
    { isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  );
});

