import { not, isFunction, ifProp } from './checkers'
import { noop } from './function'

const getMatchMedia = () => (
  ifProp(
    isFunction(window.matchMedia),
    window.matchMedia,
    () => ({ matches: false, addListener: noop }),
  )
)

const mq = val => getMatchMedia()(val).matches

const mqPattern = width => `only screen and (max-device-width: ${width}px)`
const mqColorSchemePattern = scheme => `(prefers-color-scheme: ${scheme})`
const mqColorLightScheme = mqColorSchemePattern('light')
const mqColorDarkScheme = mqColorSchemePattern('dark')

export const checkIsPhone = () => mq(mqPattern(481))
export const checkIsTablet = () => mq(mqPattern(769))

export const getDeviceType = () => {
  if (checkIsPhone()) return 'phone'
  if (checkIsTablet()) return 'tablet'

  return 'desktop'
}

export const checkIsDarkColorScheme = () => (
  mq(mqColorDarkScheme) && not(mq(mqColorLightScheme))
)

export const addListenerChangeDarkColorScheme = (cb = noop) => {
  getMatchMedia()(mqColorDarkScheme).addListener(e => {
    cb(e.matches)
  })
}
