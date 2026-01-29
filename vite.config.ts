import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({command, mode, isSsrBuild}) => ({
  plugins: [
    hydrogen({
      disableVirtualRoutes: false, // Keep virtual routes but our routes should take precedence
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild ? {
      output: {
        // For SSR builds, inline all dynamic imports to avoid missing assets
        // This prevents the "Cannot find module 'assets/xxx.js'" error
        inlineDynamicImports: true,
      },
    } : {},
  },
  optimizeDeps: {
    exclude: [
      // Exclude modules that import .server files from pre-bundling
      '~/lib/shopify-fetcher.server',
    ],
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router', 'react-dom/server'],
    },
    noExternal: ['react-dom/server'],
    // Mark .server files as SSR-only to prevent client bundling
    resolve: {
      externalConditions: ['workerd', 'worker'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
