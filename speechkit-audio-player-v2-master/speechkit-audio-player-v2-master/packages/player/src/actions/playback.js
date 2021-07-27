import {
  MediaElementEventsMap, DEFAULT_PLAYBACK_RATE,
} from '@speechkit/speechkit-audio-player-core/shared/constants/media'
import {
  eq, makeEmptyArray, not, roundFloat, notNil,
  calcPercentage, prop, head, raf, timeout,
} from '@speechkit/speechkit-audio-player-core/utils'
import { fetchAdsData } from './ads'
import { createAct } from './helpers'
import {
  getAds,
  getApp,
  getPlayback,
  getCurrentTrack,
  getEvents,
  getProgressStateForEvent,
  getTrackIndex,
  getPlayerInst,
} from '../selectors'
import { EVENTS_MAP } from '../constants/player'

const act = createAct('playback')

export const setPlayerInst = act('setPlayerInst')
export const actPlay = act('play')
export const pause = act('pause')
export const setCurrentTime = act('setCurrentTime')
export const setSpeedRate = act('setSpeedRate')
export const updateProps = act('updateProps')
export const updateCurrentTime = act('updateCurrentTime')
export const playEnded = act('playEnded')
export const skipPrevTrack = act('skipPrevTrack')
export const skipNextTrack = act('skipNextTrack')
export const replayLast = act('replayLast')
export const forward = act('forward')
export const setTrackIndex = act('setTrackIndex')

const eventsMap = MediaElementEventsMap
let rafId = null

export const handlePlaybackEvents = evt => (dispatch, getState) => {
  const { type } = evt
  const state = getState()
  const playerInst = getPlayerInst(state)
  const events = getEvents(state)
  const eqType = eq(type)
  let props

  if (eqType(eventsMap.timeupdate)) {
    if (rafId) return

    rafId = raf(() => {
      if (playerInst.element && not(playerInst.paused)) {
        const currentTime = roundFloat(playerInst.currentTime)
        dispatch(updateProps({ currentTime }))
        dispatch(updateCurrentTime(currentTime))
        events.emit(EVENTS_MAP.timeUpdate, getProgressStateForEvent(state))
      }
      rafId = null
    })
    return
  }
  if (eqType(eventsMap.loadedmetadata) || eqType(eventsMap.durationchange)) {
    props = { duration: roundFloat(playerInst.duration) }
  }
  if ([eventsMap.pause, eventsMap.playing, eventsMap.play].includes(type)) {
    props = { isPlay: not(playerInst.paused) }
    if (type === eventsMap.pause) {
      events.emit(EVENTS_MAP.pause, getProgressStateForEvent(state))
    }
  }
  if (eqType(eventsMap.progress)) {
    const { duration, buffered, currentTime } = playerInst
    let bufferedPercentage = buffered
    const bufferedLength = buffered.length

    if (duration > 0 && bufferedLength) {
      const bufferIndex = makeEmptyArray(bufferedLength).findIndex(idx => (
        buffered.start(bufferedLength - 1 - idx) < currentTime
      ))
      if (bufferIndex !== -1) {
        bufferedPercentage = calcPercentage(
          buffered.end(bufferedLength - 1 - bufferIndex),
          duration,
        )
      }
    }
    props = { buffered: roundFloat(bufferedPercentage) }
  }
  if (eqType(eventsMap.ended)) {
    dispatch(playEnded())
    props = { isPlay: not(playerInst.ended) }
    events.emit(EVENTS_MAP.ended, { index: getTrackIndex(state) })
  }

  if (notNil(props)) {
    dispatch(updateProps(props))
  }
}

export const play = source => async (dispatch, getState) => {
  const state = getState()
  const { isShouldPlayAds } = getApp(state)
  const { isReady } = getAds(state)
  const { playerInst } = getPlayback(state)
  const currentTrack = getCurrentTrack(state)
  const events = getEvents(state)
  let nowSource = source || prop('url', currentTrack)

  if (isShouldPlayAds && !isReady) {
    await playerInst.play(nowSource)
    // NOTE: Safari doesn't play a source if next call a play with the same source.
    // we need to wait before making a pause
    await timeout(0) // flow interruption
    playerInst.pause()
    await dispatch(fetchAdsData())
  }

  const { adsTracks } = getApp(getState())
  if (isShouldPlayAds && adsTracks.length) {
    const { url } = head(adsTracks)
    nowSource = url
    dispatch(setSpeedRate(DEFAULT_PLAYBACK_RATE))
  }

  playerInst.play(nowSource).then(() => {
    dispatch(actPlay(nowSource))
    events.emit(EVENTS_MAP.play, getProgressStateForEvent(getState()))
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.error(err)
  })
}
