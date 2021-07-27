import { join } from 'path'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import ignore from 'rollup-plugin-ignore'
import dev from 'rollup-plugin-dev'
import livereload from 'rollup-plugin-livereload'
import babel from '@rollup/plugin-babel'

import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH
const release = !!process.env.RELEASE
const sourcemap = !production ? true : process.env.SOURCEMAP || 'hidden'
const withCustomElements = false

const oldDirDist = (path = '') => join(__dirname, '../../demo/build', path)
const dirDist = (path = '') => join(__dirname, 'build', path)
const handlerEventsDevelopment = ctx => {
  ctx.body = 'ok'
}

const defaultReplace = {
  process: JSON.stringify({
    env: {
      isDev: !production,
      NODE_ENV: production ? 'production' : 'development',
      skBackend: release ? 'https://spkt.io' : 'https://staging.spkt.io',
      version: pkg.version,
      product: 'player',
      buildType: 'systemjs',
      sentryDsn: process.env.SENTRY_DSN || 'https://dd66cf0c863044aab89c1bf54b38c690@o271781.ingest.sentry.io/1501570',
    },
  }),
  exclude: /node_modules\/(@babel|core-js)/,
  include: [/packages\/(core|player)/, /node_modules\/(redux|redux-thunk)/],
}

const banner = `/* speechkit-audio-player-v2 version ${pkg.version} */`
const defaultOutputForModule = {
  sourcemap,
  format: 'system',
  exports: 'named',
  banner,
}

export default [{
  input: [
    'src/index.js',
    'src/sdk.js',
  ],
  output: [{
    ...defaultOutputForModule,
    dir: dirDist('systemjs'),
  }, {
    ...defaultOutputForModule,
    dir: oldDirDist('systemjs'),
  }],
  plugins: [
    replace(defaultReplace),
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
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      extensions: ['.js', '.mjs', '.svelte'],
      exclude: ['node_modules/@babel/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              // browsers: '> 0.5%, ie >= 11',
              browsers: '> 1%, IE 11, not op_mini all, not dead',
            },
            modules: false,
            useBuiltIns: 'entry',
            corejs: 3,
          },
        ],
      ],
    }),
    !production && dev({
      dirs: [join(__dirname, '../../demo')],
      port: 5000,
      extend(app, modules) {
        app.use(modules.router.post('/events-development', handlerEventsDevelopment))
      },
      force: production,
    }),
    !production && livereload(oldDirDist()),
    production && terser(),
  ],
}]
