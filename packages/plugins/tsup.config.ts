import type { Options } from 'tsup'

export default <Options>{
  entry: [
    'src/*.ts',
    'src/vite/index.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
  cjsInterop: true,
  splitting: true,
}
