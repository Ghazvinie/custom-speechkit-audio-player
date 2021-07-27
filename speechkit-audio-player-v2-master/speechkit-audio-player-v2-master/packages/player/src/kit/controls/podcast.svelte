<script context="module">
  import {
    noop, path, trim, ifProp,
  } from '@speechkit/speechkit-audio-player-core/utils'
  import mouseHoverable from '../uses/mouseHoverable'
</script>

<script>
  export let t
  export let index
  export let item
  export let isPlay
  export let isCurrentTrack
  export let formatDate
  export let formattedDuration
  export let hideMinutes
  export let publisherBgColor
  export let onClickElement = noop

  let isMouseEnter = false
  const handleHover = ({ detail }) => {
    isMouseEnter = detail.isMouseEnter
  }

  $: ifPlay = ifProp(isPlay)
  $: ifCurrentTrack = ifProp(isCurrentTrack)
  $: durationInMin = ` • ${Math.ceil(path(['media', 0, 'duration'], item) / 60)} ${t('minutes')}`
  $: formattedDate = ifPlay(formattedDuration, `${formatDate(item.published_at)}${ifProp(hideMinutes, '', durationInMin)}`)
  $: bgColorItem = trim`
    background-color: ${publisherBgColor};
    color: currentColor;
  `
  $: itemStyle = trim`
    -ms-grid-row: ${index + 1};
    ${ifCurrentTrack(bgColorItem, `color: var(--sk-text-color);`)}
    ${ifProp(isMouseEnter && !isCurrentTrack, bgColorItem, '')}
  `
</script>

<style>
  .sk-playlist-item__container {
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 60px;
    cursor: pointer;
    transition: all 0.2s;
    -ms-grid-column: 1;
  }

  .sk-playlist-item__info {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0 8px;
    box-sizing: border-box;
  }

  .sk-playlist-item__title {
    display: flex;
    padding: 0;
    flex-grow: 1;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
  }

  .sk-playlist-item__duration {
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    line-height: 1.667;
    color: var(--sk-color_silver);
  }

  @media only screen and (max-device-width: 769px) {
    .sk-playlist-item__container {
      min-height: 80px;
    }

    .sk-playlist-item__info {
      padding: 0 0.5em;
    }
  }
</style>

<li
  use:mouseHoverable
  on:click={onClickElement}
  on:hover={handleHover}
  class="sk-playlist-item__container"
  style={itemStyle}
>
  <div class="sk-playlist-item__info">
    <div class="sk-playlist-item__title">
      {item.title}
    </div>
    <div class="sk-playlist-item__duration">
      {formattedDate}
    </div>
  </div>
</li>
