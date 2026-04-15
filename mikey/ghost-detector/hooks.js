import createSubsystem from './index.js';

let _instance = null;

// Activate returns the created instance. It attempts to load the dialogue pack
// relative to this module when running in a browser ESM environment.
export async function activate(options = {}) {
  if (_instance && _instance.isActive && _instance.isActive()) return _instance;

  // Try to fetch dialogue JSON relative to this module (works in browsers).
  let dialogue = null;
  try {
    const url = new URL('./dialogue/pack.json', import.meta.url).href;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) dialogue = await res.json();
  } catch (e) {
    // fallback to null; createSubsystem will use deterministic fallback
    dialogue = null;
  }

  _instance = createSubsystem({ dialogue });
  _instance.activate({ container: options.container });
  return _instance;
}

export function deactivate() {
  if (!_instance) return;
  _instance.deactivate();
  _instance = null;
}

export function getInstance() {
  return _instance;
}

export default { activate, deactivate, getInstance };
