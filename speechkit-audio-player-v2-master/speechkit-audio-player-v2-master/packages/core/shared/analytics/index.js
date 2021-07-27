import {
  assoc,
  merge,
  calcPercentage,
  pickAll,
  head,
  isNil,
  not,
  notNil,
  has,
  curry,
  prop,
  propOr,
  toArray,
  trim,
  omit,
  eq,
  getHostname,
  ifProp,
  parseHostname,
} from '../../utils'
import eventTrackerInit from '../eventTracker'
import { MEDIA_TYPE } from '../constants/media'
import postMessage from '../helpers/post-message'
import dataLayerEventPush from './dataLayer'
import { gtagInit } from './gtag'
import { checkShouldUseGaFeature } from './gtag/helpers'
import {
  eventCategory,
  progressVastPoints,
  eventNames,
  progressAllPoints,
  postMessageTypes,
} from './constants'

const omitParams = omit([
  'podcastUrl', 'isAdsCurrently', 'campaignId',
  'mediaId', 'mediaAdsId', 'trackingUrls',
  'adDuration', 'podcastId', 'eventTracker',
  'memPercent', 'updateMemPercent',
])

const checkIsAds = eq(MEDIA_TYPE.preroll)
const sendEvent = ([dataLayerName, eventTrackerName, postMessageProps = []], params = {}) => {
  const {
    campaignId, mediaId, mediaAdsId,
    podcastUrl, duration, adDuration,
    podcastId, podcastTitle, eventTracker,
  } = params
  const isAds = checkIsAds(eventTracker.getMediaType())

  if (dataLayerName) {
    const dataLayerEventPrefer = (
      dataLayerName !== head(eventNames.load)
      && isAds
    ) ? 'Ad ' : ''
    const podcastHostname = parseHostname(podcastUrl).replace(/^www\./, '')
    const eventOption = {
      event_category: eventCategory,
      event_label: `${podcastTitle}|${podcastHostname}`.slice(0, 100),
      speechkit_hostname: getHostname(),
    }
    if (eventTracker.gtagIds) {
      eventOption.send_to = eventTracker.gtagIds
    }
    dataLayerEventPush(`${dataLayerEventPrefer}${dataLayerName}`, eventOption)
  }

  if (not(eventTrackerName)) return

  const trackEventProps = merge(
    {
      event_type: eventTrackerName,
      media_id: isAds ? mediaAdsId : mediaId,
      campaign_id: campaignId,
      podcast_id: podcastId,
    },
    omitParams(params),
    {
      duration: isAds ? adDuration : duration,
    },
  )

  if (eventTrackerName !== eventNames.setCurrentTime[1]) {
    eventTracker.trackEvent(trackEventProps)
  }

  if (has(eventTrackerName, postMessageTypes)) {
    postMessage(merge({
      type: prop(eventTrackerName, postMessageTypes),
      isAdsPlaying: isAds,
    }, pickAll(postMessageProps, params)))
  }
}

export const trackDidLoad = ({ isAds, ...params }) => {
  const [gaLoad, etLoad] = eventNames.load
  sendEvent([isAds ? null : gaLoad, etLoad], params)
}

export const trackDidPlay = params => {
  const { currentTime } = params
  const [gaPlay, etPlay, pmProps] = eventNames.play
  // Google Analytics - send click event if currentTime=0 (first-play)
  sendEvent([currentTime < 0.1 ? gaPlay : null, etPlay, pmProps], params)
}

export const trackDidPause = params => {
  const { currentTime, duration } = params
  sendEvent(eventNames.pause, merge(params, {
    ui_location: 'button',
    listen_length_seconds: currentTime,
    listen_length_percent: calcPercentage(currentTime, duration),
    duration,
  }))
}

export const trackDidChangeSpeed = params => {
  sendEvent(eventNames.speed, params)
}

export const trackAdLogoClick = params => {
  sendEvent(eventNames.adLogoClick, params)
}

export const trackAdLinkClick = params => {
  sendEvent(eventNames.adLinkClick, params)
}

const trackUrls = (trackingUrls, evtNames) => {
  if (isNil(trackingUrls)) return

  toArray(evtNames).forEach(eventName => {
    const urls = propOr([], eventName, trackingUrls)
    urls.reverse().forEach(url => {
      if (isNil(url)) return
      const img = new Image()
      img.src = trim`${url}`
    })
  })
}

const checkPercent = ({
  memPercent,
  updateMemPercent,
  percentListened: percent,
  filteredProgressPoint: check,
}) => {
  if (percent >= check && not(has(check, memPercent))) {
    const newMemPercent = progressAllPoints.filter(point => (
      point <= percent && not(prop(point, memPercent))
    )).reduce((acc, next) => assoc(next, 1, acc), memPercent)
    updateMemPercent(newMemPercent)
    return true
  }

  return false
}

const cHas = curry((key, obj) => has(key, obj))

export const trackProgress = params => {
  const { memPercent } = params
  const filteredProgressPoint =
    progressAllPoints.find(point => not(prop(point, memPercent)))

  if (not(filteredProgressPoint && checkPercent(merge(params, { filteredProgressPoint })))) return

  const {
    percentListened,
    isAdsCurrently,
    trackingUrls,
    currentTime,
  } = params
  const [dataLayerName, eventTrackerName, pmProps] = eventNames.progress
  const hasFilteredProgressPoint = cHas(filteredProgressPoint)
  const getPropByPoint = prop(filteredProgressPoint)
  const isShouldCallTrackUrls = isAdsCurrently && notNil(trackingUrls)
  const newParams = merge({
    listen_length_seconds: currentTime,
    listen_length_percent: percentListened,
  }, params)

  if (isShouldCallTrackUrls && hasFilteredProgressPoint(progressVastPoints)) {
    trackUrls(trackingUrls, getPropByPoint(progressVastPoints))
  }
  if (hasFilteredProgressPoint(dataLayerName)) {
    sendEvent([getPropByPoint(dataLayerName), null], newParams)
  }
  if (hasFilteredProgressPoint(eventTrackerName)) {
    sendEvent([null, getPropByPoint(eventTrackerName), pmProps], newParams)
  }
}

export const trackDidListenEnd = isAds => params => {
  if (isAds) {
    const { trackingUrls } = params
    trackUrls(trackingUrls, 'complete')
  }
  sendEvent(eventNames.end, merge(
    params,
    { media_type: isAds ? MEDIA_TYPE.preroll : MEDIA_TYPE.podcast },
  ))
}

export const trackDidSetCurrentTime = params => {
  sendEvent(eventNames.setCurrentTime, params)
}

export const setMediaType = ({ eventTracker }, type) => {
  eventTracker.setMediaType(type)
}

const pickEventTrackerProps = pickAll([
  'projectId', 'publisherId', 'skBackend',
  'projectCampaignId', 'analyticsUrl', 'withoutUuids',
])

export const getEventTracker = appProps => {
  const { featureFlags, withoutSpktGA } = appProps
  const ifUseGaFeature = ifProp(checkShouldUseGaFeature(featureFlags))

  return merge(
    eventTrackerInit(pickEventTrackerProps(appProps)),
    {
      gtagIds: ifUseGaFeature(gtagInit(appProps).join(','), null),
      withoutSpktGA,
    },
  )
}
