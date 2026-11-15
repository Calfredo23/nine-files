import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nine-files:intro:v1", "seen");
  });
});

async function startSolo(page: Page, side: "X" | "O") {
  await page.goto("/");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("detective-name").fill("Mara");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-mode-single").click();
  await page.getByTestId("setup-next").click();
  await page.getByTestId(`setup-side-${side}`).click();
  await page.getByTestId("setup-start").click();
}

test("solo as X: the House answers and the mode persists", async ({ page }) => {
  await startSolo(page, "X");

  await expect(page.getByTestId("mode-label")).toContainText(
    "SINGLE · YOU X",
  );
  await expect(page.getByTestId("detective-X")).toContainText("DET. MARA");
  await expect(page.getByTestId("detective-O")).toContainText("THE HOUSE");
  await expect(page.getByTestId("detective-O")).toContainText(
    "BADGE CPU · AUTOMATED",
  );
  await expect(page.getByTestId("turn-label")).toHaveText("MARA'S TURN");

  await page.getByTestId("cell-0").click();
  await expect(page.getByTestId("turn-label")).toHaveText(
    "THE HOUSE'S TURN",
  );
  await expect(page.getByTestId("detective-O")).toContainText("THINKING");
  await expect(page.getByTestId("turn-label")).toHaveText("MARA'S TURN", {
    timeout: 4000,
  });
  await expect(page.getByTestId("move-log")).toContainText("THE HOUSE");
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "submission/screenshots/desktop-solo.png",
    fullPage: true,
  });

  await page.reload();
  await expect(page.getByTestId("mode-label")).toContainText(
    "SINGLE · YOU X",
  );
  await expect(page.getByTestId("detective-O")).toContainText("THE HOUSE");
});

test("solo as O: the House opens the case", async ({ page }) => {
  await startSolo(page, "O");

  await expect(page.getByTestId("mode-label")).toContainText(
    "SINGLE · YOU O",
  );
  await expect(page.getByTestId("detective-O")).toContainText("DET. MARA");
  await expect(page.getByTestId("detective-X")).toContainText("THE HOUSE");
  await expect(page.getByTestId("turn-label")).toHaveText(
    "THE HOUSE'S TURN",
  );
  await expect(page.getByTestId("turn-label")).toHaveText("MARA'S TURN", {
    timeout: 4000,
  });
});

test("the coin toss picks a side and starts the match", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("detective-name").fill("Mara");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-mode-single").click();
  await page.getByTestId("setup-next").click();

  await expect(page.getByTestId("setup-dialog")).toContainText("YOUR SIDE");
  await page.getByTestId("setup-toss").click();
  await expect(page.getByTestId("coin-result")).toContainText(
    "The coin is in the air.",
  );
  await expect(page.getByTestId("coin-result")).toContainText(
    /The coin lands on [XO]/,
    { timeout: 4000 },
  );

  const copy = await page.getByTestId("coin-result").innerText();
  const mark = copy.includes("lands on X") ? "X" : "O";
  await expect(page.getByTestId(`setup-side-${mark}`)).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.screenshot({
    path: "submission/screenshots/setup-side.png",
    fullPage: false,
  });

  await page.getByTestId("setup-start").click();
  await expect(page.getByTestId("mode-label")).toContainText(
    `SINGLE · YOU ${mark}`,
  );
  await expect(page.getByTestId("setup-dialog")).toBeHidden();
});

test("new game restarts into a fresh solo setup", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nine-files:setup:v1", "seen");
    window.localStorage.setItem("nine-files:name:v1", "Cedric");
  });
  await page.goto("/");
  for (const index of [0, 3, 1, 4, 2]) {
    await page.getByTestId(`cell-${index}`).click();
  }
  await expect(page.getByTestId("ledger-cross")).toHaveText("01");

  await expect(page.getByTestId("post-match-dialog")).toBeVisible({
    timeout: 4000,
  });
  await page.getByTestId("post-match-stay").click();
  await page.getByTestId("new-game").click();

  await expect(page.getByTestId("intro-dialog")).toBeVisible();
  await page.getByTestId("intro-skip").click();

  const setup = page.getByTestId("setup-dialog");
  await expect(setup).toContainText("FULL SCREEN");
  await page.getByTestId("setup-next").click();
  await expect(page.getByTestId("detective-name")).toHaveValue("Cedric");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-mode-single").click();
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-side-O").click();
  await page.getByTestId("setup-start").click();

  await expect(setup).toBeHidden();
  await expect(page.getByTestId("mode-label")).toContainText("SINGLE · YOU O");
  await expect(page.getByTestId("detective-X")).toContainText("THE HOUSE");
  await expect(page.getByTestId("detective-O")).toContainText("DET. CEDRIC");
  await expect(page.getByTestId("ledger-cross")).toHaveText("00");
  await expect(page.getByTestId("turn-label")).toHaveText("CEDRIC'S TURN", {
    timeout: 4000,
  });
});

test("the solo side step has no axe violations", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("detective-name").fill("Mara");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-mode-single").click();
  await page.getByTestId("setup-next").click();
  await expect(page.getByTestId("setup-toss")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});
