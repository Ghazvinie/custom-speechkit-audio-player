import {
  arrayToHashMap,
  assoc,
  roundFloat,
  compose,
} from '@speechkit/speechkit-audio-player-core/utils'
import Native from '@speechkit/speechkit-audio-player-core/media/native'
import { createReducer } from '../actions/helpers'
import {
  setPlayerInst,
  setCurrentTime,
  setSpeedRate,
  actPlay,
  pause,
  updateProps,
  replayLast,
  forward,
} from '../actions/playback'
import { simplePayloadMerge } from './helpers'
import { DEFAULT_SEEK } from '../constants/player'

const initialState = {
  playerInst: null,
  currentSource: null,
  // playback state
  isPlay: false,
  duration: 0,
  currentTime: 0,
  playbackRate: 1,
  buffered: 0,
}

const mapApiFn = arrayToHashMap(Native.apiFns)

const callApiFn = (fnName, ...args) => state => {
  if ([mapApiFn.play, mapApiFn.setSpeedRate].includes(fnName) || state.playerInst.element) {
    state.playerInst[fnName](...args)
  }
  return state
}

const handleSetPlayerInst = simplePayloadMerge

const handlePlay = (state, { payload }) => (
  assoc('currentSource', payload, state)
)

const handlePause = callApiFn(mapApiFn.pause)

const handleSetCurrentTime = (state, { payload }) => (
  callApiFn(mapApiFn.setCurrentTime, payload)(state)
)

const handleSetSpeedRate = (state, { payload }) => compose(
  assoc('playbackRate', payload),
  callApiFn(mapApiFn.setSpeedRate, roundFloat(payload, 1)),
)(state)

const handleUpdateProps = simplePayloadMerge

const handleReplayLast = (state, { payload = DEFAULT_SEEK }) => (
  callApiFn(
    mapApiFn.setCurrentTime,
    Math.max(0, state.currentTime - payload),
  )(state)
)

const handleForward = (state, { payload = DEFAULT_SEEK }) => (
  callApiFn(
    mapApiFn.setCurrentTime,
    Math.min(state.duration - 1, state.currentTime + payload),
  )(state)
)

export default createReducer(initialState, {
  [setPlayerInst]: handleSetPlayerInst,
  [setCurrentTime]: handleSetCurrentTime,
  [setSpeedRate]: handleSetSpeedRate,
  [actPlay]: handlePlay,
  [pause]: handlePause,
  [updateProps]: handleUpdateProps,
  [replayLast]: handleReplayLast,
  [forward]: handleForward,
})
