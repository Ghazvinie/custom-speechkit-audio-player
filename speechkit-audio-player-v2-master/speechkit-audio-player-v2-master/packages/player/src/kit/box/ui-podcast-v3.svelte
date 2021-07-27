<script context="module">
  import { onMount } from 'svelte'
  import {
    ifProp, prop, curry, formatTime, optimizedResize,
  } from '@speechkit/speechkit-audio-player-core/utils'
  import postCurrentHeight from '@speechkit/speechkit-audio-player-core/shared/iframeCommunication'
  import { replay10 as iconReplay10 } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/replay10'
  import { forward10 as iconForward10 } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/forward10'
  import { playV2 as iconPlay } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/playV2'
  import { pauseV2 as iconPause } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/pauseV2'

  import Slider from '../controls/slider.svelte'
  import Poster from '../controls/poster.svelte'
  import Icon from '../controls/icon.svelte'
  import Button from '../controls/button.svelte'
  import ButtonSpeedRate from '../controls/button-speed-rate.svelte'
  import { speedRateVariants, spktURL } from '../../constants/player'
</script>

<script>
  export let actions
  export let currentTime
  export let duration
  export let progressState
  export let rootStyle
  export let publisherColor
  export let isAmp
  export let isPlay
  export let isAdsCurrently
  export let speedRate
  export let publisher
  export let publisherLogo
  export let trackTitle

  let refRootEl = null

  const handleClickSlider = evt => {
    actions.setCurrentTimeSafe(evt.detail.position * duration)
  }
  const handlePlayButton = () => {
    ifIsPlay(actions.pause, actions.play)()
  }
  const handleControlButtonClick = curry((action, evt) => {
    action()
  })
  const handleSpeedRateButton = () => {
    if (isAdsCurrently) return
    const currentIdx = speedRateVariants.findIndex(item => item === speedRate)
    const nextSpeedRate = currentIdx === (speedRateVariants.length - 1)
      ? speedRateVariants[0]
      : speedRateVariants[currentIdx + 1]
    actions.setSpeedRate(nextSpeedRate)
  }

  const handleResize = () => {
    refRootEl.style.minHeight = `${window.innerHeight}px`
  }

  onMount(() => {
    optimizedResize.add(handleResize)
    handleResize()

    postCurrentHeight(isAmp)

    return () => {
      optimizedResize.deleteAll()
    }
  })

  $: ifIsPlay = ifProp(isPlay)
  $: iconPlayback = ifIsPlay(iconPause, iconPlay)
  $: controlIcons = [iconReplay10, iconPlayback, iconForward10]
  $: controlActions = [actions.rewindSeekSafe, handlePlayButton, actions.forwardSeekSafe]
  $: currentTimeFrm = formatTime(currentTime, { withAdditionalZero: true })
  $: durationFrm = formatTime(duration, { withAdditionalZero: true })
  $: podcastTitle = publisher
</script>

