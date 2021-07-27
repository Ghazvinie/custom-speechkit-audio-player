import {
  notNil, isFalse, merge, pickAll, isArray, not, isTrue, ifProp,
  noop, deepMerge, find, compose, decamelize, prop, assocPath, parseInt,
  encodeURIComp, propOr, makeEmptyArray, F, assocUrlParam, has, checkIsDarkColorScheme,
} from '@speechkit/speechkit-audio-player-core/utils'
import {
  getPreferredContentType,
} from '@speechkit/speechkit-audio-player-core/shared/constants/media'
import http, { makeHeaderWithToken } from '@speechkit/speechkit-audio-player-core/shared/http'
import { customisations } from '@speechkit/speechkit-audio-player-core/shared/customisations'
import { getEventTracker } from '@speechkit/speechkit-audio-player-core/shared/analytics'
import setupSentry, { errorLog } from '@speechkit/speechkit-audio-player-core/shared/errorTracking'
import { getAnalyticsUrl } from '@speechkit/speechkit-audio-player-core/shared/eventTracker/helpers'
import { createAct, checkIsPlaylist } from './helpers'
import {
  setPlayerInst,
  handlePlaybackEvents,
  pause,
} from './playback'
import { getApp, getPlayback, getTracks } from '../selectors'
import {
  whiteListAppParams, demoPodcast, demoPodcastUrl,
  PLAYER_TYPE, VISIBLE_ITEMS,
} from '../constants/player'
import { getPlaylist } from './playlist'

const act = createAct('app')
export const setParams = act('setParams')
export const setCurrentTimeSafe = act('setCurrentTimeSafe')
export const forwardSeekSafe = act('forwardSeekSafe')
export const rewindSeekSafe = act('rewindSeekSafe')
export const updateLang = act('updateLang')
export const playAd = act('playAd')
export const pauseAd = act('pauseAd')
export const playEndedAd = act('playEndedAd')
export const addTrack = act('addTrack')
export const addAdsTrack = act('addAdsTrack')
export const appReady = act('appReady')
export const appFailed = act('appFailed')
export const updatePlaylist = act('updatePlaylist')
export const setEventTrackerInst = act('setEventTrackerInst')
export const updateMemPercent = act('updateMemPercent')

const makeStringParam = ([k, v]) => `?${decamelize(k)}=${encodeURIComp(v)}`
const titleFn = num => `${prop('title', demoPodcast)} ${num}`

const findParams = compose(
  _ => isArray(_) ? makeStringParam(_) : '',
  find(([, v]) => notNil(v)),
  Object.entries,
  pickAll(['podcastId', 'externalId', 'articleUrl', 'type']),
)

const requestSettingParams = ({ skBackend }) => (
  http.get(`${skBackend}/api/v1/settings`)
)

const requestConfiguredParams = ({
  skBackend, projectId, ...otherProps
}) => (
  http.get(`${skBackend}/cf/${projectId}${findParams(otherProps)}`)
)

const requestPodcastByArticleUrl = ({
  skBackend, projectId, articleUrl, apiKey,
}) => (
  http.get(
    `${skBackend}/s/${projectId}/${encodeURIComp(articleUrl)}`,
    makeHeaderWithToken(apiKey),
  )
)

const getConfiguredParams = async params => {
  let remoteParams = {}
  const { isDemo, isIframe } = params
  const isPlaylist = checkIsPlaylist(params)

  if ((isDemo && !isPlaylist) || isIframe) {
    return remoteParams
  }

  try {
    const sendParams = merge(params, ifProp(isPlaylist, { type: PLAYER_TYPE.playlist }, {}))
    const { data } = await requestConfiguredParams(sendParams)
    remoteParams = data
  } catch (e) {
    errorLog(new Error('Can\'t get the configure params'), true)
  }

  return remoteParams
}

const getSettingParams = async params => {
  const settingParams = {
    analyticsUrl: null,
  }

  try {
    const { data } = await requestSettingParams(params)
    const { analytics_urls: analyticsUrls, traffic } = propOr({}, 'player', data)
    settingParams.analyticsUrl = getAnalyticsUrl({ analyticsUrls, traffic })
  } catch (e) {
    errorLog(new Error('Can\'t get the setting params'), true)
  }

  return settingParams
}

