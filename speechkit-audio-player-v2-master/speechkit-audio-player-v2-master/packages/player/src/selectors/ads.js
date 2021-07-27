import {
  compose, pickAll, isNil, not, merge, isArray, head,
} from '@speechkit/speechkit-audio-player-core/utils'
import { getPreferredContentType, getAds } from './app'
import {
  memoizeOneCreateSelector,
  getMediaPodcast,
} from './helpers'

export const getMediaAds = memoizeOneCreateSelector(
  [getPreferredContentType, getAds],
  getMediaPodcast,
)

export const getAdInfo = compose(
  pickAll(['title', 'promo_link', 'isPresenting']),
  _ => merge(_, { isPresenting: not(isNil(_)) }),
  _ => isArray(_) ? head(_) : _,
  getMediaAds,
)