<style>
  :global(:root) {
    --sk-box-podcast-height: 120px;
    --sk-slider-progress-height: 12px;
  }

  :global(body) {
    margin: 0!important;
  }

  .sk-app-podcast {
    display: flex;
    position: relative;
    min-height: 100vh;
    padding: 0 12px;
    font-size: 16px;
    font-family: var(--sk-root-font-family)!important;
    justify-content: center;
    align-items: center;
  }

  .sk-copyright-wrap {
    position: absolute;
    bottom: 12px;
    font-size: 16px;
    line-height: 1.75;
    color: var(--sk-color_silver);
  }

  .sk-copyright-wrap > a,
  .sk-copyright-wrap > a:visited,
  .sk-copyright-wrap > a:hover,
  .sk-copyright-wrap > a:focus {
    font-size: 1em!important;
    text-decoration: underline!important;
    color: currentColor!important;
  }

  .sk-grid {
    display: flex;
    width: 100%;
    max-width: 48.75em;
    flex-direction: column;
    justify-content: flex-start;
  }

  .sk-cell {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-grow: 0;
    align-items: center;
  }

  .sk-cell:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .sk-podcast-title,
  .sk-podcast__article-title {
    font-size: 1.33em;
    line-height: 1.5;
    text-align: center;
    color: var(--sk-text-color);
  }

  .sk-podcast-title {
    font-weight: bold;
    font-size: 2.5em;
    line-height: 1.2;
  }

  .sk-podcast-progressbar {
    display: flex;
    height: 1.75em;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .sk-podcast-progressbar__time {
    flex-grow: 1;
    text-align: center;
    font-size: 1em;
    color: var(--sk-color_silver);
  }

  .sk-podcast-progressbar__wrap-slider {
    width: 69.23%;
    height: 0.75em;
    flex-grow: 0;
  }

  .sk-podcast-control {
    margin-bottom: 0!important;
  }

  :global(.sk-app-podcast .sk-poster__podcast) {
    width: 7.5em!important;
    height: 7.5em!important;
  }

  :global(.sk-podcast-control__item) {
    width: 11.25em!important;
    height: 11.25em!important;
    align-items: center;
    justify-content: center;
  }

  :global(.sk-podcast-control__item > svg) {
    width: 6em!important;
    height: 6em!important;
  }

  :global(.sk-podcast-control__item:nth-child(2) > svg) {
    width: 6em!important;
    height: 6em!important;
  }

  :global(.sk-app-podcast .sk-btn-speed-rate) {
    width: 90px!important;
    height: 90px!important;
    font-size: 2em!important;
    font-weight: bold!important;
  }

  :global(.sk-app-podcast .sk-btn-speed-rate > span) {
    transform: scale(1)!important;
  }

  @media only screen and (max-device-width: 769px) {
    :global(:root) {
      --sk-slider-progress-height: 6px;
    }

    :global(.sk-app-podcast .sk-poster__podcast) {
      width: 3.75em!important;
      height: 3.75em!important;
    }

    .sk-copyright-wrap {
      font-size: 0.75em;
    }

    .sk-cell:not(:last-child) {
      margin-bottom: 0.75rem;
    }

    .sk-podcast-title {
      font-size: 1.5em;
      line-height: 2.67;
    }

    .sk-podcast__article-title {
      font-size: 1em;
    }

    .sk-podcast-progressbar {
      height: 0.75em;
    }

    .sk-podcast-progressbar__time {
      font-size: 0.75em;
    }

    .sk-podcast-progressbar__time:first-child {
      margin-left: -12px;
    }

    .sk-podcast-progressbar__time:last-child {
      margin-right: -12px;
    }

    .sk-podcast-progressbar__wrap-slider {
      width: 71.45%;
      height: 0.375em;
    }

    :global(.sk-podcast-control__item) {
      width: 5.625em!important;
      height: 5.625em!important;
    }

    :global(.sk-podcast-control__item > svg) {
      width: 2.5em!important;
      height: 2.5em!important;
    }

    :global(.sk-podcast-control__item:nth-child(2) > svg) {
      width: 3em!important;
      height: 3em!important;
    }

    :global(.sk-app-podcast .sk-btn-speed-rate) {
      width: 90px!important;
      height: 45px!important;
      font-size: 1em!important;
      font-weight: bold!important;
    }
  }
</style>

<div
  bind:this={refRootEl}
  class="sk-app-container sk-app-podcast"
  style={rootStyle}
>
  <div class="sk-grid">
    <div class="sk-cell">
      <Poster
        url={publisherLogo}
        class="sk-poster__podcast"
      />
    </div>
    <div class="sk-cell sk-podcast-title">
      {podcastTitle}
    </div>
    <div class="sk-cell sk-podcast__article-title">
      {trackTitle}
    </div>
    <div class="sk-cell sk-podcast-progressbar">
      <div class="sk-podcast-progressbar__time">
        {currentTimeFrm}
      </div>
      <div class="sk-podcast-progressbar__wrap-slider">
        <Slider
          on:click={handleClickSlider}
          playerState={progressState}
        />
      </div>
      <div class="sk-podcast-progressbar__time">
        {durationFrm}
      </div>
    </div>
    <div class="sk-cell sk-podcast-control">
      {#each controlIcons as controlIcon, index}
        <Button
          class="sk-podcast-control__item"
          on:click={handleControlButtonClick(prop(index, controlActions))}
        >
          <Icon iconProps={controlIcon} />
        </Button>
      {/each}
    </div>
    <div class="sk-cell">
      <ButtonSpeedRate
        on:click={handleSpeedRateButton}
        {publisherColor}
        {speedRate}
      />
    </div>
  </div>
  <div class="sk-copyright-wrap">
    Powered by <a href={spktURL} target="_blank" rel="noreferrer">SpeechKit</a>
  </div>
</div>
