import memoizeOne from 'memoize-one'
import {
  prop, propOr, compose, pickAll, not,
  pathOr, T, merge, roundFloat, map,
} from '@speechkit/speechkit-audio-player-core/utils'
import { getMediaPodcast, memoizeOneCreateSelector } from './helpers'

export const getApp = prop('app')
export const getAds = prop('ads')
const pathOrNull = pathOr(null)

const getPropFromApp = propName => compose(
  prop(propName),
  getApp,
)

export const getEvents = getPropFromApp('events')
export const getPreferredContentType = getPropFromApp('preferredContentType')
export const getIsAdsCurrently = getPropFromApp('isAdsCurrently')

export const getTrackIndex = compose(
  prop('trackIndex'),
  getApp,
)

export const getCurrentTrack = compose(
  memoizeOne(({ trackIndex, tracks }) => prop(trackIndex, tracks)),
  pickAll(['trackIndex', 'tracks']),
  getApp,
)

const getItemInfo = item => {
  if (item && item.raw) {
    const { meta, duration } = item.raw
    return merge(meta, { duration: roundFloat(duration) })
  }

  return null
}

export const getTracks = compose(
  map(getItemInfo),
  pathOrNull(['tracks']),
  getApp,
)

export const getTrackByIndex = (index, store) => compose(
  getItemInfo,
  pathOrNull(['tracks', index]),
  getApp,
)(store)

export const getMedia = memoizeOneCreateSelector(
  [getPreferredContentType, getApp, T],
  getMediaPodcast,
)

export const getIsLoading = memoizeOneCreateSelector(
  [getApp, getAds],
  ({ isReady }, { isFetching }) => (not(isReady) || isFetching),
)

export const getIsDemo = memoizeOneCreateSelector(
  [getApp],
  propOr(false, 'isDemo'),
)
