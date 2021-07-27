<script context="module">
  import { omit, trim } from '@speechkit/speechkit-audio-player-core/utils'

  import UIv2 from './ui-v2.svelte'
  import Poster from '../controls/poster.svelte'
</script>

<script>
  export let rootStyle
  export let publisher
  export let publisherLogo
  export let trackTitle

  $: posterStyle = trim`
    margin-right: 8px;
  `
  $: posterImgStyle = trim`
    object-fit: cover;
  `
  $: otherProps = omit(['class'], $$props)
  $: hasLogo = !!publisherLogo
</script>

<style>
  :global(:root) {
    --sk-box-podcast-height: 120px!important;
    --sk-box-podcast-padding: 8px!important;
    --sk-poster-width: 104px!important;
  }

  .sk-app-container.sk-app-podcast {
    flex-direction: row;
    height: var(--sk-box-podcast-height);
    padding: var(--sk-box-podcast-padding);
    box-sizing: border-box;
  }

  .sk-player-wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  :global(.sk-app-podcast.withposter .sk-player-wrap) {
    width: calc(100% - var(--sk-poster-width) - var(--sk-box-podcast-padding));
  }

  .sk-podcast-info {
    display: flex;
    width: 100%;
    flex-direction: column;
    font-size: 12px;
    line-height: 2.167;
    color: var(--sk-text-color);
  }

  .sk-podcast-info .sk-podcast-info__title {
    font-weight: bold;
  }

  .sk-podcast-info__title,
  .sk-podcast-info__track-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  :global(.sk-app-podcast .sk-play-button) {
    width: 32px!important;
    min-width: 32px!important;
    min-height: 32px!important;
    margin: 0!important;
    margin-right: 8px!important;
  }

  :global(.sk-app-podcast .sk-app-container) {
    height: 52px!important;
  }

  :global(.sk-app-podcast .sk-app-progress-bar) {
    width: calc(100% - 40px)!important;
    margin-right: 0!important;
  }

  @media only screen and (max-device-width: 769px) {
    :global(:root) {
      --sk-poster-width: 52px!important;
    }

    :global(.sk-app-podcast.withposter .sk-app-container) {
      margin-left: -60px;
      width: calc(100% + 60px);
    }

    :global(.sk-app-podcast .sk-play-button) {
      width: 52px!important;
      min-width: 52px!important;
      min-height: 52px!important;
      margin-right: 8px!important;
    }
  }
</style>

<div
  class="sk-app-container sk-app-podcast"
  class:withposter={hasLogo}
  style={rootStyle}
>
  <Poster
    url={publisherLogo}
    style={posterStyle}
    imgStyle={posterImgStyle}
  />
  <div class="sk-player-wrap">
    <div class="sk-podcast-info">
      <div class="sk-podcast-info__title">{publisher}</div>
      <div class="sk-podcast-info__track-title">{trackTitle}</div>
    </div>
    <UIv2 {...otherProps} isSlim />
  </div>
</div>
