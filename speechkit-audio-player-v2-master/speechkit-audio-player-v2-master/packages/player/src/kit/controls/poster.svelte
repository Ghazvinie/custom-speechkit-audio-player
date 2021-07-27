<script>
  export let style = null
  export let url = ''
  export let imgStyle = null

  $: hasPoster = Boolean(url)
  $: posterClass = `sk-poster ${$$props.class || ''}`.trim()
</script>

<style>
  :global(:root) {
    --sk-poster-width: 60px;
  }

  .sk-poster {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    width: var(--sk-poster-width);
    height: var(--sk-poster-width);
  }

  .sk-poster img {
    width: 100%;
    height: 100%;
    border: 0;
    object-fit: contain;
  }
</style>

{#if hasPoster}
  <div
    class={posterClass}
    {style}
  >
    <img
      src={url}
      alt="publisher pic"
      style={imgStyle}
    />
  </div>
{/if}
