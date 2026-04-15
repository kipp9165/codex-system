// Minimal DOM mock for Node-based smoke tests
export function createMockDocument() {
  function createElement(tagName) {
    const children = [];
    const el = {
      tagName,
      className: '',
      textContent: '',
      childElementCount: 0,
      parent: null,
      children,
      appendChild(child) {
        if (child && typeof child === 'object') {
          children.push(child);
          child.parent = el;
          el.childElementCount = children.length;
        }
        return child;
      },
      removeChild(child) {
        const idx = children.indexOf(child);
        if (idx >= 0) {
          children.splice(idx, 1);
          child.parent = null;
          el.childElementCount = children.length;
        }
        return child;
      },
      contains(node) {
        if (!node) return false;
        if (children.indexOf(node) >= 0) return true;
        // shallow search
        for (const c of children) if (c === node) return true;
        return false;
      },
      setAttribute(name, value) { el[name] = String(value); },
    };
    return el;
  }

  const document = { createElement };
  return document;
}
