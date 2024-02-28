import { crx } from '@crxjs/vite-plugin';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react';
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { join } from 'path';
// import builtins from 'rollup-plugin-node-builtins';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { defineConfig } from 'vite';

import manifest from './src/manifest';
import removeSrcFromHtmlPaths from './utils/plugins/removeSrcFromHtmlPaths';

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        welcome: join(__dirname, 'src/welcome/welcome.html'),
      },
      output: {
        chunkFileNames: 'assets/chunk-[hash].js',
      },
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        // builtins(),
        rollupNodePolyFill(),
      ],
    },
  },
  // resolve: {
  //   alias: {
  //     // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
  //     // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
  //     util: 'rollup-plugin-node-polyfills/polyfills/util',
  //     sys: 'util',
  //     events: 'rollup-plugin-node-polyfills/polyfills/events',
  //     stream: 'rollup-plugin-node-polyfills/polyfills/stream',
  //     path: 'rollup-plugin-node-polyfills/polyfills/path',
  //     querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
  //     punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
  //     url: 'rollup-plugin-node-polyfills/polyfills/url',
  //     http: 'rollup-plugin-node-polyfills/polyfills/http',
  //     https: 'rollup-plugin-node-polyfills/polyfills/http',
  //     os: 'rollup-plugin-node-polyfills/polyfills/os',
  //     assert: 'rollup-plugin-node-polyfills/polyfills/assert',
  //     constants: 'rollup-plugin-node-polyfills/polyfills/constants',
  //     _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
  //     _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
  //     _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
  //     _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
  //     _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
  //     timers: 'rollup-plugin-node-polyfills/polyfills/timers',
  //     console: 'rollup-plugin-node-polyfills/polyfills/console',
  //     vm: 'rollup-plugin-node-polyfills/polyfills/vm',
  //     zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
  //     tty: 'rollup-plugin-node-polyfills/polyfills/tty',
  //     domain: 'rollup-plugin-node-polyfills/polyfills/domain',
  //     buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
  //     process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
  //   },
  // },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { bigint: true },
      plugins: [nodeModulesPolyfillPlugin() as any],
    },
  },
  // resolve: {
  //   alias: {
  //     crypto: 'empty-module',
  //     assert: 'empty-module',
  //     http: 'empty-module',
  //     https: 'empty-module',
  //     os: 'empty-module',
  //     url: 'empty-module',
  //     zlib: 'empty-module',
  //     stream: 'empty-module',
  //     _stream_duplex: 'empty-module',
  //     _stream_passthrough: 'empty-module',
  //     _stream_readable: 'empty-module',
  //     _stream_writable: 'empty-module',
  //     _stream_transform: 'empty-module',
  //     process: 'process',
  //     buffer: 'buffer',
  //   },
  // },
  define: {
    global: 'globalThis',
  },
  plugins: [react(), crx({ manifest }), removeSrcFromHtmlPaths()],
});
