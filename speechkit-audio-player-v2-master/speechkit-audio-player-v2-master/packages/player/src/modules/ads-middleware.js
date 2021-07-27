import { createWatcherMiddleware } from '@speechkit/speechkit-audio-player-core/utils'
import {
  playAd,
  pauseAd,
  playEndedAd,
} from '../actions/app'
import {
  play,
  actPlay,
  pause,
  playEnded,
} from '../actions/playback'
import {
  getApp,
} from '../selectors'

const handlerPlay = async (payload, action, { dispatch, getState }) => {
  const {
    isShouldPlayAds,
    isAdsPlaying,
    adsTracks,
  } = getApp(getState())

  if (isShouldPlayAds && adsTracks.length) {
    dispatch(isAdsPlaying ? pauseAd() : playAd())
  }
}

const handlerPlayEnded = (payload, action, { getState, dispatch }) => {
  const { isAdsPlaying } = getApp(getState())
  if (!isAdsPlaying) return

  dispatch(playEndedAd())
  dispatch(play())
}

const handlers = {
  [actPlay]: handlerPlay,
  [pause]: handlerPlay,
  [playEnded]: handlerPlayEnded,
}

export default createWatcherMiddleware(handlers)
