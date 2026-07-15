export const FAST_SERVICE_TIER = "priority" as const;
export const TARGET_PROVIDER = "openai-codex" as const;

export const SUPPORTED_MODEL_IDS: ReadonlySet<string> = new Set([
  "gpt-5.4",
  "gpt-5.5",
  "gpt-5.6-luna",
  "gpt-5.6-sol",
  "gpt-5.6-terra",
]);

export interface ModelRef {
  provider?: string;
  id?: string;
}

export type DFastReason = "disabled" | "no-model" | "unsupported-provider" | "unsupported-model" | "supported";

export interface DFastSnapshot {
  version: 1;
  enabled: boolean;
  active: boolean;
  provider?: string;
  model?: string;
  requestedServiceTier: typeof FAST_SERVICE_TIER;
  reason: DFastReason;
  updatedAt: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function fastModeReason(enabled: boolean, model: ModelRef | undefined): DFastReason {
  if (!enabled) return "disabled";
  if (!model?.provider || !model.id) return "no-model";
  if (model.provider !== TARGET_PROVIDER) return "unsupported-provider";
  if (!SUPPORTED_MODEL_IDS.has(model.id)) return "unsupported-model";
  return "supported";
}

export function createSnapshot(enabled: boolean, model: ModelRef | undefined, updatedAt = Date.now()): DFastSnapshot {
  const reason = fastModeReason(enabled, model);
  return {
    version: 1,
    enabled,
    active: reason === "supported",
    ...(model?.provider ? { provider: model.provider } : {}),
    ...(model?.id ? { model: model.id } : {}),
    requestedServiceTier: FAST_SERVICE_TIER,
    reason,
    updatedAt,
  };
}

export function shouldApplyFastMode(enabled: boolean, model: ModelRef | undefined, payload: unknown): boolean {
  if (fastModeReason(enabled, model) !== "supported" || !isRecord(payload)) return false;
  return payload.model === model?.id;
}

export function applyFastServiceTier(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return { ...payload, service_tier: FAST_SERVICE_TIER };
}
