import { connect } from 'svelte-redux-connect'
import memoizeOne from 'memoize-one'
import {
  trim,
  formatTime,
  ifProp,
  roundFloat,
  formatDate,
} from '@speechkit/speechkit-audio-player-core/utils'
import translate from '@speechkit/speechkit-audio-player-core/shared/translate'
import { adLinkClick } from '../../actions/ads'
import { mapDispatchToPropsFactory } from '../../actions/helpers'
import {
  setCurrentTimeSafe,
  forwardSeekSafe,
  rewindSeekSafe,
} from '../../actions/app'
import {
  play, pause, setSpeedRate,
  skipPrevTrack, skipNextTrack,
  setTrackIndex,
} from '../../actions/playback'
import {
  getApp,
  getPlayback,
  getProgressState,
  getAdInfo,
} from '../../selectors'
import {
  getPublisherColor,
  getPublisherBgColor,
  makeColorVar,
} from './helpers'

const memRootStyle = memoizeOne(({
  publisherColor, isReady, useDarkModeScheme,
}) => {
  const ifUseDarkModeScheme = ifProp(useDarkModeScheme)

  return trim`
    color: ${publisherColor};
    ${ifProp(isReady, '', 'display: none;')}
    --sk-text-color: var(${ifUseDarkModeScheme(makeColorVar('white'), makeColorVar('black'))});
    ${ifUseDarkModeScheme(`--sk-link-color: var(${makeColorVar('white')});`, '')}
    ${ifUseDarkModeScheme(`--sk-link-color--hover: var(${makeColorVar('white')});`, '')}
    ${ifUseDarkModeScheme('--sk-playlist-items-bg-color: transparent;', '')}
  `
})

const mapStateToProps = state => {
  const appState = getApp(state)
  const {
    language, isAdsCurrently, useDarkModeScheme,
    hideSpktLink, isReady, isAmp,
    podcasts, trackIndex, publisher, hideMinutes, isJfm,
    publisherLogo, visibleItems, withoutScroll,
  } = appState
  const { isPlay, playbackRate } = getPlayback(state)
  const progressState = getProgressState(state)
  const {
    isPresenting: isAdPresenting,
  } = getAdInfo(state)
  const { duration, currentTime } = progressState
  const t = translate(language)
  const remainingTime = roundFloat(currentTime < duration ? duration - currentTime : 0)
  const formattedTime = `${formatTime(currentTime)} / ${formatTime(duration)}`
  const ifIsAdsCurrently = ifProp(isAdsCurrently && isAdPresenting)
  const formattedDuration = ifIsAdsCurrently(
    `${t('adsNote_v2')} ${formatTime(remainingTime, { onlySeconds: true })}`,
    formattedTime,
  )
  const speedRate = playbackRate
  const formatDateWithLang = date => formatDate(date, language)
  const publisherColor = getPublisherColor(appState)
  const publisherBgColor = getPublisherBgColor(appState)
  const rootStyle = memRootStyle({
    isReady, publisherColor, useDarkModeScheme,
  })

  return {
    t,
    isAmp,
    rootStyle,
    isPlay,
    isAdsCurrently,
    speedRate,
    duration,
    formattedDuration,
    progressState,
    hideSpktLink,
    hideMinutes,
    podcasts,
    trackIndex,
    publisherColor,
    publisherBgColor,
    publisher,
    formatDate: formatDateWithLang,
    publisherLogo,
    isJfm,
    visibleItems,
    withoutScroll,
  }
}

const mapDispatchToProps = mapDispatchToPropsFactory({
  play,
  pause,
  setTrackIndex,
  setCurrentTimeSafe,
  setSpeedRate,
  adLinkClick,
  skipPrevTrack,
  skipNextTrack,
  rewindSeekSafe,
  forwardSeekSafe,
})

export default connect(mapStateToProps, mapDispatchToProps)
