import {
  getCreative,
  getVASTEventURLs,
  getNodesWithAttrValue,
  getContentOfNodesWithAttrValue,
  getElByName,
  getAttr,
} from './parse-xml'
import {
  parseInt,
  head,
  assoc,
  merge,
  propOr,
  not,
  canPlayType,
} from '../../utils'
import { errorLog } from '../errorTracking'
import { CONTENT_TYPE } from '../constants/media'

// in event of no Ad, fire error
const fireVastError = xVastDoc => {
  const [xError] = getElByName(xVastDoc, 'Error')
  if (xError.textContent) {
    const img = new Image()
    img.src = xError.textContent
  }
}

// Takes tracking Node, and gets & stores all events
// return new ad object with all trackingUrls appended by event type
const addTrackingUrls = (xEvents, aEventTypes) => {
  const getEventUrls = sEventType => (
    getContentOfNodesWithAttrValue(getElByName(xEvents, 'Tracking'), 'event', sEventType)
  )
  return Array.from(aEventTypes).reduce((acc, sEventType) => (
    assoc(sEventType, getEventUrls(sEventType) || [], acc)
  ), {})
}

const getAdDuration = xDuration => {
  // add error case
  if (!xDuration.textContent) {
    return null
  }
  const aTimeComponents = xDuration.textContent.split(':') // Split it at the colons.
  // Map the array of strings to an array of numbers
  const [hours, minutes, seconds] = aTimeComponents.map(parseInt)
  // return total, minutes are worth 60 seconds, hours are worth 60 minutes
  const nTimeSeconds = hours * 3600 + minutes * 60 + seconds

  return nTimeSeconds * 1000
}

const mimeTypes = Object.values(CONTENT_TYPE)
const filterByContentType = xMediaFiles => xMediaFiles.filter(xMediaFile => {
  const type = getAttr(xMediaFile, 'type')
  return canPlayType(type) || mimeTypes.includes(type)
})

const makeAdObject = ({
  xMediaCreative,
  xMediaFiles = [],
  xStaticResource,
  xDuration,
  xPricing,
  xAdTitle,
  xAltText,
  xClickThrough,
  xGoogleClickThrough,
  xAdvertiser = {},
  xCompanion,
  oTrackingUrls,
}) => {
  const sAdvertiser = propOr('Link', 'textContent', xAdvertiser)
  // eslint-disable-next-line no-nested-ternary
  const sClickThrough = xClickThrough
    ? xClickThrough.textContent
    : xGoogleClickThrough
      ? xGoogleClickThrough.textContent
      : (`https://${sAdvertiser}`)
  const xMediaCreativeId = getAttr(xMediaCreative, 'id')
  const getXCompanionAttr = getAttr(xCompanion)
  const getXPricingAttr = getAttr(xPricing)

  const oMedia = {
    duration: getAdDuration(xDuration) || 0,
    logo: xStaticResource ? xStaticResource.textContent : '',
    height: xCompanion ? parseInt(getXCompanionAttr('height')) : 0,
    width: xCompanion ? parseInt(getXCompanionAttr('width')) : 0,
    title: xAdTitle ? xAdTitle.textContent : null,
    altTitle: xAltText ? xAltText.textContent : null,
    pricing: {
      currency: xPricing ? getXPricingAttr('currency') : 0,
      model: xPricing ? getXPricingAttr('model') : 'CPM',
      cost: xPricing ? parseInt(xPricing.textContent) : 0,
    },
    trackingUrls: oTrackingUrls,
    promo_link: sClickThrough,
  }

  const media = filterByContentType(xMediaFiles).map(xMediaFile => {
    const getXMediaFileAttr = getAttr(xMediaFile)

    return merge(oMedia, {
      bitrate: parseInt(getXMediaFileAttr('bitrate')) || 0,
      content_type: getXMediaFileAttr('type'),
      delivery: getXMediaFileAttr('delivery'),
      url: xMediaFile.textContent,
    })
  })

  // add data to Ad object, using same structure as speechkit ads:
  return {
    id: xMediaCreativeId,
    campaign_id: xMediaCreativeId,
    campaign_name: sAdvertiser,
    media,
  }
}

// TODO: process XML to get ad object and return
const processVastAd = xVastDoc => {
  // get array of ads from Vast XML
  const aAds = getElByName(xVastDoc, 'Ad')
  if (!aAds.length) {
    fireVastError(xVastDoc)
    errorLog(new Error('No Demand'))
    return { data: null }
  }
  // get first Ad from VAST - WHEN FETCHING MORE THAN ONE AD, LOOK FOR SEQ=2 here
  const xAd = head(getNodesWithAttrValue(aAds, 'sequence', '1')) || head(aAds)
  // next find both the linear creative and the companion
  const xMediaCreative = getCreative(xAd)
  const getElByNameXMediaCreative = getElByName(xMediaCreative)
  const getElByNameXAd = getElByName(xAd)
  // collect all useful nodes from the Ad:
  const oNodes = {
    xMediaCreative,
    xDuration: head(getElByNameXMediaCreative('Duration')),
    xMediaFiles: Array.from(getElByNameXMediaCreative('MediaFile')),
    xPricing: head(getElByNameXAd('Pricing')),
    xAdTitle: head(getElByNameXAd('AdTitle')),
    xAdvertiser: head(getElByNameXAd('Advertiser')),
    xGoogleClickThrough: head(getElByNameXAd('ClickThrough')),
    // Look for companion (optional) for more info
    xCompanion: head(getElByNameXAd('Companion') || []),
  }

  if (oNodes.xCompanion) {
    const getElByNameXCompanion = getElByName(oNodes.xCompanion);
    [oNodes.xStaticResource] = getElByNameXCompanion('StaticResource');
    [oNodes.xAltText] = getElByNameXCompanion('AltText');
    [oNodes.xClickThrough] = getElByNameXCompanion('CompanionClickThrough')
  }

  // get tracking nodes from vast
  const [xTrackingEvents] = getElByNameXMediaCreative('TrackingEvents')
  // set the events we want to track
  const aCreativeEvents = ['start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete']
  // get and store all the tracking URLs for the above events on our oAd object
  const oTrackingUrls = addTrackingUrls(xTrackingEvents, aCreativeEvents)
  // finally add impression URLs after
  oTrackingUrls.impression = getVASTEventURLs(xAd, 'Impression')
  let data = makeAdObject(merge(oNodes, { oTrackingUrls }))

  if (not(data.media.length)) {
    data = null
  }

  return { data }
}

export default processVastAd
