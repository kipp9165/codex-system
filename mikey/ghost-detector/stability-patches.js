// Stability patches: runtime sanity checks and deterministic fallbacks
export function applyStabilityPatches() {
  // Intentionally small and safe: ensures Date.now is available
  if (typeof Date.now !== 'function') {
    // deterministic fallback
    Date.now = function () { return new Date().getTime(); };
  }
  // Ensure requestAnimationFrame exists in UI contexts (no-op deterministic fallback)
  if (typeof globalThis.requestAnimationFrame !== 'function') {
    globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 16);
  }
}
