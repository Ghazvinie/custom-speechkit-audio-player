import { join } from 'path'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import analyze from 'rollup-plugin-analyzer'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import dev from 'rollup-plugin-dev'
import visualizer from 'rollup-plugin-visualizer'
import ignore from 'rollup-plugin-ignore'
import strip from '@rollup/plugin-strip'
import stripCode from 'rollup-plugin-strip-code'
import babel from '@rollup/plugin-babel'
import cors from '@koa/cors'
import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH
const release = !!process.env.RELEASE
const sourcemap = !production ? true : process.env.SOURCEMAP || 'hidden'
const withCustomElements = false

const oldDirDist = (path = '') => join(__dirname, '../../demo/build', path)
const dirDist = (path = '') => join(__dirname, 'build', path)
// const skBackendOnDev = production ? 'https://staging.spkt.io' : 'http://spkt.local:3000'
const skBackendOnDev = 'https://staging.spkt.io'

const handlerEventsDevelopment = ctx => {
  ctx.body = 'ok'
}

const makeDefaultReplace = (envParams = {}) => ({
  process: JSON.stringify({
    env: {
      isDev: !production,
      NODE_ENV: production ? 'production' : 'development',
      skBackend: release ? 'https://spkt.io' : skBackendOnDev,
      projectId: release ? '2090' : '2090',
      articleUrl: production
        ? 'https://saparjohnick.000webhostapp.com/2019/08/test-ad, https://saparjohnick.000webhostapp.com/2019/08/test-ads'
        : 'https://www.bbc.co.uk/news/world-europe-49922779',
      spktCDN: process.env.spktCDN || 'https://proxy.speechkit.io/npm/@speechkit/speechkit-audio-player-v2@latest/dist/module/index.js',
      version: pkg.version,
      product: 'player',
      sentryDsn: process.env.SENTRY_DSN || 'https://dd66cf0c863044aab89c1bf54b38c690@o271781.ingest.sentry.io/1501570',
      ...envParams,
    },
  }),
})

const banner = `/* speechkit-audio-player-v2 version ${pkg.version} */`
const defaultOutputForModule = {
  sourcemap,
  format: 'esm',
  dir: dirDist('module'),
  banner,
}

const outputForModule = production
  ? [defaultOutputForModule, {
    ...defaultOutputForModule,
    dir: oldDirDist('module'),
  }]
  : [{
    sourcemap: true,
    format: 'esm',
    dir: oldDirDist('module'),
    chunkFileNames: '[name].js',
    entryFileNames: '[name].js',
  }]

export default [{
  input: [
    'src/index.js',
    'src/sdk.js',
  ],
  output: outputForModule,
  plugins: [
    stripCode({
      start_comment: 'IE11-ONLY:START',
      end_comment: 'IE11-ONLY:END',
    }),
    replace(makeDefaultReplace({ buildType: 'module' })),
    svelte({
      dev: !production,
      css: true,
      customElement: withCustomElements,
    }),
    production && ignore(['@speechkit/speechkit-audio-player-core/shared/debug/redux']),
    resolve({
      browser: true,
      dedupe: ['svelte'],
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs(),
    analyze({
      summaryOnly: true,
    }),
    !production && dev({
      dirs: [join(__dirname, '../../demo')],
      port: 5000,
      extend(app, { router }) {
        app.use(cors())
        app.use(router.post('/events-development', handlerEventsDevelopment))
        app.use(router.get('/events-development', handlerEventsDevelopment))
      },
      force: production,
    }),
    !production && livereload(oldDirDist()),
    production && strip({
      functions: ['console.*'],
    }),
    production && terser(),
    production && visualizer({
      filename: join(__dirname, '../../reports/stats.html'),
      gzipSize: true,
    }),
  ],
  watch: {
    clearScreen: false,
  },
}, {
  // iframe helper build:
  input: 'src/iframe-helper/index.js',
  output: [{
    file: dirDist('module/speechkit-iframe-helper.js'),
    format: 'umd',
  }, {
    file: oldDirDist('module/speechkit-iframe-helper.js'),
    format: 'umd',
  }],
  plugins: [
    replace({
      ...makeDefaultReplace({ buildType: 'module' }),
      exclude: /node_modules\/(@babel|core-js)/,
      include: [/packages\/(core|player)/, /node_modules\/(redux|redux-thunk)/],
    }),
    resolve({
      browser: true,
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs(),
    babel({
      babelrc: false,
      extensions: ['.js'],
      exclude: ['node_modules/@babel/**'],
      babelHelpers: 'runtime',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: '> 1%, IE 11, not op_mini all, not dead',
            },
            modules: false,
            useBuiltIns: 'entry',
            corejs: 3,
          },
        ],
      ],
      plugins: [
        ['@babel/plugin-transform-runtime', { regenerator: true }],
      ],
    }),
    production && terser(),
  ],
}, {
  // ghost module build:
  input: 'src/ghost-helper/index.js',
  output: [{
    file: dirDist('module/speechkit-ghost-helper.js'),
    format: 'umd',
  }, {
    file: oldDirDist('module/speechkit-ghost-helper.js'),
    format: 'umd',
  }],
  plugins: [
    replace(makeDefaultReplace()),
    production && terser(),
  ],
}]
