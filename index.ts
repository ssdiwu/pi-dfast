import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { applyFastServiceTier, createSnapshot, shouldApplyFastMode, type DFastSnapshot } from "./src/fast-mode.js";
import { restoreSessionEnabled, SESSION_ENTRY_TYPE, type DFastSessionState } from "./src/session-state.js";

interface Subscription {
  version: 1;
  consumerId: string;
}

function parseSubscription(value: unknown): Subscription | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const candidate = value as Partial<Subscription>;
  if (candidate.version !== 1 || typeof candidate.consumerId !== "string" || !candidate.consumerId.trim()) return undefined;
  return { version: 1, consumerId: candidate.consumerId.trim() };
}

function stateMessage(snapshot: DFastSnapshot): string {
  if (!snapshot.enabled) return "Fast Mode 已关闭；请求使用默认服务等级。";
  if (snapshot.active) return `Fast Mode 已开启并适用于 openai-codex/${snapshot.model}。`;
  const current = snapshot.provider && snapshot.model ? `${snapshot.provider}/${snapshot.model}` : "当前没有活动模型";
  return `Fast Mode 已开启，但不适用于 ${current}。`;
}

export default function dfastExtension(pi: ExtensionAPI): void {
  let enabled = false;
  let currentCtx: ExtensionContext | undefined;
  let latestSnapshot: DFastSnapshot = createSnapshot(false, undefined);
  const consumers = new Set<string>();

  const publish = (ctx: ExtensionContext | undefined = currentCtx): DFastSnapshot => {
    latestSnapshot = createSnapshot(enabled, ctx?.model);
    try {
      pi.events.emit("pi-dfast/updated", latestSnapshot);
    } catch {
      // Consumers are optional and must not break request control.
    }
    return latestSnapshot;
  };

  const updateStatus = (ctx: ExtensionContext): DFastSnapshot => {
    const snapshot = publish(ctx);
    if (!ctx.hasUI) return snapshot;
    try {
      const text = consumers.size > 0 || !snapshot.enabled ? undefined : snapshot.active ? "FAST" : "FAST · inactive";
      ctx.ui.setStatus("dfast", text ? ctx.ui.theme.fg("accent", text) : undefined);
    } catch {
      // Status display is optional and must not break request control.
    }
    return snapshot;
  };

  const notify = (ctx: ExtensionContext, snapshot: DFastSnapshot, level: "info" | "warning" = "info") => {
    const message = stateMessage(snapshot);
    if (ctx.hasUI) ctx.ui.notify(message, level);
    else console.log(message);
  };

  const setEnabled = (next: boolean, ctx: ExtensionContext): DFastSnapshot => {
    pi.appendEntry<DFastSessionState>(SESSION_ENTRY_TYPE, { version: 1, enabled: next });
    enabled = next;
    return updateStatus(ctx);
  };

  const restoreSessionState = (ctx: ExtensionContext): DFastSnapshot => {
    currentCtx = ctx;
    enabled = restoreSessionEnabled(ctx.sessionManager.getBranch());
    return updateStatus(ctx);
  };

  pi.events.on("pi-dfast/subscribe", (data) => {
    const subscription = parseSubscription(data);
    if (!subscription) return;
    consumers.add(subscription.consumerId);
    if (currentCtx) updateStatus(currentCtx);
  });

  pi.events.on("pi-dfast/unsubscribe", (data) => {
    const subscription = parseSubscription(data);
    if (!subscription) return;
    consumers.delete(subscription.consumerId);
    if (currentCtx) updateStatus(currentCtx);
  });

  pi.registerCommand("fast", {
    description: "Control Codex Fast Mode: /fast [on|off|status]",
    handler: async (args, ctx) => {
      const action = args.trim().toLowerCase() || "toggle";
      if (action === "status") {
        notify(ctx, updateStatus(ctx));
        return;
      }
      if (!["toggle", "on", "off"].includes(action)) {
        if (ctx.hasUI) ctx.ui.notify("用法：/fast [on|off|status]", "warning");
        else console.error("用法：/fast [on|off|status]");
        return;
      }
      const next = action === "toggle" ? !enabled : action === "on";
      try {
        const snapshot = setEnabled(next, ctx);
        notify(ctx, snapshot, snapshot.enabled && !snapshot.active ? "warning" : "info");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (ctx.hasUI) ctx.ui.notify(`Fast Mode 会话状态保存失败：${message}`, "error");
        else console.error(`Fast Mode 会话状态保存失败：${message}`);
      }
    },
  });

  pi.on("session_start", (_event, ctx) => {
    restoreSessionState(ctx);
  });

  pi.on("session_tree", (_event, ctx) => {
    restoreSessionState(ctx);
  });

  pi.on("session_before_switch", (_event, ctx) => {
    enabled = false;
    updateStatus(ctx);
  });

  pi.on("model_select", (_event, ctx) => {
    currentCtx = ctx;
    updateStatus(ctx);
  });

  pi.on("before_provider_request", (event, ctx) => {
    if (!shouldApplyFastMode(enabled, ctx.model, event.payload)) return undefined;
    return applyFastServiceTier(event.payload);
  });

  pi.on("session_shutdown", () => {
    enabled = false;
    currentCtx = undefined;
    consumers.clear();
  });
}

export { parseSubscription, stateMessage };
