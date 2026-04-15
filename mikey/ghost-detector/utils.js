// Deterministic utilities

export function roundRobin(array, key = '_default', ctx = null) {
  if (!Array.isArray(array) || array.length === 0) return '';
  // Attach index map to context to keep deterministic state if provided
  if (ctx) {
    if (!ctx._rr) ctx._rr = Object.create(null);
    if (!Object.prototype.hasOwnProperty.call(ctx._rr, key)) ctx._rr[key] = 0;
    const i = ctx._rr[key] % array.length;
    ctx._rr[key] += 1;
    return array[i];
  }
  // Stateless deterministic: return first element
  return array[0];
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
