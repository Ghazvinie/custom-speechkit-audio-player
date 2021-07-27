import requestVastAd from './request-vast-ad'
import parseVastAd from './parse-vast-ad'

export const getVastAd = async ({ vastAdTag }) => {
  try {
    const vastAd = await requestVastAd(vastAdTag)
    if (vastAd) {
      return parseVastAd(vastAd)
    }
    // eslint-disable-next-line no-throw-literal
    throw 'vastAd empty'
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`requestVastAd: ${e}`)
    return { data: null }
  }
}
