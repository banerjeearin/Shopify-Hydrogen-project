// Polyfill for process in edge runtime (Oxygen/Cloudflare Workers)
// This must be imported before any code that uses process

if (typeof globalThis.process === 'undefined') {
  (globalThis as any).process = {
    env: {},
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: (fn: Function) => setTimeout(fn, 0),
  };
}

export {};
