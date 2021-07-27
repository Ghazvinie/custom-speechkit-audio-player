import http, { makeHeaderWithToken } from '@speechkit/speechkit-audio-player-core/shared/http'
import { getVastAd } from '@speechkit/speechkit-audio-player-core/shared/ads'
import {
  pickAll, not, notNil, propOr,
} from '@speechkit/speechkit-audio-player-core/utils'
import { createAct } from './helpers'
import { getApp } from '../selectors'

const act = createAct('ads')
export const setParams = act('setParams')
export const fetchingAds = act('fetchingAds')
export const getAdsData = act('getAdsData')
export const getAdsDataFailed = act('getAdsDataFailed')
export const adLinkClick = act('adLinkClick')

const requestAdsData = ({ skBackend, projectCampaignId, apiKey }) => http.get(
  `${skBackend}/api/v2/project_campaigns/${projectCampaignId}`,
  makeHeaderWithToken(apiKey),
)

const getSpktAd = async props => {
  const { customAdMedia, projectCampaignId } = props

  if (customAdMedia) return customAdMedia
  if (not(projectCampaignId)) return null

  const result = await requestAdsData(props)
  return result
}

export const fetchAdsData = () => async (dispatch, getState) => {
  const appState = getApp(getState())
  const { vastAdTag } = appState
  dispatch(fetchingAds())

  try {
    const ads = vastAdTag
      ? await getVastAd(pickAll(['vastAdTag'], appState))
      : await getSpktAd(pickAll(
        ['skBackend', 'projectCampaignId', 'apiKey', 'customAdMedia'],
        appState,
      ))
    const data = propOr(null, 'data', ads)
    dispatch(notNil(data) ? getAdsData(data) : getAdsDataFailed({}))
  } catch (e) {
    dispatch(getAdsDataFailed({}))
    // eslint-disable-next-line no-console
    console.error(`requestAdsData ${e}`)
  }
}
