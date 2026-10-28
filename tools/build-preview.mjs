import { build } from 'esbuild';
await build({
  entryPoints: ['preview-source/lua.ts'],
  outfile: 'assets/lua-runtime.js',
  bundle: true,
  platform: 'browser',
  format: 'esm',
  minify: true,
  define: { 'process.env.FENGARICONF': 'undefined', process: 'undefined' },
  legalComments: 'inline',
});
