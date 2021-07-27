import http from '../http'
import loadScript from '../helpers/load-script'
import getURLParameter from '../helpers/get-parameter'
import { roundFloat } from '../../utils'
import { errorLog } from '../errorTracking'

const generateRequestURL = oVastAd => {
  // Apply different params if tag is for Google Ads
  let { sVastTag } = oVastAd
  const { bGoogleAd, oGDPR, sProtocol } = oVastAd

  if (bGoogleAd) {
    // Code for Google Ads: overwrite url + description_url params
    const sURL = new URL(`http:${sVastTag}`)
    const sQueryString = sURL.search
    const URLParams = new URLSearchParams(sQueryString)
    // new value of "id" is set to "101"
    URLParams.set('url', document.referrer)
    URLParams.set('description_url', window.location.href)
    // change the search property of the main url
    sURL.search = URLParams.toString()
    // the new url string
    sVastTag = sURL.toString().slice(5)
  } else {
    // Code for Adswizz Ads: add GDPR params, run decorator func (available in window scope)
    // eslint-disable-next-line no-undef
    sVastTag = com_adswizz_synchro_decorateUrl(sVastTag)
    // add consent data if present
    let sCMP = '&aw_0_req.gdpr=false'
    if (oGDPR.consentData) {
      sCMP = `&aw_0_req.gdpr=${oGDPR.gdprApplies}&aw_0_req.userConsent=${oGDPR.consentData}`
    }
    sVastTag += sCMP
  }
  // add cache buster to all tags
  const cb = `&cb=${roundFloat(new Date().getTime() / 1000, 0)}`
  sVastTag += cb
  // return with correct protocol http/https
  return sProtocol + sVastTag
}

// Get the GDPR information from the iframe cpm param on src
// param is set by from iframe-helper, caputured from publisher page
const getGDPR = () => {
  const sEncodedGDPR = getURLParameter('cmp')
  // if param is present, decode and parse to object
  if (sEncodedGDPR) {
    return JSON.parse(atob(sEncodedGDPR))
  }
  // if cannot get data, return false by default
  return { gdprApplies: false }
}

const requestVastAd = async vastAdTag => {
  const oVastAd = {
    sVastTag: vastAdTag,
    sProtocol: window.location.protocol,
    bGoogleAd: vastAdTag.includes('pubads.g.doubleclick.net'),
    oGDPR: getGDPR(), // {consentData: x, gdprApplies: y}
  }

  try {
    if (!oVastAd.bGoogleAd) {
      const sConsentParam = `?aw_0_req.gdpr=${oVastAd.oGDPR.gdprApplies}`
      // Adswizz scripts - to be embedded in iframe before making VAST request:
      const sAdsWizzScript = `${oVastAd.sProtocol}//synchrobox.adswizz.com/register2.php`
      const sAdsWizzScript2 = `${oVastAd.sProtocol}//cdn.adswizz.com/adswizz/js/SynchroClient2.js`
      await Promise.all([
        await loadScript(sAdsWizzScript + sConsentParam),
        await loadScript(sAdsWizzScript2 + sConsentParam),
      ])
    }
    const sAdRequestURL = generateRequestURL(oVastAd)
    // make request with updated tag
    const { data } = await http.get(sAdRequestURL, {
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'text/plain',
      },
    })

    return (new window.DOMParser().parseFromString(data, 'text/xml'))
  } catch (error) {
    errorLog(new Error(`Vast Request Error: ${error}`))
  }
}

export default requestVastAd
