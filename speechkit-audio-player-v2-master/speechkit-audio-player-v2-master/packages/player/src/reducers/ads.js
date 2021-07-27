import {
  assoc, merge, compose, map,
} from '@speechkit/speechkit-audio-player-core/utils'
import { createReducer } from '../actions/helpers'
import {
  setParams,
  fetchingAds,
  getAdsData,
  getAdsDataFailed,
} from '../actions/ads'
import { assocFalse, assocTrue } from './helpers'

const initialState = {
  isReady: false,
  isFetching: false,
  podcast: {},
  podcasts: [],
}

const handleSetParams = merge

const handleGetAdsData = (state, { payload }) => compose(
  assocFalse('isFetching'),
  assoc('podcasts', [payload]),
)(state)

export default createReducer(initialState, {
  [setParams]: handleSetParams,
  [fetchingAds]: compose(...map(assocTrue, ['isFetching', 'isReady'])),
  [getAdsData]: handleGetAdsData,
  [getAdsDataFailed]: handleGetAdsData,
})
