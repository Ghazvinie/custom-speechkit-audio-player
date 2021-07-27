import { connect } from 'svelte-redux-connect'
import memoizeOne from 'memoize-one'
import translate from '@speechkit/speechkit-audio-player-core/shared/translate'
import {
  trim,
  formatTime,
  ifProp,
  roundFloat,
  merge,
  prop,
  compose,
  eq,
} from '@speechkit/speechkit-audio-player-core/utils'
import {
  forwardSeekSafe, rewindSeekSafe, setCurrentTimeSafe,
} from '../../actions/app'
import { adLinkClick } from '../../actions/ads'
import { mapDispatchToPropsFactory } from '../../actions/helpers'
import {
  play, pause, setSpeedRate, setCurrentTime,
} from '../../actions/playback'
import {
  getApp,
  getPlayback,
  getProgressState,
  getAdInfo,
  getIsLoading,
} from '../../selectors'
import {
  memSpeedRate,
  getPublisherColor,
  getPublisherBgColor,
  makeColorVar,
} from './helpers'

const memRootStyle = memoizeOne(({
  publisherColor,
  publisherBgColor,
  isReady,
  useUIv2,
  useDarkModeScheme,
}) => {
  const ifUseDarkModeScheme = ifProp(useDarkModeScheme)

  return trim`
    color: ${publisherColor};
    ${ifProp(useUIv2, `background-color: ${publisherBgColor};`, '')}
    ${ifProp(isReady, '', 'display: none;')}
    --sk-text-color: var(${ifUseDarkModeScheme(makeColorVar('white'), makeColorVar('black'))});
    ${ifUseDarkModeScheme(`--sk-link-color: var(${makeColorVar('white')});`, '')}
    ${ifUseDarkModeScheme(`--sk-link-color--hover: var(${makeColorVar('white')});`, '')}
  `
})

const mapStateToProps = state => {
  const appState = getApp(state)
  const {
    language, isAdsCurrently,
    hideSpktLink, hideFeedback, customControls,
    isReady, isAmp, useUIv2, useDarkModeScheme,
    publisher, publisherLogo, trackIndex, podcasts,
    isSanofi, isMemi, isJfm, publisherId, isPodcastPlayer,
  } = appState
  const { isPlay, playbackRate } = getPlayback(state)
  const progressState = getProgressState(state)
  const {
    promo_link: adLink,
    title: adTitle,
    altTitle: adAltTitle,
    isPresenting: isAdPresenting,
  } = getAdInfo(state)
  const eqPublisher = eq(publisherId)
  const isLoading = getIsLoading(state)
  const ifIsLoading = ifProp(isLoading)
  const ifIsUIv2 = ifProp(useUIv2)
  const { duration, currentTime } = progressState
  const t = translate(language)
  const remainingTime = roundFloat(currentTime < duration ? duration - currentTime : 0, 0)
  const formattedTime = ifIsUIv2(
    `${formatTime(currentTime)} / ${formatTime(duration)}`,
    formatTime(remainingTime),
  )
  const splitAdsLink = ifIsUIv2('•', '|')
  const ifIsAdsPresenting = ifProp(isAdPresenting && !isLoading)
  const ifIsAdsCurrently = ifProp(isAdsCurrently && isAdPresenting)
  const ifIsPlay = ifProp(isPlay)
  const formattedDuration = ifIsAdsCurrently(
    `${t(ifIsUIv2('adsNote_v2', 'adsNote'))} ${ifIsUIv2(formatTime(remainingTime, { onlySeconds: true }), formattedTime)}`,
    formattedTime,
  )
  const trackTitle = compose(prop('title'), prop(trackIndex))(podcasts)
  const playerTitle = ifProp(isMemi && isPodcastPlayer,
    trackTitle,
    ifIsLoading(
      t('loading'),
      t(ifIsPlay('playing', 'shortTitle')),
    ))
  const statusMessage = ifIsAdsPresenting(
    ifIsAdsCurrently('', `${playerTitle} ${splitAdsLink}`),
    playerTitle,
  )
  const speedRate = ifIsUIv2(playbackRate, memSpeedRate(playbackRate))
  const rootStyle = memRootStyle({
    publisherColor: getPublisherColor(appState),
    publisherBgColor: getPublisherBgColor(appState),
    isReady,
    useUIv2,
    useDarkModeScheme,
  })

  const props = {
    t,
    isAmp,
    rootStyle,
    isPlay,
    isAdsCurrently,
    isAdPresenting,
    speedRate,
    adLink,
    adAltTitle,
    statusMessage,
    adTitle,
    duration,
    formattedDuration,
    progressState,
    hideSpktLink,
    customControls,
    publisher,
    publisherLogo,
    trackTitle,
    eqPublisher,
    isJfm,
    useDarkModeScheme,
  }

  if (useUIv2) {
    return ifProp(isSanofi, merge(props, {
      currentTime,
    }), props)
  }

  return merge(props, { hideFeedback })
}

const mapDispatchToProps = mapDispatchToPropsFactory({
  play,
  pause,
  setCurrentTime,
  setSpeedRate,
  adLinkClick,
  rewindSeekSafe,
  forwardSeekSafe,
  setCurrentTimeSafe,
})

export default connect(mapStateToProps, mapDispatchToProps)
