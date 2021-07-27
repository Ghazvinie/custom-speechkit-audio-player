import { curry, path } from '@speechkit/speechkit-audio-player-core/utils'

export const makePath = (str = '') => str.split('.')

export const makePlaybackPath = str => makePath(`playback.${str}`)

export const makeAppPath = str => makePath(`app.${str}`)

export const getValueStore = curry((store, p) => (
  path(p, store.getState())
))
