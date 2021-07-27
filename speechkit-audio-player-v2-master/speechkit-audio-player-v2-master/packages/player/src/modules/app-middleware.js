import memoizeOne from 'memoize-one'
import { MEDIA_TYPE } from '@speechkit/speechkit-audio-player-core/shared/constants/media'
import {
  createWatcherMiddleware,
  prop,
  propOr,
  roundFloat,
  not,
  ifProp,
  eq,
  has,
  isFunction,
  getFileExtension,
  omit,
  hasMediaSession,
  getMediaSession,
} from '@speechkit/speechkit-audio-player-core/utils'
import postMessage from '@speechkit/speechkit-audio-player-core/shared/helpers/post-message'
import {
  setParams as setAppParams,
  addTrack,
  addAdsTrack,
  appReady,
  appFailed,
  setCurrentTimeSafe,
  forwardSeekSafe,
  rewindSeekSafe,
  updatePlaylist,
  updateMemPercent,
} from '../actions/app'
import { getAdsData } from '../actions/ads'
import {
  actPlay,
  setSpeedRate,
  updateProps,
  skipPrevTrack,
  skipNextTrack,
  play,
  pause,
  setTrackIndex,
  playEnded,
  setCurrentTime,
  forward,
  replayLast,
} from '../actions/playback'
import {
  getMedia,
  getMediaAds,
  getApp,
  getEvents,
  getPlayerInst,
  getIsAdsCurrently,
  getTrackByIndex,
  getProgressState,
} from '../selectors'
import { EVENTS_MAP } from '../constants/player'

const eqGetAdsDataType = eq(getAdsData.getType())
const eqUpdatePlaylist = eq(updatePlaylist.getType())
const getMediaFn = (ifIsAds, state) => ifIsAds(getMediaAds, getMedia)(state)
const addTrackFn = (ifIsAds, state) => ifIsAds(addAdsTrack, addTrack)(state)

const handleAddAllTracks = (payload, { type: actType }, { dispatch, getState }) => {
  const ifIsAds = ifProp(eqGetAdsDataType(actType))
  const media = getMediaFn(ifIsAds, getState()) || []

  dispatch(addTrackFn(ifIsAds, media.map(item => ({
    type: ifIsAds(MEDIA_TYPE.preroll, MEDIA_TYPE.podcast),
    url: prop('url', item),
    raw: item,
  }))))
}

const handleSetParams = (payload, ...args) => {
  if (not(has('podcast', payload) || has('podcasts', payload))) {
    return
  }

  handleAddAllTracks(payload, ...args)
}

const handleAppReady = (payload, action, { getState }) => {
  const { isAmp } = getApp(getState())
  postMessage('sk-success')
  if (isAmp) {
    postMessage({
      sentinel: 'amp',
      type: 'embed-ready',
    })
  }
}

const handleAppFailed = ({ isAmp }) => {
  postMessage('sk-fail')
  if (isAmp) {
    postMessage({
      sentinel: 'amp',
      type: 'embed-size',
      // NOTE: The embed-size request will be denied
      // if the request height is less than a certain threshold (100px).
      height: 100,
    })
  }
}

const handleSetSpeedRate = (payload, action, { getState }) => {
  const state = getState()
  const events = getEvents(state)
  const playerInst = getPlayerInst(state)
  events.emit(EVENTS_MAP.playbackRate, { playbackRate: playerInst.playbackRate })
}

const wrapForDispatch = fn => dispatch => event => {
  dispatch(isFunction(fn.getType) ? fn() : fn(event))
}
const getActionHandlerMap = memoizeOne(() => ({
  seekbackward: wrapForDispatch(rewindSeekSafe),
  seekforward: wrapForDispatch(forwardSeekSafe),
  seekto: wrapForDispatch(({ seekTime }) => setCurrentTimeSafe(seekTime)),
  previoustrack: wrapForDispatch(skipPrevTrack),
  nexttrack: wrapForDispatch(skipNextTrack),
  pause: wrapForDispatch(() => {
    getMediaSession().playbackState = 'paused'
    return pause()
  }),
  play: wrapForDispatch(() => play()),
}))

