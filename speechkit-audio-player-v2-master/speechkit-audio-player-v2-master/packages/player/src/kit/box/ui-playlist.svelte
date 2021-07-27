<script context="module">
  import { onMount } from 'svelte'
  import {
    compose, curry, ifProp, isString, eq, not,
    prop, trim, insertItem, optimizedResize,
  } from '@speechkit/speechkit-audio-player-core/utils'
  import postCurrentHeight from '@speechkit/speechkit-audio-player-core/shared/iframeCommunication'
  import { playV2 as iconPlay } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/playV2'
  import { pauseV2 as iconPause } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/pauseV2'
  import { replay10 as iconReplay10 } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/replay10'
  import { forward10 as iconForward10 } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/forward10'
  import { skipNextTrack as iconSkipNextTrack } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/skipNextTrack'

  import Poster from '../controls/poster.svelte'
  import Status from '../controls/status.svelte'
  import Icon from '../controls/icon.svelte'
  import Podcasts from '../controls/podcasts.svelte'
  import Button from '../controls/button.svelte'
  import ButtonSpeedRate from '../controls/button-speed-rate.svelte'
  import Slider from '../controls/slider.svelte'
  import CopyrightLink from '../controls/link-copyright.svelte'
  import mouseHoverable from '../uses/mouseHoverable'
  import { speedRateVariants } from '../../constants/player'

  const centerContentStyle = trim`justify-content: center;`
  const posterStyle = trim`margin-right: 5px;`
  const posterStyleDesktop = trim`${posterStyle}width: 120px;height: 120px;`
  const podcastTitleJfmStyle = trim`font-size: 12px;`
  const defaultControlIcons = [iconReplay10, iconForward10, iconSkipNextTrack]
  const actionPlayButton = 'actPlayButton'
</script>

<script>
  export let t
  export let isAmp
  export let isPlay
  export let actions
  export let rootStyle
  export let podcasts
  export let publisher
  export let isAdsCurrently
  export let duration
  export let progressState
  export let trackIndex
  export let formatDate
  export let speedRate
  export let formattedDuration
  export let publisherColor
  export let publisherBgColor
  export let hideSpktLink
  export let hideMinutes
  export let publisherLogo
  export let isJfm
  export let visibleItems
  export let withoutScroll

  let isMouseEnter = false
  const defaultControlActions = [actions.rewindSeekSafe, actions.forwardSeekSafe, actions.skipNextTrack]
  const ifPropIsJfm = ifProp(isJfm)
  const handleHover = ({ detail }) => {
    isMouseEnter = detail.isMouseEnter
  }

  const handlePlayButton = curry((index, evt) => {
    if (not(eq(trackIndex, index))) {
      actions.setTrackIndex(index)
      return
    }

    ifIsPlay(actions.pause, actions.play)()
  })

  const handleControlButtonClick = curry((action, evt) => {
    if (eq(action, actionPlayButton)) {
      handlePlayButton(trackIndex, evt)
      return
    }

    action()
  })

  const handleClickSlider = evt => {
    actions.setCurrentTimeSafe(evt.detail.position * duration)
  }

  const handleSpeedRateButton = () => {
    if (isAdsCurrently) return
    const currentIdx = speedRateVariants.findIndex(item => eq(item, speedRate))
    const nextSpeedRateIndex = ifProp(eq(currentIdx, speedRateVariants.length - 1), 0, currentIdx + 1)
    actions.setSpeedRate(speedRateVariants[nextSpeedRateIndex])
  }

  const handleWindowResize = () => {
    postCurrentHeight(isAmp)
  }

  onMount(() => {
    handleWindowResize()
    optimizedResize.add(handleWindowResize)

    return () => {
      optimizedResize.deleteAll()
    }
  })

  $: ifIsPlay = ifProp(isPlay)
  $: posterUrl = ifProp(isString(publisherLogo), publisherLogo, null)
  $: hasPoster = Boolean(posterUrl)
  $: controlIcons = defaultControlIcons
  $: controlIconsForMobile = insertItem(iconPlayback, 1, defaultControlIcons)
  $: controlActions = defaultControlActions
  $: controlActionsForMobile = insertItem(actionPlayButton, 1, defaultControlActions)
  $: iconPlayback = ifIsPlay(iconPause, iconPlay)
  $: podcastTitle = ifPropIsJfm(compose(prop('title'), prop(trackIndex))(podcasts), publisher)
  $: podcastTitleStyle = ifPropIsJfm(podcastTitleJfmStyle, '')
  $: statusStyle = trim`
    color: currentColor;
    white-space: nowrap;
    ${ifPropIsJfm('display: none;', '')}
  `
  $: playlistHeaderStyle = trim`
    background-color: ${publisherBgColor};
  `
  $: podcastProps = {
    t,
    onClickElement: handlePlayButton,
    podcasts,
    isPlay,
    trackIndex,
    formatDate,
    formattedDuration,
    hideMinutes,
    visibleItems,
    withoutScroll,
    publisherBgColor,
  }
