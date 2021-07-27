<script context="module">
  import { onMount } from 'svelte'
  import {
    noop, roundFloat, isFunction, not, optimizedResize,
  } from '@speechkit/speechkit-audio-player-core/utils'
  import Podcast from './podcast.svelte'
</script>

<script>
  export let t
  export let podcasts
  export let isPlay
  export let trackIndex
  export let formatDate
  export let formattedDuration
  export let hideMinutes
  export let visibleItems
  export let withoutScroll
  export let publisherBgColor
  export let onClickElement = noop

  let refWrapBox = null
  let refBox = null
  let prevVisibleItems

  const updaterPodcastsList = () => {
    if (withoutScroll) return
    const height = refBox.offsetHeight
    const newHeight = roundFloat((height / podcasts.length) * visibleItems)
    refWrapBox.style.maxHeight = `${newHeight}px`
    refWrapBox.style.overflow = 'auto'
  }

  onMount(() => {
    updaterPodcastsList()
    optimizedResize.add(updaterPodcastsList)
  })

  $: {
    if (not(withoutScroll) && refWrapBox && refBox && refBox.children) {
      const { offsetTop, offsetHeight } = refBox.children[trackIndex] || {}
      const position = offsetTop - (refWrapBox.offsetTop + offsetHeight)
      isFunction(refWrapBox.scrollTo)
        ? refWrapBox.scrollTo(0, position)
        : refWrapBox.scrollTop = position
      if (prevVisibleItems !== visibleItems) {
        updaterPodcastsList()
      }
    }
    prevVisibleItems = visibleItems
  }
</script>

<style>
  .sk-app-playlist-box__items {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--sk-playlist-items-bg-color);
    scroll-behavior: smooth;
  }

  .sk-app-playlist-items {
    display: grid;
    display: -ms-grid;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: 1fr;
    grid-column-gap: 0;
    grid-row-gap: 0;
    -ms-grid-columns: 1fr;
  }
</style>

<div
  class="sk-app-playlist-box__items"
  bind:this={refWrapBox}
>
  <ul
    class="sk-app-playlist-items"
    bind:this={refBox}
  >
    {#each podcasts as podcast, index}
      <Podcast
        item={podcast}
        isPlay={isPlay && index === trackIndex}
        isCurrentTrack={index === trackIndex}
        onClickElement={onClickElement(index)}
        {formatDate}
        {formattedDuration}
        {hideMinutes}
        {publisherBgColor}
        {index}
        {t}
      />
    {/each}
  </ul>
</div>
