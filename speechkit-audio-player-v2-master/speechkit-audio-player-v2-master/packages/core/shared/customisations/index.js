import {
  parseInt,
  ifProp,
  checkIsPhone,
  eq,
  listen,
  curry,
  not,
} from '../../utils'
import postMessage from '../helpers/post-message'
import { getFeatureFlags } from '../helpers/feature-flags'
import {
  IFRAME_ATTRS,
  IFRAME_ATTRS_OLDER,
  NETTAVISEN_ATTRS,
  FORBES_ATTRS,
  PLAYLIST_STYLE_IFRAME_ATTRS,
} from '../constants/iframe-attributes'
import { PUBLISHERS, featureFlagsMap } from '../constants/customisations'
import { getCustomisationsControls } from './controls'

const setBgOnFirstClick = () => {
  const unsubscribe = listen(window, 'click', () => {
    document.body.style.background = 'rgba(255, 255, 255, 1)'
    unsubscribe()
  }, { passive: false })
}

const nettavisionPM = () => {
  const { minimalStyle } = NETTAVISEN_ATTRS

  postMessage({
    attrs: {
      style: minimalStyle,
    },
  })
}

const postIframeStyles = ({ nPublisherId, isPlaylist, isOlderUI }) => {
  const defaultAttr = ifProp(
    isPlaylist,
    PLAYLIST_STYLE_IFRAME_ATTRS,
    ifProp(isOlderUI, IFRAME_ATTRS_OLDER, IFRAME_ATTRS),
  )
  const {
    mobileStyle,
    style,
    onload,
  } = ifProp(eq(PUBLISHERS.forbes, nPublisherId), FORBES_ATTRS, defaultAttr)

  postMessage({
    attrs: {
      style: ifProp(checkIsPhone(), mobileStyle, style),
      onload,
    },
  })

  if (eq(PUBLISHERS.nettavisen, nPublisherId)) {
    nettavisionPM()
  }
}

const itemsIncludesItem = curry((items, item) => (
  items.includes(item)
))

const makeFlagsIncludes = featureFlags => (
  itemsIncludesItem(getFeatureFlags(featureFlags))
)

const checkStrWithRegex = testStr => (flag, additionalStr = '') => (
  (new RegExp(`${flag}${additionalStr}(,|$)`, 'g')).test(testStr)
)

export const checkIsPodcastPlayer = ({
  isPodcastPlayer,
  featureFlags,
  projectId,
}) => {
  const checkFlagWithRegex = checkStrWithRegex(featureFlags)
  const hasPodcastFlag = checkFlagWithRegex(featureFlagsMap.podcast_like)

  if (not(isPodcastPlayer && hasPodcastFlag)) return false

  if (checkFlagWithRegex(featureFlagsMap.podcast_like_sanofi)) return true

  if (checkFlagWithRegex(featureFlagsMap.podcast_like, '([^,]+)')) {
    return !!checkFlagWithRegex(featureFlagsMap.podcast_like, `_${projectId}`)
  }

  return hasPodcastFlag
}

export const customisations = async params => {
  const {
    isPlaylist, publisherId, featureFlags,
  } = params
  const flagsIncludes = makeFlagsIncludes(featureFlags)
  const nPublisherId = parseInt(publisherId)
  const eqPublisher = eq(nPublisherId)
  const isPodcastPlayer = checkIsPodcastPlayer(params)
  const isMemi = eqPublisher(PUBLISHERS.memi)
  const hideSpktLink = flagsIncludes(featureFlagsMap.hideSKLink)
  const hideFeedback = flagsIncludes(featureFlagsMap.hideFeedback)
  const useUIv2 = flagsIncludes(featureFlagsMap.ui_v2) || isPodcastPlayer
  const customControls = ifProp(
    flagsIncludes(featureFlagsMap.customControls),
    await getCustomisationsControls(nPublisherId),
    null,
  )
  const isJfm = itemsIncludesItem([PUBLISHERS.jfm0, PUBLISHERS.jfm1], nPublisherId)
  const isSanofi = flagsIncludes(featureFlagsMap.podcast_like_sanofi) && isPodcastPlayer
  const withoutUuids = flagsIncludes(featureFlagsMap.disabled_uuids)
  const withoutSpktGA = flagsIncludes(featureFlagsMap.disabled_gaSk)

  if (eqPublisher(PUBLISHERS.forbes)) {
    // click listener to change bg colour
    setBgOnFirstClick()
  }
  postIframeStyles({ nPublisherId, isPlaylist, isOlderUI: not(useUIv2) })

  return {
    hideSpktLink,
    hideFeedback,
    customControls,
    useUIv2,
    isJfm,
    isSanofi,
    isMemi,
    isPodcastPlayer,
    hideMinutes: isJfm,
    withoutScroll: isJfm,
    withoutUuids,
    withoutSpktGA,
  }
}
