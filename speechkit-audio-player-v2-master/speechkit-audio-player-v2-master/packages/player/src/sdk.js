/* IE11-ONLY:START */
import 'core-js'
import 'regenerator-runtime/runtime'
/* IE11-ONLY:END */
import mitt from 'mitt'
import {
  assoc,
  firstLetterToUpperCase,
  isObject,
  keys,
  merge,
  not,
  notNil,
  parseInt,
  pick,
  prop,
  ifProp,
} from '@speechkit/speechkit-audio-player-core/utils'
import { errorLog } from '@speechkit/speechkit-audio-player-core/shared/errorTracking'
import { LANGUAGES, defineLanguage } from '@speechkit/speechkit-audio-player-core/shared/translate'
import { postMessageTypesPub as postMessageTypes } from '@speechkit/speechkit-audio-player-core/shared/analytics/constants'
import player from './containers/app'
import {
  pause, play, setTrackIndex, skipNextTrack, skipPrevTrack,
} from './actions/playback'
import { getValueStore, makeAppPath, makePlaybackPath } from './store/helpers'
import {
  forwardSeekSafe,
  loadPlaylist,
  rewindSeekSafe,
  setCurrentTimeSafe,
  setParams,
  updateLang,
} from './actions/app'
import { EVENTS_MAP, PLAYER_TYPE } from './constants/player'
import { checkIsPlaylist } from './actions/helpers'
import { getTrackByIndex, getTracks, getTrackIndex } from './selectors'

const sdk = async params => {
  const eventHandlerMap = {}
  const { isDemo } = params
  const events = mitt(eventHandlerMap)
  const appInst = await player(merge(params, {
    sdkEnabled: true,
    events,
  }))
  const { appStore: store, destroy } = appInst
  const { dispatch, getState } = store
  const getFromStore = getValueStore(store)
  const dsSetParams = args => (
    dispatch(setParams(args))
  )

  const embedMethod = {
    play() {
      dispatch(play())
    },
    pause() {
      dispatch(pause())
    },
    paused() {
      return not(getFromStore(makePlaybackPath('isPlay')))
    },
    currentTime() {
      return getFromStore(makePlaybackPath('currentTime'))
    },
    changeCurrentTime(seconds) {
      const value = parseInt(seconds)
      if (Number.isNaN(value)) return

      dispatch(setCurrentTimeSafe(value))
    },
    forward(seconds) {
      const value = parseInt(seconds)
      if (Number.isNaN(value)) return

      dispatch(forwardSeekSafe(value))
    },
    rewind(seconds) {
      const value = parseInt(seconds)
      if (Number.isNaN(value)) return

      dispatch(rewindSeekSafe(value))
    },
    duration() {
      return getFromStore(makePlaybackPath('duration'))
    },
    remainingTime() {
      return this.duration() - this.currentTime()
    },
    changeLang(language) {
      dispatch(updateLang({ language: defineLanguage(language) }))
      return getFromStore(makeAppPath('language'))
    },
    changeColor(colors) {
      if (not(isObject(colors) && notNil(colors))) return

      const data = pick(['color', 'bgColor', 'dmColor', 'dmBgColor', 'dm'], colors)
      const dataFields = keys(data)

      if (dataFields.length) {
        dsSetParams(dataFields.reduce((acc, next) => (
          assoc(`publisher${firstLetterToUpperCase(next)}`, prop(next, data), acc)
        ), {}))
      }
    },
    getCurrentItem() {
      const state = getState()
      return getTrackByIndex(getTrackIndex(state), state)
    },
    destroy,
    events,
  }

  const playlistMethods = ifProp(checkIsPlaylist(params), {
    getCurrent() {
      return getTrackIndex(getState())
    },
    setCurrent(index) {
      const value = parseInt(index)
      if (Number.isNaN(value)) return

      dispatch(setTrackIndex(value))
      return this.getCurrent()
    },
    previous() {
      dispatch(skipPrevTrack())
      return this.getCurrent()
    },
    next() {
      dispatch(skipNextTrack())
      return this.getCurrent()
    },
    getPlaylist() {
      return getTracks(getState())
    },
    getPlaylistItem(index) {
      const value = parseInt(index)
      if (Number.isNaN(value)) return

      return getTrackByIndex(value, getState())
    },
    async loadPlaylist(items) {
      // eslint-disable-next-line no-return-await
      return await dispatch(loadPlaylist(items))
    },
  }, {})

  const demoMethods = ifProp(isDemo, {
    setImagePicture(url) {
      dsSetParams({ publisherLogo: url })
    },
    setNumberOfItem(value) {
      const valInt = parseInt(value)
      if (Number.isNaN(valInt)) return
      dsSetParams({ visibleItems: valInt })
    },
  }, {})

  return merge(embedMethod, playlistMethods, demoMethods)
}

const wrapSdk = async params => {
  try {
    return await sdk(params)
  } catch (err) {
    errorLog(err)
    return null
  }
}

const SpeechKitSdk = {
  player: wrapSdk,
  Events: EVENTS_MAP,
  languages: LANGUAGES,
  postMessageTypes,
  playerTypes: PLAYER_TYPE,
  version: process.env.version,
}

export default SpeechKitSdk
