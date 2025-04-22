import { defineConfig } from 'tsup'

export default defineConfig([
  // browser
  {
    entry: ['src/index.ts'], 
    outDir: 'dist',
    format: ['esm'],
    dts: false,
    external: ['node:*'],
    env: { NODE_ENV: 'browser', VITEST: 'false' },
    platform: 'browser',
    outExtension(ctx) {
      return {
        js: '.browser' + (ctx.format === 'esm' ? '.mjs' : '.js'),
      }
    },
  },
  // Node.js
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    external: [],
    env: { NODE_ENV: 'node', VITEST: 'false' },
    platform: 'node',
    clean: true,
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs'
    }),
  }
])
