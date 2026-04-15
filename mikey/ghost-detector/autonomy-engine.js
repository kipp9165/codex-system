import { roundRobin } from './utils.js';

// Small deterministic autonomy/state engine
export default class AutonomyEngine {
  constructor({ eventEngine, dialogue }) {
    if (!eventEngine) throw new Error('AutonomyEngine requires eventEngine');
    this.eventEngine = eventEngine;
    this.dialogue = dialogue || { prompts: [] };
    this.state = {
      mode: 'idle',
      lastSeen: null,
      suspicion: 0
    };
    this._tickQueue = [];
    this._dialogIdx = 0;
    this._running = false;
    this._unsubs = [];
  }

  initialize() {
    if (this._running) return;
    // deterministic subscriptions
    // store unsubs so we can clean up on shutdown
    this._unsubs.push(this.eventEngine.on('sensor:ping', (payload) => this.handlePing(payload)));
    this._unsubs.push(this.eventEngine.on('ui:interact', (payload) => this.handleUser(payload)));
    this._running = true;
  }

  shutdown() {
    if (!this._running) return;
    // remove subscriptions to avoid leaks
    for (const u of this._unsubs) {
      try { if (typeof u === 'function') u(); } catch (e) { /* swallow */ }
    }
    this._unsubs.length = 0;
    this._running = false;
  }

  handlePing(payload) {
    // payload expected: { intensity: number }
    const intensity = Number(payload && payload.intensity) || 0;
    // deterministic update: suspicion grows linearly with intensity
    this.state.lastSeen = Date.now();
    this.state.suspicion = Math.min(100, this.state.suspicion + Math.floor(intensity));
    this.evaluateState();
  }

  handleUser(payload) {
    // user can request scan or reset
    const cmd = (payload && payload.cmd) || 'noop';
    if (cmd === 'scan') this.triggerScan();
    if (cmd === 'reset') this.reset();
  }

  evaluateState() {
    if (this.state.suspicion >= 75) {
      this.transition('alert');
    } else if (this.state.suspicion >= 30) {
      this.transition('investigating');
    } else {
      this.transition('idle');
    }
  }

  transition(next) {
    if (this.state.mode === next) return;
    const prev = this.state.mode;
    this.state.mode = next;
    this.eventEngine.emit('autonomy:mode', { from: prev, to: next, state: { ...this.state } });
    // deterministic dialogue output on certain transitions
    if (next === 'alert') {
      const text = roundRobin(this.dialogue.prompts || [], '_alert', this);
      this.eventEngine.emit('dialogue:say', { text, level: 'alert' });
    }
  }

  triggerScan() {
    // deterministic scan: produce a ping with intensity based on suspicion
    const intensity = Math.max(1, Math.floor(this.state.suspicion / 10));
    this.eventEngine.emit('sensor:ping', { intensity });
  }

  reset() {
    this.state.suspicion = 0;
    this.state.mode = 'idle';
    this.eventEngine.emit('autonomy:reset', { state: { ...this.state } });
  }

  // Manual tick support for deterministic control in tests
  tick() {
    // process any scheduled tasks — kept intentionally simple
    while (this._tickQueue.length) {
      const fn = this._tickQueue.shift();
      fn();
    }
  }

  schedule(fn) {
    this._tickQueue.push(fn);
  }
}
