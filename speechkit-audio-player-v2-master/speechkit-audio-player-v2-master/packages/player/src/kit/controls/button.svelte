<script context="module">
  import { omit } from '@speechkit/speechkit-audio-player-core/utils'
</script>

<script>
  export let title = ''
  export let style = ''
  export let name = ''

  $: otherProps = { style, title, name }
  $: btnClass = `sk-button-reset ${$$props.class || ''}`.trim()
</script>

<style>
  button.sk-button-reset {
    display: flex;
    width: auto;
    height: auto;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: transparent;
    color: currentColor!important;
    border: none!important;
    border-radius: 0!important;
    box-shadow: none!important;
    cursor: pointer!important;
    outline: none!important;
    text-indent: -999em;
    line-height: 1em;
    letter-spacing: 1px;
    font-family: var(--sk-root-font-family);
    font-size: 1em;
    font-weight: normal;
  }

  .sk-button-reset:focus :global(svg),
  .sk-button-reset:active :global(svg) {
    position: relative;
    top: 0;
    left: 0;
  }

  .sk-button-reset :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>

<button
  type="button"
  on:click
  {...otherProps}
  class={btnClass}
>
  <slot />
</button>