export const initApp = ({
  Player,
  sdkEnabled,
  sentryInst,
  ...params
}) => async (dispatch, getState) => {
  const { isDemo } = params
  const isPlaylist = checkIsPlaylist(params)

  const [remoteParams, settingParams, playlistParams] = await Promise.all([
    getConfiguredParams(params),
    getSettingParams(params),
    getPlaylist(params),
  ])
  const appParams = merge(
    pickAll(whiteListAppParams, deepMerge(params, remoteParams)),
    settingParams,
    playlistParams && playlistParams.length ? { podcasts: playlistParams } : {},
  )

  const {
    podcast, articleUrl, publisherId,
    projectId, featureFlags,
    visibleItems, isPodcastPlayer,
    publisherDm,
  } = appParams
  setupSentry({ publisherId, projectId })

  if (isTrue(isDemo)) {
    const pathToMediaUrl = ['media', 0, 'url']
    const preview = propOr(demoPodcastUrl, 'preview', params)

    if (isPlaylist && not(isArray(appParams.podcasts) && appParams.podcasts.length)) {
      const assocUrlParamForPreview = assocUrlParam(preview, 't')
      appParams.podcasts = makeEmptyArray(6).map(item => compose(
        assocPath(['title'], titleFn(item + 1)),
        assocPath(pathToMediaUrl, assocUrlParamForPreview(item)),
      )(demoPodcast))
    } else {
      appParams.podcast = assocPath(pathToMediaUrl, preview, demoPodcast)
    }

    appParams.isShouldPlayAds = F()
  } else if (notNil(podcast)) {
    appParams.isShouldPlayAds = isFalse(podcast.ad_disabled)
  } else if (notNil(articleUrl)) {
    try {
      const { data } = await requestPodcastByArticleUrl(appParams)
      appParams.podcast = data
    } catch (e) {
      errorLog(new Error('Can\'t get the podcast by articleUrl'), true)
    }
  }

  if (!isPlaylist && !appParams.podcast) {
    errorLog(new Error('Can\'t init - the podcast is not defined'), true)
    return dispatch(appFailed(appParams))
  }

  if (not(isArray(appParams.podcasts))) {
    appParams.podcasts = [appParams.podcast]
  }

  if (isPlaylist) {
    appParams.podcasts =
      appParams.podcasts.filter(item => has('media', item) && isArray(item.media) && item.media.length)
    appParams.visibleItems = parseInt(visibleItems) || VISIBLE_ITEMS

    if (!appParams.podcasts.length) {
      errorLog(new Error('Can\'t init - the podcasts is not defined'), true)
      return dispatch(appFailed(appParams))
    }
  }

  const { events } = params
  appParams.events = ifProp(sdkEnabled, events, { on: noop, off: noop, emit: noop })

  const listener = evt => dispatch(handlePlaybackEvents(evt))
  const playerInst = new Player({ listener })
  const customisationsProps = await customisations({
    isPlaylist, publisherId, featureFlags, isPodcastPlayer, projectId,
  })
  const { withoutSpktGA } = customisationsProps
  const newGtagSettings = merge(appParams.gtagSettings, { withoutSpktGA })
  const preferredContentType = getPreferredContentType(Player.canPlayHls)
  const useDarkModeScheme = publisherDm && (isDemo || checkIsDarkColorScheme())

  dispatch(setParams(merge(
    appParams,
    { preferredContentType, isPlaylist, gtagSettings: newGtagSettings },
    customisationsProps,
    { useDarkModeScheme },
  )))
  dispatch(setPlayerInst({ playerInst }))
  dispatch(setEventTrackerInst(getEventTracker(getApp(getState()))))
  dispatch(appReady())
}

export const loadPlaylist = playlist => async (dispatch, getState) => {
  const data = await getPlaylist(merge(getApp(getState()), { playlist }))

  if (isArray(data)) {
    dispatch(pause())
    dispatch(updatePlaylist(data))
  }

  return getTracks(getState())
}

export const destroyApp = () => (dispatch, getState) => {
  const { playerInst } = getPlayback(getState())
  if (playerInst) {
    playerInst.destroy()
  }
}
