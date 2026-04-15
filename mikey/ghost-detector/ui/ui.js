// Minimal deterministic UI layer. Strict separation: UI only listens and emits events.
// Note: CSS is intentionally not imported here to keep browser-native ESM demo simple.
export function mountUI({ container, eventEngine, autonomy }) {
  // Defensive: accept any object that implements `appendChild` and `contains`.
  if (!container || typeof container.appendChild !== 'function') {
    throw new Error('mountUI requires a container HTMLElement-like object');
  }
  if (!eventEngine || typeof eventEngine.on !== 'function' || typeof eventEngine.emit !== 'function') {
    throw new Error('mountUI requires an eventEngine with `on` and `emit` methods');
  }
  // Root
  const root = document.createElement('div');
  root.className = 'mikey-gh-root';

  // Header
  const header = document.createElement('div');
  header.className = 'mikey-gh-header';
  header.textContent = 'Mikey Ghost Detector';
  root.appendChild(header);

  // Status
  const status = document.createElement('div');
  status.className = 'mikey-gh-status';
  status.textContent = 'Status: idle';
  root.appendChild(status);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'mikey-gh-controls';
  const scanBtn = document.createElement('button');
  scanBtn.textContent = 'Scan';
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  controls.appendChild(scanBtn);
  controls.appendChild(resetBtn);
  root.appendChild(controls);

  // Dialogue output
  const dialogue = document.createElement('div');
  dialogue.className = 'mikey-gh-dialogue';
  root.appendChild(dialogue);

  container.appendChild(root);

  // Event bindings
  const onScan = () => eventEngine.emit('ui:interact', { cmd: 'scan' });
  const onReset = () => eventEngine.emit('ui:interact', { cmd: 'reset' });
  scanBtn.addEventListener('click', onScan);
  resetBtn.addEventListener('click', onReset);

  // Subscriptions
  const unsubs = [];
  unsubs.push(eventEngine.on('autonomy:mode', ({ to }) => {
    status.textContent = `Status: ${to}`;
    root.setAttribute('data-mode', to);
  }));

  unsubs.push(eventEngine.on('dialogue:say', ({ text }) => {
    if (!text) return;
    const p = document.createElement('div');
    p.className = 'mikey-gh-line';
    p.textContent = text;
    // Deterministic insertion: append then trim to 6 lines
    dialogue.appendChild(p);
    while (dialogue.childElementCount > 6) dialogue.removeChild(dialogue.firstChild);
  }));

  unsubs.push(eventEngine.on('autonomy:reset', () => {
    dialogue.textContent = '';
  }));

  const context = { root, container, unsubs, cleanup: () => {
    // remove DOM listeners
    try { scanBtn.removeEventListener('click', onScan); } catch (e) { /* noop */ }
    try { resetBtn.removeEventListener('click', onReset); } catch (e) { /* noop */ }
  } };
  return context;
}

export function unmountUI(context) {
  if (!context) return;
  const { root, container, unsubs, cleanup } = context;
  try { if (typeof cleanup === 'function') cleanup(); } catch (e) { /* noop */ }
  for (const u of (unsubs || [])) {
    try { if (typeof u === 'function') u(); } catch (e) { /* swallow */ }
  }
  if (root && container && container.contains(root)) container.removeChild(root);
}
