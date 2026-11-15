import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nine-files:intro:v1", "seen");
  });
});

test("full-screen tip, name, and mode selection", async ({ page }) => {
  await page.goto("/");

  const setup = page.getByTestId("setup-dialog");
  await expect(setup).toBeVisible();
  await expect(setup).toContainText("F11");
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "submission/screenshots/setup.png",
    fullPage: false,
  });

  await page.getByTestId("setup-next").click();
  await expect(page.getByTestId("detective-name")).toBeVisible();
  await page.getByTestId("detective-name").fill("Mara");
  await page.getByTestId("setup-next").click();

  await expect(setup).toContainText("GAME MODE");
  await page.getByTestId("setup-mode-two").click();
  await page.getByTestId("setup-next").click();
  await expect(page.getByTestId("player-two-name")).toBeVisible();
  await page.getByTestId("player-two-name").fill("Owen");
  await page.getByTestId("setup-next").click();

  await expect(setup).toContainText("COIN TOSS");
  await expect(page.getByTestId("setup-start")).toBeDisabled();
  await page.getByTestId("setup-toss").click();
  await expect(page.getByTestId("coin-result")).toContainText(
    /Mara gets X and opens|Owen gets X and opens/,
    { timeout: 4000 },
  );
  const tossResult = await page.getByTestId("coin-result").innerText();
  const playerOneMark = tossResult.includes("Mara gets X") ? "X" : "O";
  const xPlayerName = playerOneMark === "X" ? "MARA" : "OWEN";
  const playerTwoMark = playerOneMark === "X" ? "O" : "X";

  await expect(page.getByTestId("setup-start")).toBeEnabled();
  await page.screenshot({
    path: "submission/screenshots/setup-two-player-toss.png",
    fullPage: false,
  });
  await page.getByTestId("setup-start").click();
  await expect(setup).toBeHidden();
  await expect(page.getByTestId("detective-X")).toContainText(`DET. ${xPlayerName}`);
  await expect(page.getByTestId(`detective-${playerTwoMark}`)).toContainText(
    playerOneMark === "X" ? "DET. OWEN" : "DET. MARA",
  );
  await expect(page.getByTestId("mode-label")).toContainText(
    `TWO PLAYERS · P1 ${playerOneMark}`,
  );
  await expect(page.getByTestId("turn-label")).toHaveText(`${xPlayerName}'S TURN`);

  await page.reload();
  await expect(page.getByTestId("setup-dialog")).toBeHidden();
  await expect(page.getByTestId("detective-X")).toContainText(`DET. ${xPlayerName}`);

  await page.getByTestId("open-setup").click();
  await expect(page.getByTestId("setup-dialog")).toBeVisible();
  await page.getByTestId("detective-name").fill("Mara Vale");
  await page.getByTestId("setup-start").click();
  await expect(page.getByTestId(`detective-${playerOneMark}`)).toContainText(
    "DET. MARA VALE",
  );
  await expect(page.getByTestId(`detective-${playerTwoMark}`)).toContainText(
    "DET. OWEN",
  );
});

test("blank two-player names become numbered secret detectives", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-mode-two").click();
  await page.getByTestId("setup-next").click();
  await page.getByTestId("setup-next").click();

  await page.getByTestId("setup-toss").click();
  await expect(page.getByTestId("coin-result")).toContainText(
    /Secret Detective [12] gets X and opens/,
    { timeout: 4000 },
  );
  const result = await page.getByTestId("coin-result").innerText();
  const firstName = result.includes("Secret Detective 1 gets X")
    ? "SECRET DETECTIVE 1"
    : "SECRET DETECTIVE 2";
  const playerOneMark = result.includes("Secret Detective 1 gets X") ? "X" : "O";
  const playerTwoMark = playerOneMark === "X" ? "O" : "X";

  await page.getByTestId("setup-start").click();
  await expect(page.getByTestId(`detective-${playerOneMark}`)).toContainText(
    "DET. SECRET DETECTIVE 1",
  );
  await expect(page.getByTestId(`detective-${playerTwoMark}`)).toContainText(
    "DET. SECRET DETECTIVE 2",
  );
  await expect(page.getByTestId("turn-label")).toHaveText(`${firstName}'S TURN`);
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
