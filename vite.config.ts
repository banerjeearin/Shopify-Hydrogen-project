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
            // Bundle all server code into single file to avoid missing assets
            inlineDynamicImports: true,
          },
        }
      : {},
  },
  optimizeDeps: {
    // Exclude server modules from client pre-bundling
    exclude: ['~/lib/shopify-fetcher.server', '~/lib/shopify-cart.server', '~/lib/shopify.server'],
  },
  ssr: {
    optimizeDeps: {
      include: ['set-cookie-parser', 'cookie', 'react-router', 'react-dom/server'],
    },
    noExternal: ['react-dom/server'],
    resolve: {
      externalConditions: ['workerd', 'worker'],
    },
  },
  resolve: {
    conditions: ['workerd', 'worker', 'browser'],
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
