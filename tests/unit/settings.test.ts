import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  parseSettings,
  SETTINGS_KEY,
} from "../../lib/settings";

describe("game settings", () => {
  it("defaults to local two-player with X", () => {
    expect(DEFAULT_SETTINGS).toEqual({
      mode: "two",
      userMark: "X",
      playerTwoName: "",
    });
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("nope")).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps a valid solo setting", () => {
    expect(
      parseSettings({
        mode: "single",
        userMark: "O",
        playerTwoName: "Mara Vale",
      }),
    ).toEqual({
      mode: "single",
      userMark: "O",
      playerTwoName: "Mara Vale",
    });
  });

  it("repairs an invalid side or mode", () => {
    expect(parseSettings({ mode: "solo", userMark: "Q" })).toEqual(
      DEFAULT_SETTINGS,
    );
    expect(parseSettings({ mode: "single", userMark: "Q" })).toEqual({
      mode: "single",
      userMark: "X",
      playerTwoName: "",
    });
  });

  it("normalizes the second player's stored name", () => {
    expect(
      parseSettings({ mode: "two", userMark: "O", playerTwoName: "  Mara   Vale  " }),
    ).toEqual({ mode: "two", userMark: "O", playerTwoName: "Mara Vale" });
  });

  it("uses a versioned storage key", () => {
    expect(SETTINGS_KEY).toBe("nine-files:settings:v1");
  });
});
