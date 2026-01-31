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
            inlineDynamicImports: true,
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
    // BUT externalize 3D libraries (client-side only, reduces bundle by ~700KB)
    noExternal: true,
    resolve: {
      externalConditions: ['workerd', 'worker'],
    },
    external: [
      // Node.js built-ins
      'module',
      'fs',
      'path',
      'crypto',
      'stream',
      'util',
      'os',
      'events',
      // 3D libraries (client-side only - reduces SSR bundle by ~700KB)
      'three',
      '@react-three/fiber',
      '@react-three/drei',
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
