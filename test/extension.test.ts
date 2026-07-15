import { describe, expect, it, vi } from "vitest";
import dfastExtension from "../index.js";
import { SESSION_ENTRY_TYPE } from "../src/session-state.js";

function harness() {
  const handlers = new Map<string, (...args: any[]) => any>();
  const commands = new Map<string, { handler: (...args: any[]) => any }>();
  const listeners = new Map<string, Set<(data: unknown) => void>>();
  let activeBranch: any[] = [];
  const events = {
    on(name: string, listener: (data: unknown) => void) {
      const group = listeners.get(name) ?? new Set();
      group.add(listener);
      listeners.set(name, group);
      return () => group.delete(listener);
    },
    emit(name: string, data: unknown) {
      for (const listener of listeners.get(name) ?? []) listener(data);
    },
  };
  const appendEntry = vi.fn((customType: string, data: unknown) => {
    activeBranch.push({ type: "custom", customType, data });
  });
  const pi: any = {
    events,
    appendEntry,
    registerCommand: (name: string, command: any) => commands.set(name, command),
    on: (name: string, handler: (...args: any[]) => any) => handlers.set(name, handler),
  };
  dfastExtension(pi);
  return {
    appendEntry,
    commands,
    events,
    handlers,
    setActiveBranch(entries: any[]) { activeBranch = entries; },
  };
}

function context(branch: any[]) {
  return {
    hasUI: true,
    model: { provider: "openai-codex", id: "gpt-5.6-luna" },
    sessionManager: { getBranch: () => branch },
    ui: {
      setStatus: vi.fn(),
      notify: vi.fn(),
      theme: { fg: (_color: string, text: string) => text },
    },
  };
}

describe("pi-dfast extension integration", () => {
  it("isolates Fast Mode per session and restores only that session state", async () => {
    const sessionA: any[] = [];
    const sessionB: any[] = [];
    const ctxA = context(sessionA);
    const ctxB = context(sessionB);
    const { appendEntry, commands, handlers, setActiveBranch } = harness();

    setActiveBranch(sessionA);
    handlers.get("session_start")?.({}, ctxA);
    expect(handlers.get("before_provider_request")?.({ payload: { model: "gpt-5.6-luna" } }, ctxA)).toBeUndefined();

    await commands.get("fast")?.handler("on", ctxA);
    expect(appendEntry).toHaveBeenLastCalledWith(SESSION_ENTRY_TYPE, { version: 1, enabled: true });
    expect(handlers.get("before_provider_request")?.({ payload: { model: "gpt-5.6-luna" } }, ctxA)).toMatchObject({ service_tier: "priority" });

    handlers.get("session_before_switch")?.({}, ctxA);
    setActiveBranch(sessionB);
    handlers.get("session_start")?.({}, ctxB);
    expect(handlers.get("before_provider_request")?.({ payload: { model: "gpt-5.6-luna" } }, ctxB)).toBeUndefined();
    expect(ctxB.ui.setStatus).toHaveBeenLastCalledWith("dfast", undefined);

    setActiveBranch(sessionA);
    handlers.get("session_start")?.({}, ctxA);
    expect(handlers.get("before_provider_request")?.({ payload: { model: "gpt-5.6-luna" } }, ctxA)).toMatchObject({ service_tier: "priority" });
  });

  it("publishes state while hiding duplicate fallback status for structured consumers", async () => {
    const branch: any[] = [];
    const ctx = context(branch);
    const { commands, events, handlers, setActiveBranch } = harness();
    const snapshots: unknown[] = [];
    events.on("pi-dfast/updated", (snapshot) => snapshots.push(snapshot));

    setActiveBranch(branch);
    handlers.get("session_start")?.({}, ctx);
    events.emit("pi-dfast/subscribe", { version: 1, consumerId: "pi-dstatus" });
    await commands.get("fast")?.handler("on", ctx);

    expect(ctx.ui.setStatus).toHaveBeenLastCalledWith("dfast", undefined);
    expect(snapshots.at(-1)).toMatchObject({ enabled: true, active: true, model: "gpt-5.6-luna" });
    events.emit("pi-dfast/unsubscribe", { version: 1, consumerId: "pi-dstatus" });
    expect(ctx.ui.setStatus).toHaveBeenLastCalledWith("dfast", "FAST");
  });
});