const handleActPlay = (payload, action, { dispatch, getState }) => {
  const state = getState()
  const { isPlaylist, trackIndex, publisherLogo } = getApp(state)
  const playerInst = getPlayerInst(state)
  const { title, author: artist } = getTrackByIndex(trackIndex, state)

  if (playerInst) {
    playerInst.title = `${artist}: ${title}`
  }

  if (hasMediaSession()) {
    const mediaSession = getMediaSession()

    const artwork = publisherLogo ? [{
      src: publisherLogo,
      sizes: '512x512',
      type: `image/${getFileExtension(publisherLogo)}`,
    }] : []

    mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album: '',
      artwork,
    })

    if (isFunction(mediaSession.setActionHandler)) {
      const actionHandlerMap = getActionHandlerMap()
      const actionHandlers =
        ifProp(isPlaylist, actionHandlerMap, omit(['previoustrack', 'nexttrack'], actionHandlerMap))
      mediaSession.setPositionState(null)
      Object.entries(actionHandlers).forEach(([eventName, handler]) => {
        mediaSession.setActionHandler(eventName, null)
        mediaSession.setActionHandler(eventName, handler(dispatch))
      })
    }
    if (isFunction(getMediaSession().setPositionState)) {
      const { currentTime, duration, playbackRate } = getProgressState(getState())
      const positionState = {
        duration,
        playbackRate,
        position: currentTime,
      }
      getMediaSession().setPositionState(positionState)
    }
    getMediaSession().playbackState = 'playing'
  }
}

const handleAddTrack = (payload, action, { dispatch, getState }) => {
  const state = getState()
  const { trackIndex } = getApp(state)
  const media = propOr({}, trackIndex, getMedia(state))

  dispatch(updateProps({
    duration: roundFloat(propOr(0, 'duration', media)),
  }))
}

const handleSetTrackIndex = (payload, { type: actType }, { dispatch, getState }) => {
  const state = getState()
  const { trackIndex } = getApp(state)
  const media = propOr({}, trackIndex, getMedia(state))

  dispatch(updateProps({
    duration: roundFloat(propOr(0, 'duration', media)),
    currentTime: 0,
    buffered: 0,
  }))
  dispatch(updateMemPercent({}))

  if (not(eqUpdatePlaylist(actType))) {
    dispatch(play())
  }
}

const handlePlayEnded = (payload, action, { dispatch, getState }) => {
  const {
    isAdsCurrently, isPlaylist, trackIndex, tracks,
  } = getApp(getState())
  dispatch(updateMemPercent({}))
  if (not(isAdsCurrently) && isPlaylist && trackIndex < tracks.length - 1) {
    dispatch(skipNextTrack())
  }
}

const handleSetCurrentTimeSafe = (payload, action, { dispatch, getState }) => {
  if (getIsAdsCurrently(getState())) return
  dispatch(setCurrentTime(payload))
}

const handleForwardSeekSafe = (payload, action, { dispatch, getState }) => {
  if (getIsAdsCurrently(getState())) return
  dispatch(forward(payload))
}

const handleRewindSeekSafe = (payload, action, { dispatch, getState }) => {
  if (getIsAdsCurrently(getState())) return
  dispatch(replayLast(payload))
}

const handleUpdatePlaylist = (...args) => {
  [handleAddAllTracks, handleSetTrackIndex].forEach(fn => {
    fn(...args)
  })
}

const handlers = {
  [actPlay]: handleActPlay,
  [setAppParams]: handleSetParams,
  [setCurrentTimeSafe]: handleSetCurrentTimeSafe,
  [forwardSeekSafe]: handleForwardSeekSafe,
  [rewindSeekSafe]: handleRewindSeekSafe,
  [getAdsData]: handleAddAllTracks,
  [appReady]: handleAppReady,
  [appFailed]: handleAppFailed,
  [setSpeedRate]: handleSetSpeedRate,
  [addTrack]: handleAddTrack,
  [setTrackIndex]: handleSetTrackIndex,
  [skipPrevTrack]: handleSetTrackIndex,
  [skipNextTrack]: handleSetTrackIndex,
  [playEnded]: handlePlayEnded,
  [updatePlaylist]: handleUpdatePlaylist,
}

export default createWatcherMiddleware(handlers)
