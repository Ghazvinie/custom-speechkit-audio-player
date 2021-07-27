import {
  trackDidLoad,
  trackDidPlay,
  trackDidPause,
  trackDidChangeSpeed,
  trackDidListenEnd,
  trackProgress,
  setMediaType,
  trackAdLinkClick,
  trackDidSetCurrentTime,
} from '@speechkit/speechkit-audio-player-core/shared/analytics'
import {
  createWatcherMiddleware,
  calcPercentage,
  roundFloat,
  merge,
  keys,
  propOr,
  pathOr,
  eq,
  ifProp,
  prop,
  curry,
  assoc,
} from '@speechkit/speechkit-audio-player-core/utils'
import { MEDIA_TYPE } from '@speechkit/speechkit-audio-player-core/shared/constants/media'
import {
  appReady,
  playAd,
  playEndedAd,
  addAdsTrack,
  updateMemPercent,
} from '../actions/app'
import { adLinkClick } from '../actions/ads'
import {
  actPlay,
  pause,
  playEnded,
  setSpeedRate,
  setCurrentTime,
  updateCurrentTime,
} from '../actions/playback'
import {
  getApp,
  getAds,
  getPlayback,
  getProgressState,
  getMedia,
  getMediaAds,
  getIsDemo,
} from '../selectors'
import { memoizeOneCreateSelector } from '../selectors/helpers'

let adIsEnded = false
const propOrEmptyString = propOr('')
const pathOrEmptyObject = pathOr({})
const getItemByIndex = curry((index, arr) => (
  pathOrEmptyObject([index], arr)
))

const getAdditionalParams = memoizeOneCreateSelector(
  [getApp, getAds, getMedia, getMediaAds, prop('dispatch')],
  (app, ads, media, mediaAds, dispatch) => {
    const {
      isAdsCurrently, podcasts, trackIndex, eventTrackerInst: eventTracker,
      memPercent,
    } = app
    const getItemByTrackIndex = getItemByIndex(trackIndex)
    const podcast = getItemByTrackIndex(podcasts)
    const podcastUrl = propOrEmptyString('url', podcast)
    const podcastId = propOrEmptyString('id', podcast)
    const podcastTitle = propOrEmptyString('title', podcast)
    const { campaign_id: campaignId } = pathOrEmptyObject(['podcasts', 0], ads)
    const { id: mediaId, duration } = getItemByTrackIndex(media)
    const { id: mediaAdsId, trackingUrls, duration: adDuration } = pathOrEmptyObject([0], mediaAds)
    const roundedDuration = roundFloat(ifProp(isAdsCurrently, adDuration, duration))

    return {
      eventTracker,
      memPercent,
      updateMemPercent: (...args) => dispatch(updateMemPercent(...args)),
      podcastUrl,
      isAdsCurrently,
      campaignId,
      mediaId,
      mediaAdsId,
      trackingUrls,
      duration: roundedDuration,
      adDuration,
      podcastId,
      podcastTitle,
    }
  },
)

const handlePlayAd = params => {
  setMediaType(params, MEDIA_TYPE.preroll)
}

const handlePlayEndedAd = () => {
  adIsEnded = true
}

const handlePlayEnded = (...args) => {
  trackDidListenEnd(adIsEnded)(...args)
  if (adIsEnded) {
    adIsEnded = false
    setMediaType(args[0], MEDIA_TYPE.podcast)
  }
}

const handleUpdateCurrentTime = (params, payload, actions, { getState }) => {
  const state = getState()
  const { playbackRate } = getPlayback(state)
  const { currentTime, duration } = getProgressState(state)
  const percentListened = calcPercentage(currentTime, duration)
  trackProgress(merge(params, {
    percentListened,
    currentTime,
    duration,
    speed: roundFloat(playbackRate, 1),
  }))
}

const eqAddAdsTrackType = eq(addAdsTrack.getType())
const handleDidLoad = (params, payload, { type: actType }) => {
  const isAds = eqAddAdsTrackType(actType)
  const ifIsAds = ifProp(isAds)

  if (isAds) {
    handlePlayAd(params)
  }

  trackDidLoad(merge(
    params,
    {
      isAds,
      media_type: ifIsAds(MEDIA_TYPE.preroll, MEDIA_TYPE.podcast),
      duration: prop(ifIsAds('adDuration', 'duration'), params),
    },
  ))
}

const handleActPlay = (params, payload, actions, { getState }) => {
  const { currentTime } = getProgressState(getState())
  trackDidPlay(merge(params, { currentTime }))
}

const handlePause = (params, payload, actions, { getState }) => {
  const { currentTime, duration } = getProgressState(getState())
  trackDidPause(merge(params, { currentTime, duration }))
}

const handleSetSpeedRate = (params, payload, actions, { getState }) => {
  const { playbackRate: speed } = getPlayback(getState())
  trackDidChangeSpeed(merge(params, { speed: roundFloat(speed, 1) }))
}

const handleSetCurrentTime = (params, payload, actions, { getState }) => {
  const { duration } = getProgressState(getState())
  trackDidSetCurrentTime(merge(params, { currentTime: roundFloat(payload), duration }))
}

const handlers = {
  [appReady]: handleDidLoad,
  [actPlay]: handleActPlay,
  [pause]: handlePause,
  [setSpeedRate]: handleSetSpeedRate,
  [playAd]: handlePlayAd,
  [playEnded]: handlePlayEnded,
  [playEndedAd]: handlePlayEndedAd,
  [updateCurrentTime]: handleUpdateCurrentTime,
  [addAdsTrack]: handleDidLoad,
  [adLinkClick]: trackAdLinkClick,
  [setCurrentTime]: handleSetCurrentTime,
}

const handlerWrapper = act => (payload, action, store) => {
  const { getState, dispatch } = store
  const state = getState()

  if (getIsDemo(state)) return

  act(getAdditionalParams(merge(state, { dispatch })), payload, action, store)
}

const wrapHandlers = keys(handlers).reduce((acc, next) => (
  assoc(next, handlerWrapper(handlers[next]), acc)
), {})

export default createWatcherMiddleware(wrapHandlers)
