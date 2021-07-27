<script context="module">
  import { onMount } from 'svelte'
  import memoizeOne from 'memoize-one'
  import { keys, propOr, ifProp } from '@speechkit/speechkit-audio-player-core/utils'
  import postCurrentHeight from '@speechkit/speechkit-audio-player-core/shared/iframeCommunication'
  import { speedRate as iconSpeedRate } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/speedRate'
  import { pause as iconPause } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/pause'
  import { play as iconPlay } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/play'

  import Button from '../controls/button.svelte'
  import Icon from '../controls/icon.svelte'
  import Status from '../controls/status.svelte'
  import Slider from '../controls/slider.svelte'
  import Link from '../controls/link.svelte'
  import mouseHoverable from '../uses/mouseHoverable'
  import { spktURL } from '../../constants/player'
</script>

<script>
  export let t
  export let isAmp
  export let rootStyle
  export let isPlay
  export let isAdsCurrently
  export let speedRate
  export let adLink
  export let statusMessage
  export let adTitle
  export let adAltTitle
  export let isAdPresenting
  export let duration
  export let formattedDuration
  export let progressState
  export let actions
  export let hideFeedback
  export let hideSpktLink
  export let customControls

  let isMouseEnter = false
  const getIconPlay = memoizeOne(propOr(iconPlay, 'iconPlay'))
  const getIconPause = memoizeOne(propOr(iconPause, 'iconPause'))
  const speedRateVariants = keys(iconSpeedRate)
  const handlePlayButton = () => {
    if (!isPlay) {
      actions.play()
    } else {
      actions.pause()
    }
  }
  const handleSpeedRateButton = () => {
    if (isAdsCurrently) return
    const currentIdx = speedRateVariants.findIndex(item => item === speedRate)
    const nextSpeedRate = currentIdx === (speedRateVariants.length - 1)
        ? speedRateVariants[0]
        : speedRateVariants[currentIdx + 1]
    actions.setSpeedRate(nextSpeedRate.replace('x', '').replace('_', '.'))
  }
  const handleHover = ({ detail }) => {
    isMouseEnter = detail.isMouseEnter
  }
  const handleClickSlider = evt => {
    if (isAdsCurrently) return
    actions.setCurrentTime(evt.detail.position * duration)
  }
  onMount(() => {
    postCurrentHeight(isAmp)
  })
  $: iconPlayback = ifProp(isPlay, getIconPause(customControls), getIconPlay(customControls))
</script>

<style>
  :global(:root) {
    --sk-color_martinique: #32325d;
    --sk-color_gallery: #ebebeb;
    --sk-box-height: 40px;
    --sk-font-size-link: 8px;
    --sk-font-size-msg: 11px;
    --sk-link-color--hover: var(--sk-color_martinique);
    --sk-slider-progress-color: var(--sk-color_gallery);
    --sk-slider-progress-radius: 3px;
    --sk-slider-progress-height: 6px;
  }

  .sk-app-container {
    display: flex;
    width: 100%;
    height: var(--sk-box-height);
    box-sizing: border-box;
    font-family: var(--sk-root-font-family);
    line-height: 1;
  }

  .sk-app-progress-bar {
    display: flex;
    width: calc(100% - 48px);
    box-sizing: border-box;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    margin-left: 8px;
  }

  .sk-cell {
    display: flex;
    width: 100%;
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

  .with-ad-link {
    display: inline-flex;
    flex-basis: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .with-ad-link :global(.sk-app-link) {
    font-size: var(--sk-font-size-msg);
    color: var(--sk-text-color);
  }

  :global(.sk-play-button) {
    width: var(--sk-box-height)!important;
    height: var(--sk-box-height)!important;
    min-width: var(--sk-box-height);
  }
</style>

<div
  use:mouseHoverable
  on:hover={handleHover}
  class="sk-app-container sk-mod-showing"
  class:hover={isMouseEnter}
  style={rootStyle}
>
  <Button
    on:click={handlePlayButton}
    name='playBtn'
    title='play'
    class="sk-play-button"
  >
    <Icon iconProps={iconPlayback} />
  </Button>
  <div class=sk-app-progress-bar>
    <div class=sk-cell>
      <div class=with-ad-link>
        <Status message={statusMessage} />
        {#if isAdPresenting}
          <Link
            on:click={actions.adLinkClick}
            href={adLink}
            title={adAltTitle || adTitle || adLink}
            style="margin-left: 4px;"
          >{`${t('advertiserNote')} ${adTitle || adLink}`}</Link>
        {/if}
      </div>
      <div class=sk-child-el>
        {#if !hideFeedback}
          <Link href="https://spkt.io/rate/basic">{t('feedback')}</Link>
        {/if}
        <Button
          on:click={handleSpeedRateButton}
          name='speedRateBtn'
          title='speedRate'
          style='width: 20px; height: 12px; margin-left: 5px;'
        >
          <Icon iconProps={iconSpeedRate[speedRate]} />
        </Button>
      </div>
    </div>
    <div class="sk-cell sk-progress-bar">
      <Slider on:click={handleClickSlider} playerState={progressState} />
    </div>
    <div class="sk-cell sk-progress-bar">
      <Status message={formattedDuration} />
      {#if !hideSpktLink}
        <Link href={spktURL} class="sk-child-el">{t('copyright')}</Link>
      {/if}
    </div>
  </div>
</div>
