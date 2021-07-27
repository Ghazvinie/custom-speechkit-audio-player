import {
  assoc,
  keys,
  map,
  parseInt,
  compose,
  omit,
  merge,
  decamelize,
  camelize,
  prop,
} from '../../utils'

export const defaultGoogleAnalyticsId = 'UA-97997734-2'

export const eventCategory = 'SpeechKit Player'

export const progressVastPoints = {
  1: ['impression', 'start'],
  25: 'firstQuartile',
  50: 'midpoint',
  75: 'thirdQuartile',
}

const skMessagePrefix = 'sk'
const progressPoints = keys(progressVastPoints).splice(1)
const makeListenedStr = val => `${val}% Listened`
const makeListened = (acc, next) => assoc(next, makeListenedStr(next), acc)
const progressEventTracker = [20, 40, 60, 80]
const defaultProps = ['duration', 'currentTime']

export const eventNames = {
  load: ['Load', 'load'], // trackDidLoad
  play: ['Play', 'play', defaultProps], // trackDidPlay
  pause: ['Pause', 'pause', defaultProps], // trackDidPause
  // resume: [null, 'resume'], // trackDidResume
  end: ['Complete', 'listenToEnd'], // trackDidListenEnd
  speed: [null, 'speed', ['speed']], // trackDidChangeSpeed
  adLogoClick: ['Ad Logo Click', 'ad_logo_click'], // trackAdLogoClick
  adLinkClick: ['Ad Link Click', 'ad_link_click'], // trackAdLinkClick
  progress: [ // trackProgress
    progressPoints.reduce(makeListened, {}),
    progressEventTracker.reduce((acc, next) => assoc(next, 'progress', acc), {}),
    defaultProps,
  ],
  setCurrentTime: [null, 'setCurrentTime', defaultProps],
}

export const progressAllPoints =
  map(parseInt, keys(progressVastPoints)).concat(progressEventTracker).sort()

const omitProps = ['progress']

export const postMessageTypes = compose(
  _ => _.concat(omitProps).reduce((acc, next) => (
    merge(acc, {
      [next]: `${skMessagePrefix}-${decamelize(camelize(next), '-')}`,
    })
  ), {}),
  map(([, v]) => v),
  Object.values,
  omit(omitProps),
)(eventNames)

export const postMessageTypesPub = compose(
  _ => _.reduce((acc, next) => (
    merge(acc, {
      [camelize(next, '_')]: prop(next, postMessageTypes),
    })
  ), {}),
  keys,
// NOTE: temporary removed ad_logo_click need for the player with playlist
)(omit(['ad_logo_click'], postMessageTypes))
