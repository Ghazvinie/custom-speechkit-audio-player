import {
  assoc, compose, map, merge, propOr,
  toArray, noop, has, checkIsDarkColorScheme,
} from '@speechkit/speechkit-audio-player-core/utils'
import { createReducer } from '../actions/helpers'
import {
  appReady,
  appFailed,
  setParams,
  playAd,
  pauseAd,
  playEndedAd,
  addTrack,
  addAdsTrack,
  updateLang,
  updatePlaylist,
  setEventTrackerInst,
  updateMemPercent,
} from '../actions/app'
import { getAdsDataFailed } from '../actions/ads'
import {
  setTrackIndex,
  skipPrevTrack,
  skipNextTrack,
} from '../actions/playback'
import {
  simplePayloadMerge, assocTrue, assocFalse,
} from './helpers'

const initialState = {
  isReady: false,
  isDev: process.env.isDev,
  isShouldPlayAds: true,
  isAdsPlaying: false,
  isAdsCurrently: false,
  isPlaylist: false,
  tracks: [],
  trackIndex: 0,
  adsTracks: [],
  preferredContentType: null,
  customControls: null,
  eventTrackerInst: {
    trackEvent: noop,
    setMediaType: noop,
    getMediaType: noop,
  },
  memPercent: {},
}

const handleSetParams = (state, { payload }) => {
  if (has('publisherDm', payload)) {
    const isDemo = payload.isDemo || state.isDemo
    return simplePayloadMerge(state, {
      payload: merge(payload, {
        useDarkModeScheme: payload.publisherDm && (isDemo || checkIsDarkColorScheme()),
      }),
    })
  }

  return simplePayloadMerge(state, { payload })
}

const handlePlayAd = compose(
  ...map(assocTrue, ['isAdsPlaying', 'isAdsCurrently']),
)

const handlePausedAd = assocFalse('isAdsPlaying')

const handlePlayEndedAd = compose(
  ...map(assocFalse, ['isShouldPlayAds', 'isAdsPlaying', 'isAdsCurrently']),
)

const handlerAddTrack = (name = 'tracks') => (state, { payload }) => (
  assoc(name, [...propOr([], name, state), ...toArray(payload)], state)
)

const handleSetTrackIndex = (state, { payload }) => (
  assoc('trackIndex', payload, state)
)

const handleSetNextTrack = (next = 1) => state => {
  const { trackIndex, tracks } = state
  let nextTrackIndex = trackIndex + next

  if (nextTrackIndex >= tracks.length) {
    nextTrackIndex = tracks.length - 1
  } else if (nextTrackIndex < 0) {
    nextTrackIndex = 0
  }

  return assoc('trackIndex', nextTrackIndex, state)
}

const handleNextTrack = handleSetNextTrack()
const handlePrevTrack = handleSetNextTrack(-1)

const handleUpdatePlaylist = (state, { payload: podcasts }) => merge(state, {
  podcasts,
  tracks: [],
  trackIndex: 0,
})

const handleSetEventTrackerInst = (state, { payload: eventTrackerInst }) => (
  merge(state, { eventTrackerInst })
)

const handleUpdateMemPercent = (state, { payload: memPercent }) => (
  merge(state, { memPercent })
)

export default createReducer(initialState, {
  [setParams]: handleSetParams,
  [updateLang]: handleSetParams,
  [playAd]: handlePlayAd,
  [pauseAd]: handlePausedAd,
  [playEndedAd]: handlePlayEndedAd,
  [addTrack]: handlerAddTrack(),
  [addAdsTrack]: handlerAddTrack('adsTracks'),
  [getAdsDataFailed]: assocFalse('isShouldPlayAds'),
  [appReady]: assocTrue('isReady'),
  [appFailed]: assocFalse('isReady'),
  [setTrackIndex]: handleSetTrackIndex,
  [skipNextTrack]: handleNextTrack,
  [skipPrevTrack]: handlePrevTrack,
  [updatePlaylist]: handleUpdatePlaylist,
  [setEventTrackerInst]: handleSetEventTrackerInst,
  [updateMemPercent]: handleUpdateMemPercent,
})
