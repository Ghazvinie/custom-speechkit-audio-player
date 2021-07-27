import {
  prop, pickAll, compose, roundFloat, path,
} from '@speechkit/speechkit-audio-player-core/utils'
import { getTrackIndex } from './app'

export const getPlayback = prop('playback')
export const getPlayerInst = path(['playback', 'playerInst'])

export const getProgressState = compose(
  pickAll(['currentTime', 'duration', 'buffered', 'playbackRate']),
  getPlayback,
)

export const getProgressStateForEvent = compose(
  ([_, index]) => ({
    duration: roundFloat(_.duration),
    progress: roundFloat(_.currentTime),
    index,
  }),
  _ => ([getPlayerInst(_), getTrackIndex(_)]),
)
