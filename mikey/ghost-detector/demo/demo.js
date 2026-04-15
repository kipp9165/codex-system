import { activate, deactivate, getInstance } from '../hooks.js';

(async function runDemo() {
  const container = document.getElementById('mikey-mount');
  const inst = await activate({ container });
  console.log('Mikey detector activated:', inst.version);

  // Wait a moment to allow UI to render
  await new Promise((r) => setTimeout(r, 200));

  // Trigger a deterministic sequence: scan, wait, reset
  console.log('Triggering scan...');
  const api = getInstance();
  if (api && api.eventEngine) {
    api.eventEngine.emit('ui:interact', { cmd: 'scan' });
  }

  await new Promise((r) => setTimeout(r, 400));

  console.log('Triggering reset...');
  if (api && api.eventEngine) {
    api.eventEngine.emit('ui:interact', { cmd: 'reset' });
  }

  await new Promise((r) => setTimeout(r, 300));

  console.log('Deactivating...');
  deactivate();
  console.log('Demo finished.');
})();
