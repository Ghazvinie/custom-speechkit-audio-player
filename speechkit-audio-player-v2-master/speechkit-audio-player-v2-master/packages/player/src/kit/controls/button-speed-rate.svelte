<script context="module">
  import { trim } from '@speechkit/speechkit-audio-player-core/utils'
  import Button from '../controls/button.svelte'
</script>

<script>
  export let publisherColor
  export let speedRate

  $: formattedSpeedRate = `${speedRate}X`
  $: btnSpeedRateStyle = trim`
    color: ${publisherColor};
  `
</script>

<style>
  :global(.sk-btn-speed-rate) {
    font-size: var(--sk-font-size-msg) !important;
    line-height: 2em;
    text-indent: 0em !important;
    min-width: 60px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  :global(.sk-btn-speed-rate > span) {
    transition: transform 0.2s;
    will-change: transform;
    transform: scale(1);
  }

  :global(.sk-btn-speed-rate:hover > span),
  :global(.sk-btn-speed-rate:focus > span) {
    transform: scale(1.15);
  }
</style>

<Button
  on:click
  name='speedRateBtn'
  title='speedRate'
  class='sk-btn-speed-rate'
  style={btnSpeedRateStyle}
>
  <span>{formattedSpeedRate}</span>
</Button>
