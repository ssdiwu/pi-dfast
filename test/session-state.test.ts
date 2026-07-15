import { describe, expect, it } from "vitest";
import { parseSessionState, restoreSessionEnabled, SESSION_ENTRY_TYPE } from "../src/session-state.js";

describe("session-scoped Fast Mode state", () => {
  it("defaults every session without a state entry to disabled", () => {
    expect(restoreSessionEnabled([])).toBe(false);
    expect(restoreSessionEnabled([{ type: "message", role: "user" }])).toBe(false);
  });

  it("restores the latest valid state from the active branch", () => {
    expect(restoreSessionEnabled([
      { type: "custom", customType: SESSION_ENTRY_TYPE, data: { version: 1, enabled: true } },
      { type: "custom", customType: "other-extension", data: { enabled: false } },
      { type: "custom", customType: SESSION_ENTRY_TYPE, data: { version: 1, enabled: false } },
    ])).toBe(false);
  });

  it("ignores malformed or incompatible state entries", () => {
    expect(parseSessionState({ version: 2, enabled: true })).toBeUndefined();
    expect(parseSessionState({ version: 1, enabled: "yes" })).toBeUndefined();
    expect(restoreSessionEnabled([
      { type: "custom", customType: SESSION_ENTRY_TYPE, data: { version: 1, enabled: true } },
      { type: "custom", customType: SESSION_ENTRY_TYPE, data: { version: 2, enabled: false } },
    ])).toBe(true);
  });
});
