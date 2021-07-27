<script context="module">
  import { onMount } from 'svelte'
  import postCurrentHeight from '@speechkit/speechkit-audio-player-core/shared/iframeCommunication'

  import mouseHoverable from '../uses/mouseHoverable'
</script>

<script>
  let isMouseEnter = false

  const handleHover = ({ detail }) => {
    isMouseEnter = detail.isMouseEnter
  }

  onMount(() => {
    postCurrentHeight($$props.isAmp)
  })
</script>

<div
  use:mouseHoverable
  on:hover={handleHover}
  class="sk-app-container sk-mod-showing"
  class:hover={isMouseEnter}
  style={$$props.rootStyle}
>
  <slot/>
</div>
