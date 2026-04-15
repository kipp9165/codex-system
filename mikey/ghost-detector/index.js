import EventEngine from './event-engine.js';
import AutonomyEngine from './autonomy-engine.js';
import { mountUI, unmountUI } from './ui/ui.js';
import { applyStabilityPatches } from './stability-patches.js';

export function createSubsystem(config = {}) {
  const eventEngine = new EventEngine();
  // Accept externally provided dialogue via config.dialogue (synchronous).
  const dialogueProvided = config.dialogue;
  const dialogueSafe = (dialogueProvided && Array.isArray(dialogueProvided.prompts))
    ? dialogueProvided
    : { prompts: ['System ready.'] };
  const autonomy = new AutonomyEngine({ eventEngine, dialogue: dialogueSafe });
  let uiContext = null;
  let active = false;

  function activate(options = {}) {
    if (active) return api;
    applyStabilityPatches();
    autonomy.initialize();
    // UI mount is optional — only mount if a container is provided.
    const container = options.container;
    if (container) {
      try {
        uiContext = mountUI({ container, eventEngine, autonomy });
      } catch (err) {
        // Do not fail activation due to UI mount issues — report deterministically
        eventEngine.emit('error', { error: err, source: 'ui:mount' });
        uiContext = null;
      }
    }
    active = true;
    return api;
  }

  function deactivate() {
    if (!active) return api;
    autonomy.shutdown();
    if (uiContext) {
      try { unmountUI(uiContext); } catch (e) { /* swallow */ }
      uiContext = null;
    }
    try { eventEngine.clear(); } catch (e) { /* swallow */ }
    active = false;
    return api;
  }

  const api = Object.freeze({
    eventEngine,
    autonomy,
    activate,
    deactivate,
    isActive: () => active,
    version: '1.0.0-mikey'
  });

  return api;
}

export default createSubsystem;