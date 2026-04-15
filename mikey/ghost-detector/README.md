# Mikey Ghost Detector — Subsystem

Drop-in, deterministic, all-in-one Ghost Detector subsystem.

Usage (browser-friendly ESM):

- Import and call `activate()` from `hooks.js` with a mount `HTMLElement`.
- Call `deactivate()` to stop and clean up.

Example (in browser console):

```js
import { activate, deactivate } from './mikey/ghost-detector/hooks.js';
// mount into an existing element (note: `activate` is async and loads dialogue in browser)
const instance = await activate({ container: document.getElementById('mikey-mount') });
// later
deactivate();
```

Quick demo (open `mikey/ghost-detector/demo/index.html` in a browser that supports ESM):

- `demo/index.html` loads `demo/demo.js`, mounts the subsystem into the page, triggers a deterministic scan and reset sequence, then logs results to the console.

Files:

- `index.js` — public entry
- `event-engine.js` — deterministic event engine
- `autonomy-engine.js` — deterministic autonomy/state engine
- `ui/ui.js` + `ui/skin.css` — UI layer, strict separation
- `dialogue/pack.json` — dialogue strings (round-robin deterministic)
- `hooks.js` — activation/deactivation
- `utils.js` — deterministic helpers
- `stability-patches.js` — runtime validation and patches

This subsystem is self-contained and has no external dependencies or secrets.