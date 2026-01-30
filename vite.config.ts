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
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
    // Bundle React and related packages into the worker
    noExternal: [
      'react',
      'react-dom',
      'react-dom/server',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@shopify/hydrogen',
      '@shopify/hydrogen-react',
    ],
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
