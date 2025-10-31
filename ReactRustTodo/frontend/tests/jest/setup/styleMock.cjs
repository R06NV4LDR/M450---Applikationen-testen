// Minimal style mock in CommonJS
module.exports = new Proxy({}, {
  get: (_target, prop) => (typeof prop === 'string' ? prop : ''),
});

