import { compose } from './function'
import { ifProp, isFunction } from './checkers'
import { prop } from './object'

export const raf = fn => (
  window.requestAnimationFrame(fn)
)

const unknownOS = 'Unknown'

// eslint-disable-next-line no-restricted-globals
const getUA = () => self.navigator.userAgent || unknownOS

export const isAndroidOS = () => /android/i.test(getUA())

export const isUnknownOS = () => /unknown/i.test(getUA())

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

export const listen = (node, event, handler, options) => {
  node.addEventListener(event, handler, options)
  return () => node.removeEventListener(event, handler, options)
}

export const encodeURIComp = str => window.encodeURIComponent(str)

export const optimizedResize = (() => {
  const fns = []
  let running = false
  let listener

  const runFns = () => {
    fns.forEach(fn => {
      fn()
    })

    running = false
  }

  const addFn = fn => {
    if (isFunction(fn)) {
      fns.push(fn)
    }
  }

  const handleResize = () => {
    if (!running) {
      running = true
      raf(runFns)
    }
  }

  return {
    add(fn) {
      if (!fns.length) {
        listener = listen(window, 'resize', handleResize)
      }
      addFn(fn)
    },
    deleteAll() {
      if (isFunction(listener)) {
        fns.length = 0
        listener()
      }
    },
  }
})()

export const isTopWindow = () => (
  // eslint-disable-next-line eqeqeq
  window == window.parent
)

export const parseHostname = compose(
  _ => prop(0, _.split('?')),
  _ => prop(0, _.split(':')),
  _ => prop([ifProp(_.indexOf('@') !== -1, 1, 0)], _.split('@')),
  _ => prop([ifProp(_.indexOf('//') !== -1, 2, 0)], _.split('/')),
  _ => String(_ || ''),
)

export const getHostname = () => (
  parseHostname(ifProp(isTopWindow(), window.location.hostname, document.referrer))
)

export const hasMediaSession = () => (
  window && 'mediaSession' in window.navigator && 'MediaMetadata' in window
)

export const getMediaSession = () => (
  // eslint-disable-next-line prefer-destructuring
  window.navigator.mediaSession
)
