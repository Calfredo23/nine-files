import { describe, expect, it } from "vitest";
import { PLAYERS, playerFor } from "../../lib/players";

describe("playerFor", () => {
  it("keeps Cross and O'Rourke in two-player mode", () => {
    expect(playerFor("X", { mode: "two", userMark: "X" }, "Cedric")).toMatchObject(
      {
        name: "DET. CEDRIC",
        short: "CEDRIC",
        bot: false,
      },
    );
    expect(playerFor("O", { mode: "two", userMark: "X" }, "Cedric")).toBe(
      PLAYERS.O,
    );
  });

  it("puts the solo player on their chosen mark", () => {
    const x = playerFor("X", { mode: "single", userMark: "X" }, "Mara");
    const o = playerFor("O", { mode: "single", userMark: "X" }, "Mara");
    expect(x.short).toBe("MARA");
    expect(x.bot).toBe(false);
    expect(o.name).toBe("THE HOUSE");
    expect(o.bot).toBe(true);

    const xAsHouse = playerFor("X", { mode: "single", userMark: "O" }, "Mara");
    const oAsUser = playerFor("O", { mode: "single", userMark: "O" }, "Mara");
    expect(xAsHouse.name).toBe("THE HOUSE");
    expect(oAsUser.short).toBe("MARA");
  });

  it("falls back to the district names without a detective name", () => {
    expect(
      playerFor("O", { mode: "single", userMark: "O" }, "").plain,
    ).toBe("O'Rourke");
    expect(playerFor("X", { mode: "two", userMark: "X" }, null).name).toBe(
      "DET. CROSS",
    );
  });
});
