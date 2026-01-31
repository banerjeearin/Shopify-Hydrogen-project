import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Process polyfill to inject at the start of the bundle
const processPolyfill = `
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: {},
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: (fn) => setTimeout(fn, 0),
  };
}
`;

export default defineConfig(({isSsrBuild}) => ({
  plugins: [
    hydrogen({
      disableVirtualRoutes: false,
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild
      ? {
          output: {
            // Don't inline dynamic imports - allows client-only chunks to remain separate
            // inlineDynamicImports: true,  // Removed to prevent client-only code from being bundled into SSR
            // Inject process polyfill at the start of the bundle
            intro: processPolyfill,
          },
        }
      : {},
  },
  ssr: {
    optimizeDeps: {
      include: [
        'set-cookie-parser',
        'cookie',
        'react-router',
        'react-dom/server',
        'react',
        'react-dom',
      ],
    },
    // Bundle ALL dependencies into the worker - required for Oxygen/Cloudflare Workers
    // Note: Three.js is bundled (not externalized) to prevent "No such module" errors
    // The bundle will be larger (~2MB) but will work correctly
    noExternal: true,
    resolve: {
      externalConditions: ['workerd', 'worker'],
    },
    external: [
      // Node.js built-ins only
      'module',
      'fs',
      'path',
      'crypto',
      'stream',
      'util',
      'os',
      'events',
    ],
  },
  resolve: {
    conditions: ['workerd', 'worker', 'browser'],
    alias: {
      module: 'data:text/javascript,export default {};export const createRequire = () => () => ({});',
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
