import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const commonDefine = {
  __VERSION__: JSON.stringify(pkg.version)
}

export default defineConfig([
  {
    entry: {
      index: 'src/entry.ts'
    },
    format: 'esm',
    dts: true,
    platform: "browser",
    sourcemap: false,
    outDir: 'dist',
    clean: true,
    outExtensions: () => ({ js: '.mjs', dts: '.d.ts' }),
  },
  {
    entry: {
      index: 'src/entry.ts'
    },
    format: ['cjs'],
    platform: 'browser',
    define: commonDefine,
    dts: false,
    sourcemap: false,
    outExtensions: () => ({ js: '.cjs' }),
  },
  {
    entry: {
      index: 'src/entry-node.ts'
    },
    format: ['cjs', 'esm'],
    platform: 'node',
    define: commonDefine,
    dts: false,
    sourcemap: false,
    outExtensions: ({format}) => ({ js: format === 'cjs' ? '.node.cjs' : '.node.mjs' }),
  }
])
