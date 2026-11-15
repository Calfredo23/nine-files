import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  parseSettings,
  SETTINGS_KEY,
} from "../../lib/settings";

describe("game settings", () => {
  it("defaults to local two-player with X", () => {
    expect(DEFAULT_SETTINGS).toEqual({ mode: "two", userMark: "X" });
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("nope")).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps a valid solo setting", () => {
    expect(parseSettings({ mode: "single", userMark: "O" })).toEqual({
      mode: "single",
      userMark: "O",
    });
  });

  it("repairs an invalid side or mode", () => {
    expect(parseSettings({ mode: "solo", userMark: "Q" })).toEqual(
      DEFAULT_SETTINGS,
    );
    expect(parseSettings({ mode: "single", userMark: "Q" })).toEqual({
      mode: "single",
      userMark: "X",
    });
  });

  it("uses a versioned storage key", () => {
    expect(SETTINGS_KEY).toBe("nine-files:settings:v1");
  });
});
