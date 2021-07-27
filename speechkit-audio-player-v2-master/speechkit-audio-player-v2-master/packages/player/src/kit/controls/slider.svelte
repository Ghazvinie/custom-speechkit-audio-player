<script context="module">
  import { createEventDispatcher } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { expoOut } from 'svelte/easing'
  import { trim, calcPercentage } from '@speechkit/speechkit-audio-player-core/utils'
</script>

<script>
  export let playerState = {
    currentTime: 0,
    duration: 0,
    buffered: 0,
  }
  const bufferProgress = tweened(playerState.buffered, { duration: 400, easing: expoOut })

  let root
  const dispatch = createEventDispatcher()
  const clickHandle = ({ offsetX }) => {
    if (!root) return
    const { width } = root.getBoundingClientRect()
    dispatch('click', { position: offsetX / width })
  }

  $: {
    bufferProgress.set(playerState.buffered)
  }
  $: playedBarStyle = trim`width: ${calcPercentage(playerState.currentTime, playerState.duration)}%;`
  $: progressBarStyle = trim`width: ${$bufferProgress}%;`
</script>

<div class=progress-bar-box on:click={clickHandle} bind:this={root}>
  <div class=buffered-bar style={progressBarStyle}></div>
  <div class=played-bar style={playedBarStyle}></div>
</div>

<style>
  .progress-bar-box {
    position: relative;
    width: 100%;
    background-color: var(--sk-slider-bg-color);
    cursor: pointer;
  }

  .buffered-bar {
    width: 0;
    background-color: var(--sk-slider-progress-color);
  }

  .played-bar {
    width: 0;
    margin-top: calc(-1 * var(--sk-slider-progress-height));
    background-color: currentColor;
  }

  .progress-bar-box,
  .buffered-bar,
  .played-bar {
    max-width: 100%;
    height: var(--sk-slider-progress-height);
    border-radius: var(--sk-slider-progress-radius);
  }
</style>
