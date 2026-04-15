// Deterministic Event Engine — FIFO queue, synchronous handlers
export default class EventEngine {
  constructor() {
    this.handlers = new Map();
    this.queue = [];
    this.processing = false;
  }

  on(event, handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event).push(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const arr = this.handlers.get(event) || [];
    const idx = arr.indexOf(handler);
    if (idx >= 0) arr.splice(idx, 1);
    if (arr.length === 0) this.handlers.delete(event);
  }

  emit(event, payload = null) {
    // Enqueue event for synchronous deterministic processing
    this.queue.push({ event, payload });
    this.processQueue();
  }

  processQueue() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      const handlers = this.handlers.get(item.event) || [];
      // Process handlers in registration order
      for (const h of handlers.slice()) {
        try {
          h(item.payload);
        } catch (err) {
          // Keep deterministic behavior: emit error event
          const errHandlers = this.handlers.get('error') || [];
          for (const eh of errHandlers) eh({ error: err, source: item });
        }
      }
    }
    this.processing = false;
  }

  once(event, handler) {
    const wrapper = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  clear() {
    this.handlers.clear();
    this.queue.length = 0;
    this.processing = false;
  }
}
