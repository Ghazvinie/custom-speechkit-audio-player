import uuidV4 from 'uuid/v4'
import {
  compose, keys, propOr, ifProp, getRandomInt,
} from '../../utils'
import lStorage from '../../utils/localStorage'
import {
  eventBackendUrlVariants,
  ANALYTICS_PREFIX,
  STAGING_ANALYTICS_PREFIX,
  prodUrl,
  stagingUrl,
} from './constants'

export const getUserId = () => {
  const userId = lStorage.getLSValue('userId')
  if (userId) return userId

  return lStorage.setLSValue('userId', uuidV4())
}

export const getEventBackendUrl = ({ skBackend, analyticsUrl }) => {
  const eventBackendUrl = compose(
    key => propOr(null, key, eventBackendUrlVariants),
    _ => _.find(variants => skBackend.includes(variants)),
    keys,
  )(eventBackendUrlVariants)

  if (analyticsUrl && [prodUrl, stagingUrl].some(variants => skBackend.includes(variants))) {
    return `${analyticsUrl}${ifProp(skBackend.includes(prodUrl), ANALYTICS_PREFIX, STAGING_ANALYTICS_PREFIX)}`
  }

  return eventBackendUrl
}

export const getAnalyticsUrl = ({ analyticsUrls = [], traffic = [] } = {}) => {
  const randomValue = getRandomInt(1, 100) / 100
  const trafficIndex = traffic.findIndex((value, ind) => (
    (randomValue - traffic.slice(0, ind).reduce((acc, next) => (acc + next), 0)) <= value
  ))
  return analyticsUrls[trafficIndex] || null
}