</script>

<style>
  :global(:root) {
    --sk-box-height: 60px;
    --sk-button-play-height: 60px;
    --sk-button-play-margin: 0;
    --sk-button-play-padding: 0;
    --sk-font-size-link: 10px;
    --sk-font-size-msg: 12px;
    --sk-slider-progress-height: 4px;
    --sk-playlist-header-height: 120px;
    --sk-playlist-items-bg-color: var(--sk-color_white);
  }

  :global(.sk-button-reset > svg) {
    transition: transform 0.2s;
    will-change: transform;
    transform: scale(1);
  }

  :global(.sk-button-reset:hover > svg),
  :global(.sk-button-reset:focus > svg) {
    transform: scale(1.2);
  }

  .sk-app-container {
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: column;
    box-sizing: border-box;
    font-family: var(--sk-root-font-family);
    line-height: 1em;
    background-color: var(--sk-playlist-items-bg-color);
  }

  .sk-app-playlist-header {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    min-height: var(--sk-playlist-header-height);
    box-sizing: content-box;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: var(--sk-color_silver);
  }

  .sk-app-playlist-header.sk-app-playlist-header__mobile {
    display: none;
  }

  .sk-app-playlist-header__cell {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50%;
    box-sizing: content-box;
    flex-grow: 0;
  }

  .sk-app-playlist-header__cell:first-child {
    flex-grow: 1;
  }

  .sk-app-playlist-header__row {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  :global(.sk-play-button) {
    align-items: center;
    justify-content: center;
    width: var(--sk-button-play-height)!important;
    height: 100%!important;
    min-height: var(--sk-button-play-height)!important;
    min-width: var(--sk-button-play-height)!important;
    margin: 0!important;
    padding: 0!important;
  }

  :global(.sk-play-button > svg) {
    width: 32px!important;
    height: 32px!important;
  }

  .sk-app-playlist-header__slider {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-self: flex-end;
  }

  .sk-progress-duration {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    height: 28px;
    color: var(--sk-slider-progress-color);
  }

  .sk-progress-duration > div {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .sk-progress-duration > div:last-child {
    flex-grow: 1;
    justify-content: space-between;
  }

  .sk-mod-showing :global(.sk-child-el) {
    display: flex;
    opacity: 0;
    transition: opacity .2s ease;
  }

  .sk-mod-showing.hover :global(.sk-child-el) {
    opacity: 1;
  }

  .sk-app-playlist-header__mid {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .sk-app-playlist-header__podcast-title {
    display: flex;
    padding: 0.1em 8px;
    font-size: 24px;
    font-weight: bold;
    line-height: 1.05;
    height: 100%;
    align-items: center;
    text-align: left;
    overflow: hidden;
  }

  .sk-app-playlist-header__controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 6px;
  }

  :global(.sk-app-playlist-header__control-item) {
    align-items: center;
    justify-content: center;
    width: 60px!important;
    height: 60px!important;
  }

  :global(.sk-app-playlist-header__control-item svg) {
    width: 32px!important;
    height: 32px!important;
  }

  .sk-copyright-box {
    display: none;
    justify-content: center;
    align-items: center;
    height: 30px;
  }

  :global(.sk-copyright-box .sk-copyright-link span) {
    line-height: 1.5em;
    margin-left: 0;
    margin-right: 8px;
  }

  @media only screen and (max-device-width: 769px) {
    .sk-copyright-box {
      display: flex;
    }

    .sk-app-playlist-header {
      display: none;
    }

    .sk-app-playlist-header.sk-app-playlist-header__mobile {
      display: flex;
    }
  }
</style>

<div
  use:mouseHoverable
  on:hover={handleHover}
  class="sk-app-container sk-mod-showing"
  class:hover={isMouseEnter}
  style={rootStyle}
>
  <div class="sk-app-playlist-header sk-app-playlist-header__mobile"
    style={playlistHeaderStyle}
  >
    <div
      class="sk-app-playlist-header__cell"
      style={`flex-grow:1;${centerContentStyle}`}
    >
      <Poster url={posterUrl} style={posterStyle} />
      <div class="sk-app-playlist-header__mid">
        <div
          class="sk-app-playlist-header__podcast-title"
          style={podcastTitleStyle}
        >
          {podcastTitle}
        </div>
      </div>
    </div>
    <div
      class="sk-app-playlist-header__cell"
      style={centerContentStyle}
    >
      <ButtonSpeedRate
        on:click={handleSpeedRateButton}
        {publisherColor}
        {speedRate}
      />
      {#each controlIconsForMobile as controlIcon, index}
        <Button
          class={ifProp(index === 1, 'sk-play-button', 'sk-app-playlist-header__control-item')}
          on:click={handleControlButtonClick(prop(index, controlActionsForMobile))}
        >
          <Icon iconProps={controlIcon} />
        </Button>
      {/each}
    </div>
  </div>
  <div
    class="sk-app-playlist-header"
    style={playlistHeaderStyle}
  >
    <div class="sk-app-playlist-header__cell">
      <Poster url={posterUrl} style={posterStyleDesktop} />
      <div class="sk-app-playlist-header__row">
        <div class="sk-app-playlist-header__cell">
          <div class="sk-app-playlist-header__mid">
            <div
              class="sk-app-playlist-header__podcast-title"
              style={podcastTitleStyle}
            >{podcastTitle}</div>
          </div>
        </div>
        <div class="sk-app-playlist-header__cell">
          <Button
              on:click={handlePlayButton(trackIndex)}
              name="playBtn"
              title="play"
              class="sk-play-button"
          >
            <Icon iconProps={iconPlayback} />
          </Button>
          <div class="sk-app-playlist-header__slider">
            <Slider
                on:click={handleClickSlider}
                playerState={progressState}
            />
            <div class="sk-progress-duration">
              <div>
                <Status
                    message={formattedDuration}
                    style={statusStyle}
                />
              </div>
              <div>
                <ButtonSpeedRate
                    on:click={handleSpeedRateButton}
                    {publisherColor}
                    {speedRate}
                />
                {#if !hideSpktLink}
                  <CopyrightLink class="sk-child-el" t={t} />
                {/if}
              </div>
            </div>
          </div>
          <div class="sk-app-playlist-header__controls">
            {#each controlIcons as controlIcon, index}
              <Button
                  class="sk-app-playlist-header__control-item"
                  on:click={handleControlButtonClick(prop(index, controlActions))}
              >
                <Icon iconProps={controlIcon} />
              </Button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
  <Podcasts {...podcastProps} />
  <div class="sk-copyright-box">
    {#if !hideSpktLink}
      <CopyrightLink t={t} />
    {/if}
  </div>
</div>
