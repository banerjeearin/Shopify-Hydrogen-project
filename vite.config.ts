import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    // Don't customize SSR rollupOptions - let Hydrogen's React Router preset handle it
    // Oxygen/worker packaging expects a specific structure from the preset
    // rollupOptions removed to avoid interfering with Hydrogen's bundle shape
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
