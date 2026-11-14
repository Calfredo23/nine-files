import { expect, test, type Page } from "@playwright/test";

async function play(page: Page, indexes: readonly number[]) {
  for (const index of indexes) {
    await page.getByTestId(`cell-${index}`).click();
  }
}

test("two players alternate and marks appear", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("turn-label")).toHaveText("CROSS TO FILE");
  await expect(page.getByTestId("cell-0")).toHaveAttribute("aria-label", /empty/);

  await page.getByTestId("cell-0").click();
  await expect(page.getByTestId("cell-0")).toHaveAttribute("aria-label", /CROSS/);
  await expect(page.getByTestId("turn-label")).toHaveText("O'ROURKE TO FILE");

  await page.getByTestId("cell-1").click();
  await expect(page.getByTestId("cell-1")).toHaveAttribute("aria-label", /O'ROURKE/);
  await expect(page.getByTestId("turn-label")).toHaveText("CROSS TO FILE");

  await expect(page.getByTestId("move-log")).toContainText("A1");
  await expect(page.getByTestId("move-log")).toContainText("A2");
});

test("a win is announced and the ledger records it", async ({ page }) => {
  await page.goto("/");
  await play(page, [0, 3, 1, 4, 2]);

  const result = page.getByTestId("result");
  await expect(result).toBeVisible();
  await expect(result).toHaveText("CROSS WINS — CASE CLOSED");
  await expect(page.getByTestId("ledger-cross")).toHaveText("01");
  await expect(page.getByTestId("stamp")).toContainText("CASE CLOSED");

  await expect(result).toBeFocused();
});

test("a draw is announced", async ({ page }) => {
  await page.goto("/");
  await play(page, [0, 1, 2, 4, 3, 5, 7, 6, 8]);

  const result = page.getByTestId("result");
  await expect(result).toHaveText("DRAW — COLD CASE");
  await expect(page.getByTestId("ledger-cold")).toHaveText("01");
  await expect(page.getByTestId("stamp")).toContainText("COLD CASE");
});

test("new game clears the board and keeps the ledger", async ({ page }) => {
  await page.goto("/");
  await play(page, [0, 3, 1, 4, 2]);
  await expect(page.getByTestId("ledger-cross")).toHaveText("01");

  await page.getByTestId("new-game").click();

  await expect(page.getByTestId("result")).toHaveCount(0);
  await expect(page.getByTestId("turn-label")).toHaveText("CROSS TO FILE");
  for (let index = 0; index < 9; index += 1) {
    await expect(page.getByTestId(`cell-${index}`)).toHaveAttribute(
      "aria-label",
      /empty/,
    );
  }
  await expect(page.getByTestId("ledger-cross")).toHaveText("01");
});

test("the ledger survives a reload", async ({ page }) => {
  await page.goto("/");
  await play(page, [0, 3, 1, 4, 2]);
  await expect(page.getByTestId("ledger-cross")).toHaveText("01");

  await page.reload();
  await expect(page.getByTestId("ledger-cross")).toHaveText("01");
});

test("the board is playable with the keyboard", async ({ page }) => {
  await page.goto("/");

  const first = page.getByTestId("cell-0");
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("cell-0")).toHaveAttribute("aria-label", /CROSS/);

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("cell-1")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("cell-1")).toHaveAttribute("aria-label", /O'ROURKE/);

  await page.keyboard.press("ArrowDown");
  await expect(page.getByTestId("cell-4")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("cell-4")).toHaveAttribute("aria-label", /CROSS/);

  await page.keyboard.press("End");
  await expect(page.getByTestId("cell-8")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByTestId("cell-0")).toBeFocused();
});

test("an occupied cell cannot be claimed twice", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("cell-4").click();
  await page.getByTestId("cell-4").click({ force: true });
  await expect(page.getByTestId("cell-4")).toHaveAttribute("aria-label", /CROSS/);
  await expect(page.getByTestId("turn-label")).toHaveText("O'ROURKE TO FILE");
  await expect(page.getByTestId("move-log")).toContainText("B2");
});
