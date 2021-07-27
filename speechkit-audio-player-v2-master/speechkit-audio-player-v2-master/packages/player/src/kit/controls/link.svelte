<script context="module">
  import { omit } from '@speechkit/speechkit-audio-player-core/utils'
</script>

<script>
  $: otherProps = omit(['class'], $$props)
  $: linkClass = `sk-app-link ${$$props.class || ''}`.trim()
</script>

<a
  href="//"
  on:click
  target="_blank"
  rel="noreferrer"
  {...otherProps}
  class={linkClass}
>
  <slot />
</a>

<style>
  a.sk-app-link {
    font-size: var(--sk-font-size-link);
    text-decoration: none;
    color: var(--sk-link-color)!important;
    transition: color .2s ease;
    border: none;
    word-break: normal;
    box-shadow: none;
  }

  a.sk-app-link:hover {
    color: var(--sk-link-color--hover)!important;
  }
</style>
