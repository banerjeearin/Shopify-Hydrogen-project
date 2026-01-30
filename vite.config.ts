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
    rollupOptions: isSsrBuild
      ? {
          output: {
            inlineDynamicImports: true,
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
    noExternal: true,
    resolve: {
      externalConditions: ['workerd', 'worker'],
    },
    // Mark Node.js built-ins as external (they'll be polyfilled by Oxygen)
    external: ['module', 'fs', 'path', 'crypto', 'stream', 'util', 'os', 'events'],
  },
  resolve: {
    conditions: ['workerd', 'worker', 'browser'],
    alias: {
      // Provide empty polyfills for Node.js built-ins
      module: 'data:text/javascript,export default {};export const createRequire = () => () => ({});',
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
