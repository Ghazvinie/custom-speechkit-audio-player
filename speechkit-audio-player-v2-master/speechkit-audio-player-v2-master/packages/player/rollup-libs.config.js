import { join } from 'path'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import ignore from 'rollup-plugin-ignore'
import visualizer from 'rollup-plugin-visualizer'
import stripCode from 'rollup-plugin-strip-code'
import pkgCore from '@speechkit/speechkit-audio-player-core/package.json'
import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH
const release = !!process.env.RELEASE
const withCustomElements = false

const dirDist = (path = '') => join(__dirname, 'build', path)
const omitPackages = [
  'svelte-redux-connect', 'svelte',
]
const filteredPackages = name => !omitPackages.includes(name)
const getExternalPackages = ({ dependencies }) => (
  Object.keys(dependencies || {}).filter(filteredPackages)
)

const defaultReplace = {
  process: JSON.stringify({
    env: {
      isDev: !production,
      NODE_ENV: production ? 'production' : 'development',
      skBackend: release ? 'https://spkt.io' : 'https://staging.spkt.io',
      version: pkg.version,
      product: 'player',
      buildType: 'npm_module',
      sentryDsn: process.env.SENTRY_DSN_SDK || 'https://69e7aa5c2a10408db952951ef6c09170@o271781.ingest.sentry.io/5558656',
    },
  }),
}

const banner = `/* speechkit-audio-player-v2 version ${pkg.version} */`
const defaultOutputForModule = {
  sourcemap: false,
  banner,
  exports: 'named',
}

export default {
  input: [
    'src/index.js',
  ],
  output: [
    {
      ...defaultOutputForModule,
      format: 'cjs',
      dir: dirDist('cjs'),
    },
    {
      ...defaultOutputForModule,
      format: 'esm',
      dir: dirDist('esm'),
    },
  ],
  plugins: [
    stripCode({
      start_comment: 'IE11-ONLY:START',
      end_comment: 'IE11-ONLY:END',
    }),
    stripCode({
      start_comment: 'ONLY-MODULES:START',
      end_comment: 'ONLY-MODULES:END',
    }),
    replace(defaultReplace),
    svelte({
      dev: !production,
      css: true,
      customElement: withCustomElements,
    }),
    production && ignore(['@speechkit/speechkit-audio-player-core/shared/debug/redux']),
    resolve({
      browser: true,
      dedupe: ['svelte', '@speechkit/speechkit-audio-player-core'],
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs(),
    !production && livereload(dirDist('cjs')),
    production && terser({
      compress: {
        evaluate: true,
        unused: false,
      },
    }),
    production && visualizer({
      filename: join(__dirname, '../../reports/stats_lib.html'),
      gzipSize: true,
    }),
  ],
  external: [
    ...getExternalPackages(pkg),
    ...getExternalPackages(pkgCore),
    'hls.js/dist/hls.light',
  ],
}
