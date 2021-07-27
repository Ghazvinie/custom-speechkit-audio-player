  <script context="module">
  import memoizeOne from 'memoize-one'
  import {
    ifProp, propOr, notNil, not, trim, noop,
  } from '@speechkit/speechkit-audio-player-core/utils'
  import { PUBLISHERS } from '@speechkit/speechkit-audio-player-core/shared/constants/customisations'
  import { playV2 as iconPlay } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/playV2'
  import { pauseV2 as iconPause } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/pauseV2'
  import { skLogo as iconSkLogo } from '@speechkit/speechkit-audio-player-core/shared/customisations/controls/icons/types/skLogo'

  import RootBox from '../controls/root-box.svelte'
  import Button from '../controls/button.svelte'
  import Icon from '../controls/icon.svelte'
  import Status from '../controls/status.svelte'
  import Slider from '../controls/slider.svelte'
  import Link from '../controls/link.svelte'
  import { speedRateVariants, spktURL } from '../../constants/player'

  const durationStyled = trim`
    color: currentColor;
    white-space: nowrap;
  `
</script>

<script>
  export let t
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
  export let hideSpktLink
  export let customControls
  export let isSlim = false
  export let eqPublisher = noop

  const getIconPlay = memoizeOne(propOr(iconPlay, 'iconPlay'))
  const getIconPause = memoizeOne(propOr(iconPause, 'iconPause'))
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
    actions.setSpeedRate(nextSpeedRate)
  }
  const handleClickSlider = evt => {
    if (isAdsCurrently) return
    actions.setCurrentTime(evt.detail.position * duration)
  }
  $: iconPlayback = ifProp(isPlay, getIconPause(customControls), getIconPlay(customControls))
  $: formattedSpeedRate = `${speedRate}X`
  $: classPlayButton = `sk-play-button${ifProp(notNil(customControls), ' custom', '')}`
  $: progressDurationColor = `var(${ifProp(eqPublisher(PUBLISHERS.maisonModerne), '--sk-text-color', '--sk-slider-progress-color')})`
  $: progressDurationStyled = trim`
    color: ${progressDurationColor}!important;
  `
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
  }

  :global(.sk-app-container) {
    isolation: isolate;
    display: flex;
    width: 100%;
    height: var(--sk-box-height);
    box-sizing: border-box;
    font-family: var(--sk-root-font-family)!important;
    font-size: 16px!important;
    line-height: 1em;
  }

  :global(.sk-app-container *) {
    isolation: inherit;
  }

  .sk-app-progress-bar {
    display: flex;
    width: calc(100% - 85px);
    box-sizing: border-box;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    margin: 0 25px 0 0;
  }

  .sk-cell {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-grow: 1;
    align-items: center;
    height: calc(50% - (var(--sk-slider-progress-height) / 2));
  }

  .sk-cell.sk-progress-bar {
    flex-grow: 0;
    height: var(--sk-slider-progress-height);
  }

  .sk-progress-duration {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
  }

  .sk-progress-duration > div {
    display: inline-flex;
  }

  :global(.sk-mod-showing .sk-child-el) {
    display: flex;
    opacity: 0;
    transition: opacity .2s ease;
  }

  :global(.sk-mod-showing.hover .sk-child-el) {
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
    text-decoration: underline;
  }

  :global(.sk-copyright-link) {
    color: currentColor;
  }

  :global(.sk-copyright-link:hover) {
    color: var(--sk-text-color);
  }

  :global(.sk-copyright-link span) {
    line-height: 1.5em;
    margin-right: 8px;
  }

  :global(.sk-play-button) {
    align-items: center;
    justify-content: center;
    width: var(--sk-button-play-height)!important;
    height: 100%;
    min-height: var(--sk-button-play-height)!important;
    min-width: var(--sk-button-play-height)!important;
    margin: 0!important;
    padding: 0!important;
  }

  :global(.sk-play-button.custom > svg) {
    width: 40px!important;
    height: 40px!important;
  }

  :global(.sk-play-button:not(.custom) > svg) {
    width: 32px!important;
    height: 32px!important;
  }

  :global(.sk-btn-speed-rate__wrap) {
    flex-grow: 1;
  }

  :global(.sk-cell .sk-btn-speed-rate) {
    font-size: var(--sk-font-size-msg) !important;
    text-indent: 0em !important;
    width: 100%!important;
    max-width: 60px;
    align-items: center;
    flex-direction: column;
  }

  :global(.sk-cell .sk-btn-speed-rate:hover) {
    color: var(--sk-text-color)!important;
  }
</style>

<RootBox class="sk-app-container sk-mod-showing" {...$$props}>
  <Button
    on:click={handlePlayButton}
    name='playBtn'
    title='play'
    class={classPlayButton}
  >
    <Icon iconProps={iconPlayback} />
  </Button>
  <div class=sk-app-progress-bar>
    <div class=sk-cell>
      {#if not(isSlim)}
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
      {/if}
    </div>
    <div class="sk-cell sk-progress-bar">
      <Slider on:click={handleClickSlider} playerState={progressState} />
    </div>
    <div
      class="sk-cell"
      style={progressDurationStyled}
    >
      <div class="sk-progress-duration">
        <div>
          <Status
            message={formattedDuration}
            style={durationStyled}
          />
        </div>
        <div class='sk-btn-speed-rate__wrap'>
          <Button
            on:click={handleSpeedRateButton}
            name='speedRateBtn'
            title='speedRate'
            class='sk-btn-speed-rate'
          >{formattedSpeedRate}</Button>
        </div>
      </div>
      {#if !hideSpktLink}
        <Link href={spktURL} class="sk-child-el sk-copyright-link">
          <span>{t('speechkit')}</span>
          <Icon iconProps={iconSkLogo} />
        </Link>
      {/if}
    </div>
  </div>
</RootBox>
