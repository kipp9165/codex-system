import assert from 'assert';
import { createMockDocument } from './mock-dom.js';

// Provide minimal global mocks before importing hooks
const mockDoc = createMockDocument();
global.document = mockDoc;

// Mock fetch to return dialogue pack JSON regardless of URL
global.fetch = async function (url, opts) {
  return {
    ok: true,
    async json() {
      return {
        prompts: [
          'Node-test: System stable.',
          'Node-test: Observation recorded.'
        ]
      };
    }
  };
};

// Run smoke test
(async () => {
  try {
    // Import hooks after mocks are in place
    const { activate, deactivate, getInstance } = await import('../hooks.js');

    const container = document.createElement('div');

    // Activate (async) and ensure no exceptions
    const inst = await activate({ container });
    assert(inst, 'activate should return instance');
    assert(typeof inst.isActive === 'function' && inst.isActive(), 'instance should be active');

    // Exercise an interaction and allow engines to process
    if (inst && inst.eventEngine) {
      inst.eventEngine.emit('ui:interact', { cmd: 'scan' });
    }

    // small wait to let synchronous processing happen
    await new Promise((r) => setTimeout(r, 50));

    // Deactivate and confirm cleanup
    deactivate();
    await new Promise((r) => setTimeout(r, 20));

    assert(getInstance() === null, 'getInstance should be null after deactivate');
    assert(!inst.isActive(), 'instance should be inactive after deactivate');

    console.log('Mikey Ghost Detector smoke test passed.');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(2);
  }
})();
