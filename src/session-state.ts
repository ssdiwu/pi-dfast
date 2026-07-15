export const SESSION_ENTRY_TYPE = "pi-dfast-state";

export interface DFastSessionState {
  version: 1;
  enabled: boolean;
}

function parseSessionState(value: unknown): DFastSessionState | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const state = value as Partial<DFastSessionState>;
  if (state.version !== 1 || typeof state.enabled !== "boolean") return undefined;
  return { version: 1, enabled: state.enabled };
}

export function restoreSessionEnabled(entries: readonly unknown[]): boolean {
  let enabled = false;
  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) continue;
    const candidate = entry as { type?: unknown; customType?: unknown; data?: unknown };
    if (candidate.type !== "custom" || candidate.customType !== SESSION_ENTRY_TYPE) continue;
    const state = parseSessionState(candidate.data);
    if (state) enabled = state.enabled;
  }
  return enabled;
}

export { parseSessionState };
