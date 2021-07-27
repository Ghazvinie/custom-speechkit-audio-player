const SECURE_PROTOCOL_URL = 'https://'
const ANALYTICS_URL = `${SECURE_PROTOCOL_URL}happen.spkt.io`

export const ANALYTICS_PREFIX = '/events'
export const STAGING_ANALYTICS_PREFIX = `${ANALYTICS_PREFIX}-staging`
export const localUrl = 'spkt.local'
export const stagingUrl = `${SECURE_PROTOCOL_URL}staging.spkt.io`
export const prodUrl = `${SECURE_PROTOCOL_URL}spkt.io`
const onrenderUrl = `${SECURE_PROTOCOL_URL}speechkit-audio-player-v2.onrender.com`
const prodAnalyticsUrl = `${ANALYTICS_URL}${ANALYTICS_PREFIX}`
const stagingAnalyticsUrl = `${ANALYTICS_URL}${STAGING_ANALYTICS_PREFIX}`

export const eventBackendUrlVariants = {
  [localUrl]: `http://${localUrl}:5000/events-development`,
  [stagingUrl]: stagingAnalyticsUrl,
  [onrenderUrl]: stagingAnalyticsUrl,
  [prodUrl]: prodAnalyticsUrl,
}
