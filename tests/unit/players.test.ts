import { describe, expect, it } from "vitest";
import { playerFor } from "../../lib/players";

describe("playerFor", () => {
  it("maps both names to the coin-assigned marks", () => {
    const playerOneX = playerFor(
      "X",
      { mode: "two", userMark: "X", playerTwoName: "O'Rourke" },
      "Cedric",
    );
    const playerTwoO = playerFor(
      "O",
      { mode: "two", userMark: "X", playerTwoName: "O'Rourke" },
      "Cedric",
    );
    expect(playerOneX).toMatchObject({ name: "DET. CEDRIC", mark: "X" });
    expect(playerTwoO).toMatchObject({ name: "DET. O'ROURKE", mark: "O" });

    const playerOneO = playerFor(
      "O",
      { mode: "two", userMark: "O", playerTwoName: "Mara" },
      "Cedric",
    );
    const playerTwoX = playerFor(
      "X",
      { mode: "two", userMark: "O", playerTwoName: "Mara" },
      "Cedric",
    );
    expect(playerOneO).toMatchObject({ name: "DET. CEDRIC", mark: "O" });
    expect(playerTwoX).toMatchObject({ name: "DET. MARA", mark: "X" });
  });

  it("uses numbered secret detectives when both two-player names are blank", () => {
    const settings = { mode: "two", userMark: "O" } as const;
    expect(playerFor("O", settings, "").plain).toBe("Secret Detective 1");
    expect(playerFor("X", settings, "").plain).toBe("Secret Detective 2");
  });

  it("uses the secret detective fallback for a blank solo name", () => {
    const settings = { mode: "single", userMark: "O" } as const;
    expect(playerFor("O", settings, "").plain).toBe("Secret Detective");
    expect(playerFor("X", settings, "").name).toBe("THE HOUSE");
  });

  it("uses a numbered fallback for only the blank two-player name", () => {
    const settings = {
      mode: "two",
      userMark: "X",
      playerTwoName: "Mara",
    } as const;
    expect(playerFor("X", settings, "").plain).toBe("Secret Detective 1");
    expect(playerFor("O", settings, "").plain).toBe("Mara");
  });
});
