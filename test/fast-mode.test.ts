import { describe, expect, it } from "vitest";
import { applyFastServiceTier, createSnapshot, fastModeReason, shouldApplyFastMode } from "../src/fast-mode.js";

describe("Fast Mode request eligibility", () => {
  it.each(["gpt-5.4", "gpt-5.5", "gpt-5.6-luna", "gpt-5.6-sol", "gpt-5.6-terra"])(
    "supports openai-codex/%s",
    (id) => {
      const model = { provider: "openai-codex", id };
      expect(fastModeReason(true, model)).toBe("supported");
      expect(shouldApplyFastMode(true, model, { model: id })).toBe(true);
    },
  );

  it("rejects disabled, unsupported-provider, unsupported-model, and payload mismatches", () => {
    expect(shouldApplyFastMode(false, { provider: "openai-codex", id: "gpt-5.6-luna" }, { model: "gpt-5.6-luna" })).toBe(false);
    expect(shouldApplyFastMode(true, { provider: "openai", id: "gpt-5.6-luna" }, { model: "gpt-5.6-luna" })).toBe(false);
    expect(shouldApplyFastMode(true, { provider: "openai-codex", id: "gpt-5.4-mini" }, { model: "gpt-5.4-mini" })).toBe(false);
    expect(shouldApplyFastMode(true, { provider: "openai-codex", id: "gpt-5.6-luna" }, { model: "gpt-5.6-sol" })).toBe(false);
  });

  it("adds only service_tier without mutating the original payload", () => {
    const payload = { model: "gpt-5.6-luna", input: "hello", text: { verbosity: "high" } };
    expect(applyFastServiceTier(payload)).toEqual({ ...payload, service_tier: "priority" });
    expect(payload).not.toHaveProperty("service_tier");
  });

  it("publishes enabled and active as separate state", () => {
    expect(createSnapshot(true, { provider: "openai-codex", id: "gpt-5.6-luna" }, 42)).toMatchObject({
      version: 1,
      enabled: true,
      active: true,
      reason: "supported",
      updatedAt: 42,
    });
    expect(createSnapshot(true, { provider: "minimax-cn", id: "MiniMax-M2.5" }, 43)).toMatchObject({
      enabled: true,
      active: false,
      reason: "unsupported-provider",
    });
  });
});
